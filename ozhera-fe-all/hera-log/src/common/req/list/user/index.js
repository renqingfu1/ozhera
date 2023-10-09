import { Service } from '@/common/req/service';

// eslint-disable-next-line import/prefer-default-export
export function getAllSpace() { // 获取所有space
  return Service({
    url: '/milog/space/getall',
    method: 'get',
    params: {},
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function getUnlinkApp() { // 获取所有space
  return Service({ // 带接入应用
    url: '/milog/index/getunaccessapp',
    method: 'get',
    params: {},
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function getDefaultValuelistApi() { // 快速接入获取索引列
  return Service({
    url: '/milog/index/fastaccesslogpattern',
    method: 'get',
    params: {},
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function getStoreBySpaceApi(params) { // 根据spaceID获取store
  return Service({ // 带接入应用
    url: '/milog/store/getbyspace',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function getLogtailByStoreId(params) { // 根据 storeId 查询 logtail
  return Service({
    url: '/milog/tail/getbyStoreId',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function getLogtailTopN() { // Logtail收集行数Top10
  return Service({
    url: '/log/statistics/collectTop',
    method: 'get',
    params: {},
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function getLogtailTrend(params) { // Logtail收集行数Top10
  return Service({
    url: '/log/statistics/collectTrend',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function getSpaceTopN() { // space收集行数Top10
  return Service({
    url: '/log/statistics/spaceCollectTop',
    method: 'get',
    params: {},
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function getSpaceTrend(params) { // space折线图
  return Service({
    url: '/log/statistics/spaceCollectTrend',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
