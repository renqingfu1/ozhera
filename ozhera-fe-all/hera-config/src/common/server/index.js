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
    if (config.method === 'post') {
      config.data = config.params;
      config.params = {};
    }
    return config;
  },
  (err) => Promise.reject(err),
);

// 添加响应拦截器
Service.interceptors.response.use((res) => {
  const { data } = res;
  if (data.code && data.code !== 0) {
    msgFn(data.message || `出错了:${data.code}`);
    return Promise.reject();
  }
  return data;
}, (e) => {
  if (e?.response?.status === 401) {
    const { loginurl } = e.response.headers;
    if (!loginurl) return undefined;
    window.location.href = `${loginurl}?redirectUrl=${window.location.href}`;
  } else if (e.message && !e.message.startsWith('timeout') && e.response.status !== 404) {
    msgFn(e.message);
  }
  return Promise.reject(e);
});
