/*
 * @Description:
 * @Date: 2021-12-01 19:42:54
 * @LastEditTime: 2021-12-01 19:42:55
 */
const path = require("path");

module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  runtimeCompiler: true,
  outputDir: "dist",
  devServer: {
    // 关闭主机检查，使微应用可以被 fetch
    disableHostCheck: true,
    // 配置跨域请求头，解决开发环境的跨域问题
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    proxy: {
      "/api-monitor": {
        target: `http://${process.env.VUE_APP_MAIN_BC_IP}:8099`,
        changeOrigin: true,
        pathRewrite: {
          "^/api-monitor": "",
        },
      },
      "/api": {
        target: "http://test.com",
        changeOrigin: true,
      },
      "/api-trace": {
        target: "http://test.com:30427",
        changeOrigin: true,
        pathRewrite: {
          "^/api-trace": "",
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: process.env.VUE_APP_PROJECT_NAME,
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: "umd",
      // 按需加载相关，设置为 webpackJsonp_vue-project 即可
      jsonpFunction: `webpackJsonp_${process.env.VUE_APP_PROJECT_NAME}`,
    },
  },
};
