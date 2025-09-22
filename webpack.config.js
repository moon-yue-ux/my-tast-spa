const merge = require('webpack-merge');
const argv = require('yargs-parser')(process.argv.slice(2));
const { resolve } = require('path');
const _mode = argv.mode || 'development';
const _mergeConfig = require(`./config/webpack.${_mode}.js`);
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清理上一次编译结果
const { ThemedProgressPlugin } = require('themed-progress-plugin'); // 进度条
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // css 分离
const _modeflag = _mode === 'production' ? true : false;

const webpackBaseConfig = {
  entry: {
    main: resolve('src/index.tsx')
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'swc-loader',
        }
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
        //使用js方式插入
        // use: ['style-loader', 'css-loader'],
      },
    ]
  },
  resolve: {
    alias: {
      '@': resolve('src/')
    },
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.css'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // 配置css 分离 判断环境 生成不同的文件
    new MiniCssExtractPlugin({
      filename: _modeflag ? 'styles/[name].[contenthash:5].css' : 'styles/[name].css',
      chunkFilename: _modeflag ? 'styles/[name].[contenthash:5].css' : 'styles/[name].css',
      ignoreOrder: false,
    }),
    new ThemedProgressPlugin(),
  ]
}
module.exports = merge.default(webpackBaseConfig, _mergeConfig);