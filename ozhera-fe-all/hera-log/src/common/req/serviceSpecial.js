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
export const ServiceSpecial = axios.create({
  timeout: 10000, // 请求超时时间
  method: 'post',
});

ServiceSpecial.interceptors.request.use(
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
ServiceSpecial.interceptors.response.use((res) => {
  const { data } = res;
  if (!data) {
    msgFn(data.message || '出错了');
    return Promise.reject();
  }
  return data;
}, (error) => {
  if (error?.response?.status === 401) {
    // eslint-disable-next-line camelcase
    const { tpc_token, loginurl } = error.response.headers;
    // eslint-disable-next-line camelcase
    if (tpc_token === '1') {
      window.location.href = `${loginurl}?redirectUrl=${window.location.href}`;
    }
  } else if (error.message && !error.message.startsWith('timeout') && error.response.status !== 404) {
    msgFn(error.message);
  }
  return Promise.reject(error);
});
