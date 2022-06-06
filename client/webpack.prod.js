const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
   mode: 'production',
   resolve: {
    alias: {
      'APIConfig' : path.resolve(__dirname, './src/config/prod.config.ts')
    }
  }
});