import { Service } from '@/common/server/index';

export function getUserInfo() { // 获取userInfo
  return Service({
    url: '/api-monitor/user/info',
    method: 'post',
    params: {},
  });
}
export function userLogout() { // 登出
  return Service({
    url: '/milog/user/logout',
    method: 'get',
    params: {},
    baseURL: process.env.VUE_APP_MILOGBASRURL,
  });
}
