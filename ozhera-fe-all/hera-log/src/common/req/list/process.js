import { Service } from '../service';

// eslint-disable-next-line import/prefer-default-export
export function getStoreIpsApi(params) {
  return Service({
    url: '/milog/store/ips',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function logProcessApi(params) {
  return Service({
    url: '/milog/store/log/process',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
