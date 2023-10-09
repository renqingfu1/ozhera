import { Service } from '@/common/server/index';

export function getAppList(params) { // app列表
  return Service({
    url: '/mimonitor/listApp',
    method: 'post',
    params,
    baseURL: '/api-monitor',
  });
}
export function deleteTrace(params) { // 删除
  return Service({
    url: '/manager/delete',
    method: 'post',
    params,
    baseURL: '/api-trace',
  });
}
