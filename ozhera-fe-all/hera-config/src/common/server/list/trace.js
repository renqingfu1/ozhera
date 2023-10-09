import qs from 'qs';
import { Service } from '@/common/server/index';

export function traceList(params) { // 获取列表
  return Service({
    url: '/api-trace/manager/getAllPage',
    method: 'get',
    params,
  });
}
export function deleteTrace(params) { // 删除
  return Service({
    url: '/api-trace/manager/delete',
    method: 'post',
    params: qs.stringify(params),
  });
}
export function getTraceDetail(params) { // 获取详情
  return Service({
    url: '/api-trace/manager/getDetail',
    method: 'get',
    params,
  });
}

export function editTrace(params) { // 新增/编辑
  return Service({
    url: '/api-trace/manager/insertOrUpdate',
    method: 'post',
    params: qs.stringify(params),
    type: 'formData',
  });
}
