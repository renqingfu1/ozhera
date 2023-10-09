import { Service } from '@/common/req/service';

// eslint-disable-next-line import/prefer-default-export
export function getTreeBySpace(params) { // 获取tree
  return Service({
    url: '/milog/index/getspacetree',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
