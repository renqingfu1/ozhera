const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath:process.env.VUE_APP_PUBLICPATH,
  productionSourceMap: true,
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'))
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
  pages: {
    index: {
      entry: "src/main.js",
      title: "lone | 中后台管理系统框架"
    }
  },
  devServer: require('./devServer/link'),
  configureWebpack: {
    //调试JS
    devtool: "source-map",
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: 'mimonitor-project',
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: 'umd',
      // 按需加载相关，设置为 webpackJsonp_mimonitor 即可
      jsonpFunction: 'webpackJsonp_mimonitor',
    },
  },
  css: {
    //查看CSS属于哪个css文件
    sourceMap: true
  }
}
