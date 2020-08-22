const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const PUBLIC_URL = process.env.PUBLIC_URL || '';

const config = {
  context: path.resolve(__dirname, 'src/client/'),
  entry: './index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist', 'client'),
  },
  devServer: {
    contentBase: path.resolve(__dirname, './public'),
    contentBasePublicPath: '/',
    stats: 'errors-only',
    port: 8000,
    compress: true,
    proxy: [
      {
        context: ['/socket.io', '/api'],
        target: 'http://localhost:9000'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader', exclude: '/node_modules/' }],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      PUBLIC_URL: 'http://localhost:8000',
    }),
    new CopyPlugin({
      patterns: [{ from: './public', to: './' }],
    }),
    new HtmlWebpackPlugin({
      template: './public/index.ejs',
      filename: './index.html',
      PUBLIC_URL: PUBLIC_URL,
    }),
  ],
};

module.exports = config;
