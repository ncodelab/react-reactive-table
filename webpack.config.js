var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval',
  devServer: { hot: true },
  entry: ['./src/js/index.jsx'],
  output: {
    path: __dirname + '/dist',
    filename: './bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.(jsx)$/,
        loader: 'babel'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
