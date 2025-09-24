import { Octokit } from "@octokit/rest";
import OpenAI from "openai";
import fs from "fs";

// env
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!GITHUB_TOKEN) throw new Error("Missing GITHUB_TOKEN");
if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");

const octokit = new Octokit({ auth: GITHUB_TOKEN });
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// 1) 解析事件，获取 PR 基本信息
const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
if (!event.pull_request) throw new Error("This workflow must run on pull_request-like events");

const prNumber = event.pull_request.number;
const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

// 2) 拉取 PR diff（分页！）
const files = await octokit.paginate(octokit.pulls.listFiles, {
  owner,
  repo,
  pull_number: prNumber,
  per_page: 100,
});

// 仅收集可用 patch（大文件/二进制文件会没有 patch 字段）
let diffs = files
  .map(f => `File: ${f.filename}\n${f.patch ? f.patch : ""}`)
  .join("\n\n");

// 3) 控制上下文大小（避免超限）
const MAX_CHARS = 90_000;
if (diffs.length > MAX_CHARS) {
  diffs = diffs.slice(0, MAX_CHARS) + "\n\n# [Truncated due to size]\n";
}

// 4) 调 OpenAI Responses API
const resp = await openai.responses.create({
  model: "gpt-4.1-mini", // 可换 o4-mini 追求更强审查
  input: [
    { role: "system", content: "你是一个专业的前端代码审查助手。只根据给定 diff 提出问题与可执行建议，中文输出。" },
    { role: "user", content: `请审查以下 PR 改动并给出建议（按问题列表+建议的格式）：\n\n${diffs}` }
  ]
});

// 5) 提取文本并回帖
const review = resp.output_text?.trim() || "（未生成内容）";
await octokit.issues.createComment({
  owner,
  repo,
  issue_number: prNumber,
  body: `🤖 **AI Code Review**\n\n${review}\n\n<sub>model: gpt-4.1-mini</sub>`
});

console.log("✅ AI review 已评论到 PR");
