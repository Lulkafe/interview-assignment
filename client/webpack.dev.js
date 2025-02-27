const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

 module.exports = merge(common, {
   mode: 'development',
   devtool: 'inline-source-map',
   output: {
        path: path.join(__dirname, './dist'),
        clean: true
    },
   resolve: {
     alias: {
       'APIConfig' : path.resolve(__dirname, './src/config/dev.config.ts')
     }
   }
 });