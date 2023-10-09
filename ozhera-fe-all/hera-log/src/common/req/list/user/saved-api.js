import { Service } from '@/common/req/service';

export function spaceTreeApi(params) {
  return Service({
    url: '/log/save/storeTree',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function removeStoreTailApi(params) { // 去掉StoreTail
  return Service({
    url: '/log/save/defavourite',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function delSaveItemApi(params) { // 删除我收藏的列表
  return Service({
    url: '/log/save/delete',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getTailOptions(params) {
  return Service({
    url: '/milog/tail/getbyStoreId',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function swapPositionApi(params) {
  return Service({
    url: '/log/save/swap',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
