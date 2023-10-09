module.exports = {
  disableHostCheck: true,
  port: 8099,
  open: true,
  hot: true,
  compress: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  proxy: {
    '/api-monitor': {
      target: `http://${process.env.VUE_APP_MAIN_BC_IP}:8099`,  
      changeOrigin: true,
      pathRewrite: {
        '^/api-monitor': '',
      },
    },
    '/api-log': {
      target: 'http://127.0.0.1:7788',
      changeOrigin: true,
      pathRewrite: {
        '^/api-log': '',
      },
    },
    '/xmon-api': {
      target: 'http://xmon',
      changeOrigin: true,
      pathRewrite: {
        '^/xmon-api': '',
      },
    }
  },
}