import { Service } from '../service';

export function getResourceList(params) {
  return Service({
    url: '/milog/resource/with/resource/code',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function addResource(params) {
  return Service({
    url: '/milog/resource/operate',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getResourceDetail(params) {
  return Service({
    url: '/milog/resource/detail',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

//
export function isCreateStoreApi(params) {
  return Service({
    url: '/milog/resource/initialized/user/dept',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
