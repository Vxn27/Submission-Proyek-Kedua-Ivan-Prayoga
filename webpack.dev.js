const path = require('path');
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  devServer: {
    static: [
      path.join(__dirname, 'dist'),
      path.join(__dirname),
    ],
    port: 9000,
    proxy: [
      {
        context: ['/v1'],        // path yang mau diproxy
        target: 'https://story-api.dicoding.dev',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
      },
    ],
  }
});
