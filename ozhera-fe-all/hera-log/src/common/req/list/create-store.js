import { Service } from '../service';

export default function getManualKeys(params) { // 根据appId查询tail
  return Service({
    url: '/milog/store/es/index',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
