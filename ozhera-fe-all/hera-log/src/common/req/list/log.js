import { Service } from '../service';

// eslint-disable-next-line import/prefer-default-export
export function getStoreListApi(params) {
  return Service({
    url: '/milog/store/getall',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
// eslint-disable-next-line import/prefer-default-export
export function getLogsListApi(params) { // 日志查询
  const newParams = { ...params, asc: params.asc ? 'true' : 'false' };
  return Service({
    url: '/log/query',
    method: 'post',
    params: newParams,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
    timeout: 2 * 60 * 1000,
  });
}
export function getMatrixEsLogsListApi(params) { // Matrix ES日志查询
  const newParams = { ...params, asc: params.asc ? 'true' : 'false' };
  return Service({
    url: '/matrix/log/query',
    method: 'post',
    params: newParams,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
    timeout: 2 * 60 * 1000,
  });
}
// 获取es数据监控图表数据
export function getESChartsApi(propParams) {
  const params = { ...propParams };
  delete params.asc;

  return Service({
    url: '/milog/statistic/es',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
    timeout: 60 * 1000,
  });
}
export function getMatrixESChartsApi(propParams) {
  const params = { ...propParams };
  delete params.asc;

  return Service({
    url: '/matrix/statistic/es',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
    timeout: 60 * 1000,
  });
}
// 通过storeid 获取tailname集合
export function getTailByStore(params) {
  return Service({
    url: '/milog/tail/gettailname',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function getLogsByTrace(params) { // 查询机房下trace日志
  return Service({
    url: '/log/queryRegionTraceLog',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function getStoreAndTaillCascader(params) { //  用于user页面用
  return Service({
    url: '/milog/app/type/tail/storeId',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getStoreByRegion(params) { // 根据机房获取store
  return Service({
    url: '/milog/logstore/region/nameEn',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getLogsOffLine(params) { // 离线日志查询
  return Service({
    url: '/milog/hive/query',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
    timeout: 60 * 1000,
  });
}

export function getLogContext(params) { // 日志上下文
  return Service({
    url: '/log/context',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
    timeout: 60 * 1000,
  });
}
