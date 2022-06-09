const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
   mode: 'production',
   output: {
        path: path.join(__dirname, '../docs'),
        clean: true
    },
   resolve: {
    alias: {
      'APIConfig' : path.resolve(__dirname, './src/config/prod.config.ts')
    }
  }
});