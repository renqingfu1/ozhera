import { Service } from '@/common/req/service';

export function getChartTypes(params) { // 图表类型
  return Service({
    url: '/log/analyse/type',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function createGrider(params) { // 创建仪表板
  return Service({
    url: '/log/dashboard/create',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getChartData(params) { // 获取图表数据
  return Service({
    url: '/log/analyse/data',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function previewChart(params) { // 预览图表
  return Service({
    url: '/log/analyse/dataPre',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getGridersData(params) { // 获取仪表板数据
  return Service({
    url: '/log/analyse/show',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function updateGriders(params) { // 更新仪表盘
  return Service({
    url: '/log/analyse/updateRef',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function createChart(params) { // 创建图表
  return Service({
    url: '/log/graph/create',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function delRaletion(params) { // 解除图表与仪表盘关联
  return Service({
    url: 'log/analyse/delRef',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function createRelChartGrider(params) { // 创建图表与仪表盘关联
  return Service({
    url: '/log/analyse/ref',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getKeyList(params) { // 创建图表与仪表盘关联
  return Service({
    url: '/log/analyse/key',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
