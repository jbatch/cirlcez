const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');
const dotenvConfig = dotenv.config().parsed;

const PUBLIC_URL = process.env.PUBLIC_URL || '';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
const config = {
  context: path.resolve(__dirname, 'src/client/'),
  entry: './index.ts',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist', 'client'),
  },
  devServer: {
    contentBase: path.resolve(__dirname, './public'),
    contentBasePublicPath: '/',
    stats: 'errors-only',
    port: 8000,
    host: process.env.HOST || 'localhost',
    compress: true,
    proxy: [
      {
        context: ['/socket.io', '/api'],
        target: `http://${process.env.HOST || 'localhost'}:9000`,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' }],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      PUBLIC_URL: 'http://localhost:8000',
      USE_SECURE_CONNECTION: process.env.NODE_ENV === 'production',
      ...dotenvConfig,
    }),
    new CopyPlugin({
      patterns: [{ from: './public', to: './assets', globOptions: { ignore: ['*.html'] } }],
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
      PUBLIC_URL: PUBLIC_URL,
    }),
  ],
};

module.exports = config;
