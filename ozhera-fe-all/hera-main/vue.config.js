// vue.config.js
const openSourceUrl='https://ozhera.demo.yling.top/';

module.exports = {
  devServer: {
    compress: true,
    disableHostCheck: true,
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
    },
  },
};
