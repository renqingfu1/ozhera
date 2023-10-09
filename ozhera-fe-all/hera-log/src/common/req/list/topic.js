import { Service } from '../service';

// eslint-disable-next-line import/prefer-default-export
export function getTopicList(params) {
  return Service({
    url: '/milog/app/topic/list',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function getTopicName(params) {
  return Service({
    url: '/milog/topic/list',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function addAPPTopic(params) {
  return Service({
    url: '/milog/app/topic/create',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function editAPPTopic(params) {
  return Service({
    url: '/milog/app/topic/update',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
