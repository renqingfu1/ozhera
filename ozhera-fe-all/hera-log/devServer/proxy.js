const devApi = 'https://ozhera.demo.yling.top';

module.exports = {
  open: true,
  hot: true,
  port: 8088,
  compress: true,
  // 关闭主机检查，使微应用可以被 fetch
  disableHostCheck: true,
  // 配置跨域请求头，解决开发环境的跨域问题
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  proxy: {
    '/api-log': {
      target: devApi,
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api-log': '',
      // },
    },
    '/api-monitor': {
      target: devApi,
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api-monitor': '',
      // },
    },
  },
};
