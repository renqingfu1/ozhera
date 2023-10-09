import { Service } from '../service';

// eslint-disable-next-line import/prefer-default-export
export function getAgentList(params) {
  return Service({
    url: '/agent/manage/list',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function agentSendConfig(params) {
  return Service({
    url: '/milog/agent/config/issue',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function logCollectSchedule(params) { // 日志收集进度
  return Service({
    url: '/milog/meta/process',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
