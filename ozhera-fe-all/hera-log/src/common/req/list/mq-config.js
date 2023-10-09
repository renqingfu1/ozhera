import { Service } from '../service';

// eslint-disable-next-line import/prefer-default-export
export function getMQConfigApi(params) {
  return Service({
    url: '/milog/middleware/config/page',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function addMQConfig(params) {
  return Service({
    url: '/milog/middleware/config/add',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
// 更新
export function updateMQConfig(params) {
  return Service({
    url: '/milog/middleware/config/update',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
// 更新
export function getMQConfigDetail(params) {
  return Service({
    url: '/milog/middleware/config/detail/id',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
// 删除mqconfig
export function deleteMQConf(params) {
  return Service({
    url: '/milog/middleware/config/delete',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
