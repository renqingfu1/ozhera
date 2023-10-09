import { Service } from '@/common/req/service';

// eslint-disable-next-line import/prefer-default-export
export function getUserInfoApi() { // 获取userInfo
  return Service({
    url: '/',
    method: 'get',
    params: {},
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function userLogout() { // 获取所有space
  return Service({
    url: '/milog/user/logout',
    method: 'get',
    params: {},
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function logoutOpen(url, params) {
  return Service({
    url,
    method: 'get',
    params,
  });
}
