// vue.config.js
const path = require('path');
const openSourceUrl='https://ozhera.demo.yling.top/';

module.exports = {
  publicPath: `${process.env.VUE_APP_PUBLICPATH}`,
  devServer: {
    // 监听端口
    port: 8100,
    open: true,
    hot: true,
    compress: true,
    // 关闭主机检查，使微应用可以被 fetch
    disableHostCheck: true,
    // 配置跨域请求头，解决开发环境的跨域问题
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/api-log': {
        target: openSourceUrl,
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api-log': '',
        // },
      },
      '/api-monitor': {
        target: openSourceUrl,
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api-monitor': '',
        // },
      },
      '/api-trace': {
        target: openSourceUrl,
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api-trace': '',
        // },
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: process.env.VUE_APP_PROJECT_NAME,
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: 'umd',
      // 按需加载相关，设置为 webpackJsonp_vue-projec 即可
      jsonpFunction: `webpackJsonp_${process.env.VUE_APP_PROJECT_NAME}`,
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule('fonts')
      .test(/\.(ttf|woff)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .tap((options1) => {
        const optionsChain = {
          ...options1,
          limit: 99999999,
          name: '[name].[hash:7].[ext]',
        };
        return optionsChain;
      })
      .end();
  },
};
