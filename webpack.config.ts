const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  watch: true,
  entry: ['./src/client/index.tsx'],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: `${__dirname}/dist`,
    publicPath: '/',
    filename: 'app.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/html/index.html',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      __DEV__: true,
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    liveReload: true,
    port: 8000,
    historyApiFallback: true,
    writeToDisk: true,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:9000'
      }
    ]
  },
};
