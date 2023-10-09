/**
 * 基于axios库的HTTP请求
 */
import axios from 'axios'
import { Message } from 'element-ui';

// 对所有 axios 请求做处理
// axios.defaults.withCredentials = true;

const service = axios.create({
  timeout: 10*1000
})

service.interceptors.request.use(
    config => {
      if (/^\/open\//.test(config.url)) {
        config.baseURL = '/'
      }else{
        config.baseURL = config.baseURL|| process.env.VUE_APP_API;
      }
      if (config.method === 'post') {
        config.data =config.data || config.params;
        config.params = {};
      }
      return config;
    },
    error => {
      // 发送失败
      console.log(error)
      Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(response => {
  const { code,data,message } = response.data;
  if (!(code === 0 || code === 200)) {
    showError(`${response.config.url}:${message}`);
    return Promise.reject();
  }
  return data;
},error => {
  if (error && error.response) {
    if (error?.response?.status === 401) {
      // eslint-disable-next-line camelcase
      const { tpc_token,loginurl } = error.response.headers;
      // eslint-disable-next-line camelcase
      if (tpc_token === '1') {
        window.location.href = `${loginurl}?redirectUrl=${window.location.href}`;
      }
    } else if (error.message && !error.message.startsWith('timeout') && error.response.status !== 404) {
      console.log(error.message);
    }
  }
})

// 输出错误信息
function showError(msg) {
  Message({
    message: msg,
    type: 'error',
    duration: 3 * 1000,
  });
}

export default service
