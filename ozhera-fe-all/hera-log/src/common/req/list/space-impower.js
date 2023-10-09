import { Service } from '../service';

// eslint-disable-next-line import/prefer-default-export
export function getSpacePowerTree(params) {
  return Service({
    url: '/milog/space/getPermission',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function editSpacePower(params) {
  return Service({
    url: '/milog/space/setPermission',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
