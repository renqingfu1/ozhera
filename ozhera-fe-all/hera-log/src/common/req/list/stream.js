import { Service } from '../service';

// eslint-disable-next-line import/prefer-default-export
export function getStreamList(params) {
  return Service({
    url: '/stream/manage/list',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function streamSendConfig(params) {
  return Service({
    url: '/milog/stream/config/issue',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
