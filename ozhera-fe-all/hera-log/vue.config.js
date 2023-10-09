/* eslint-disable no-param-reassign */
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');

module.exports = {
  publicPath: process.env.VUE_APP_PUBLICPATH,
  // eslint-disable-next-line global-require
  devServer: require('./devServer/proxy'),
  chainWebpack: (config) => {
    // 打包分析
    if (process.env.IS_ANALYZ) {
      config.plugin('webpack-report')
        .use(BundleAnalyzerPlugin, [{
          analyzerMode: 'static',
        }]);
    }
    config.module
      .rule('fonts')
      .test(/\.(ttf|woff)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .tap((options) => {
        options = {
          ...options,
          limit: 99999999,
          name: '[name].[hash:7].[ext]',
        };
        return options;
      })
      .end();
  },
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : undefined,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: 'milog',
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: 'umd',
      // 按需加载相关，设置为 webpackJsonp_vue-projec 即可
      jsonpFunction: 'webpackJsonp_vue-project',
    },
  },
  productionSourceMap: true,
  css: {
    extract: false,
  },
};
