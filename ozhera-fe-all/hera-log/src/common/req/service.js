/* eslint-disable no-param-reassign */
import axios from 'axios';
import { Message } from 'element-ui';

function msgFn(msg) {
  Message({
    message: msg,
    type: 'error',
    duration: 3 * 1000,
  });
}

// 使用create方法创建axios实例
// eslint-disable-next-line import/prefer-default-export
export const Service = axios.create({
  timeout: 10000, // 请求超时时间
  method: 'post',
});

Service.interceptors.request.use(
  (config) => {
    if (config.method === 'post' || config.method === 'put') {
      config.data = config.params;
      config.params = {};
      // if (config.headers['Content-Type'] === 'application/json') {
      //   config.headers['Content-Type'] = config['Content-Type'];
      //   config.data = JSON.stringify(config.data);
      // }
    }
    return config;
  },
  (err) => Promise.reject(err),
);

// 添加响应拦截器
Service.interceptors.response.use((res) => {
  const { data } = res;
  if (data.code !== 0) {
    msgFn(data.message || '出错了');
    return Promise.reject();
  }
  const tpcDomain = res.headers.tpc_home_url_head;
  const headerObj = tpcDomain ? { tpcDomain } : {};
  return { ...data, ...headerObj };
}, (error) => {
  if (error?.response?.status === 401) {
    const { loginurl } = error.response.headers;
    window.location.href = `${loginurl}?redirectUrl=${window.location.href}`;
  } else if (error.message && !error.message.startsWith('timeout') && error.response.status !== 404) {
    msgFn(error.message);
  }
  return Promise.reject(error);
});
