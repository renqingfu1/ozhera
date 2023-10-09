import { Service } from '@/common/server/index';

// eslint-disable-next-line import/prefer-default-export
export function getUserInfoApi() { // 获取所有space
  return Service({
    url: '/user/info',
    method: 'get',
    params: {},
    baseURL: process.env.VUE_APP_MIMONITORBASEURL,
  });
}
