import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import type { Connector } from "wagmi";
import { shortAddr, useWallet } from "@/hooks/useWallet";

export default function Header() {
	const {
		walletState,
		currentNetwork,
		connectWallet,
		disconnectWallet,
		connectors,
		availableNetworks,
		switchNetwork,
	} = useWallet();
	const [menuOpen, setMenuOpen] = useState(false);
	const [connectMenuOpen, setConnectMenuOpen] = useState(false);

	const isConnected = !!walletState.address;
	const chainLabel = useMemo(
		() =>
			currentNetwork?.name ||
			(walletState.chainId ? `Chain ${walletState.chainId}` : "-"),
		[currentNetwork?.name, walletState.chainId],
	);

	const handleConnect = async (connector: Connector) => {
		try {
			await connectWallet(connector);
			setConnectMenuOpen(false);
		} catch (e) {
			console.error("连接钱包失败:", e);
		}
	};

	const handleDisconnect = async () => {
		try {
			setMenuOpen(false);
			await disconnectWallet();
		} catch (e) {
			console.error("断开连接失败:", e);
		}
	};

	const handleSwitch = async (cid: number) => {
		try {
			await switchNetwork(cid);
		} catch (e) {
			console.error("切换网络失败:", e);
		}
	};

	return (
		<header className="sticky top-0 z-30 w-full backdrop-blur bg-white/70 border-b border-slate-200">
			<div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
				{/* Brand */}
				<Link to="/market" className="flex items-center gap-2">
					<div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-sm">
						W3
					</div>
					<span className="font-semibold text-slate-800 tracking-tight">
						Web3 School
					</span>
				</Link>

				{/* Nav */}
				<nav className="hidden sm:flex items-center gap-1 text-sm">
					{/* <NavItem to="/market" label="课程市场" />
          <NavItem to="/swap" label="兑换市场" />
          <NavItem to="/create" label="创建课程" /> */}
					<NavItem to="/profile" label="个人中心" />
				</nav>

				{/* Wallet */}
				<div className="relative">
					{isConnected ? (
						<>
							<button
								type="button"
								onClick={() => setMenuOpen((v) => !v)}
								className="flex items-center gap-3 rounded-full pl-3 pr-2 py-1.5 bg-slate-900 text-white hover:opacity-90 transition shadow-sm"
								aria-label="wallet-menu"
							>
								<span className="text-xs opacity-80">{chainLabel}</span>
								<span className="px-2 py-0.5 text-xs rounded bg-white/20">
									{shortAddr(walletState.address)}
								</span>
								<div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-xs font-semibold">
									{(walletState.address || "").slice(2, 4).toUpperCase()}
								</div>
							</button>

							{menuOpen && (
								<div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white shadow p-4">
									<div className="text-sm text-slate-600">连接状态</div>
									<div className="flex items-center gap-2 mb-3">
										<span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
										<span className="text-sm text-slate-800">已连接</span>
									</div>

									<div className="text-sm text-slate-600">钱包地址</div>
									<div className="font-mono text-xs mb-3 break-all">
										{walletState.address}
									</div>

									{/* 网络切换 */}
									<div className="text-sm text-slate-600">当前网络</div>
									<div className="mb-3 flex items-center gap-2">
										<select
											className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
											value={currentNetwork?.id ?? walletState.chainId ?? ""}
											onChange={(e) => handleSwitch(Number(e.target.value))}
										>
											{availableNetworks.map((n) => (
												<option key={n.id} value={n.id}>
													{n.name} ({n.id})
												</option>
											))}
										</select>
									</div>

									<div className="grid grid-cols-2 gap-3 mb-3">
										<InfoBox
											label="ChainId"
											value={walletState.chainId ?? "-"}
										/>
										<InfoBox
											label="ETH 余额"
											value={walletState.balance ?? "-"}
										/>
									</div>

									<button
										type="button"
										onClick={handleDisconnect}
										className="w-full rounded-lg border border-slate-300 py-2 text-sm hover:bg-slate-50"
									>
										断开连接
									</button>
								</div>
							)}
						</>
					) : (
						<>
							<button
								type="button"
								onClick={() => setConnectMenuOpen((v) => !v)}
								className="rounded-full px-4 py-2 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-white shadow hover:opacity-90"
							>
								连接钱包
							</button>
							{connectMenuOpen && (
								<div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow p-2">
									{connectors && connectors.length > 0 ? (
										connectors.map((c: Connector) => (
											<button
												type="button"
												key={c.id}
												onClick={() => handleConnect(c)}
												className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm"
											>
												{c.name}
											</button>
										))
									) : (
										<div className="px-3 py-2 text-sm text-slate-500">
											未发现可用钱包
										</div>
									)}
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</header>
	);
}

function NavItem({ to, label }: { to: string; label: string }) {
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				`px-3 py-2 rounded-xl transition hover:bg-slate-100 text-slate-700 ${
					isActive ? "bg-slate-200 font-medium" : ""
				}`
			}
		>
			{label}
		</NavLink>
	);
}

function InfoBox({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
			<div className="text-xs text-slate-500">{label}</div>
			<div className="font-semibold break-all">{String(value)}</div>
		</div>
	);
}
