import { Service } from '../service';

// eslint-disable-next-line import/prefer-default-export
export function getSpaceList(params) {
  return Service({
    url: '/milog/space/getbypage',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function deleteSpace(params) {
  return Service({
    url: '/milog/space/delete',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function addSpace(params) {
  return Service({
    url: '/milog/space/new',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function updateSpace(params) {
  return Service({
    url: '/milog/space/update',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getSpace(params) {
  return Service({
    url: '/milog/space/getbyid',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getStoreList(params) {
  return Service({
    url: '/milog/store/getbypage',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function addStoreReq(params) {
  return Service({
    url: '/milog/store/new',
    method: 'post',
    params,
    timeout: 30 * 1000,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getStoreById(params) {
  return Service({
    url: '/milog/store/getbyid',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function deleteStore(params) {
  return Service({
    url: '/milog/store/delete',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function getTailList(params) {
  return Service({
    url: '/milog/tail/getbypage',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function getTailCount(params) {
  return Service({
    url: '/milog/tail/getcntbystoreid',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function addTailReq(params) {
  return Service({
    url: '/milog/tail/new',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
    timeout: 30000,
  });
}

//  通过APPId查询环境
export function getEnvsFromApp(params) {
  return Service({
    url: '/milog/project/env/appId',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getMatrixDeploySpaces(params) {
  return Service({
    url: '/milog/project/matrix/deploySpace',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getMatrixIps(params) {
  return Service({
    url: '/milog/project/matrix/ip',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getAppDic(params) { // 获取所有app
  return Service({
    url: '/milog/tail/getapp',
    method: 'GET',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getAppListDic(params) { // 获取所有app
  return Service({
    url: '/mimonitor/listApp',
    method: 'POST',
    params,
    baseURL: process.env.VUE_APP_MONITOR,
  });
}
export function deleteTailReq(params) {
  return Service({
    url: '/milog/tail/delete',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function getTailByIdReq(params) {
  return Service({
    url: '/milog/tail/getbyid',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function updateTail(params) {
  return Service({
    url: '/milog/tail/update',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function getTypeDicApi(params) {
  return Service({
    url: '/log/logTemplate/list',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getTemplate(params) {
  return Service({
    url: '/log/logTemplate',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
// 收集速度
export function getTailRateDic(params) {
  return Service({
    url: '/milog/tail/tailrate',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function getMQConfigOptionsApi(params) { // 字典接口
  return Service({
    url: '/milog/dictionary/list',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getMachineByAppId(params) { // 查看mis应用机房信息
  return Service({
    url: '/milog/project/mis/zone/appId',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getAPPByStoreId(params) { // 查看该store下接入的所有应用
  return Service({
    url: '/milog/tail/app/store/id',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getMachineRooms(params) { // 获取机房options
  return Service({
    url: '/milog/dictionary/list',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function testTailConfig(params) { // 测试tail配置
  return Service({
    url: '/milog/logtail/parse/test',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function parseLogExample(params) { // 解析日志示例
  return Service({
    url: '/milog/logtail/parse/example',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function searchRecordList(params) { // 记录列表
  return Service({
    url: '/log/save/list',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function saveRecord(params) { // 记录保存
  return Service({
    url: '/log/save/favourite',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function updateRecord(params) { // 记录更新
  return Service({
    url: '/log/save/update',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
export function deleteRecord(params) { // 删除记录
  return Service({
    url: '/log/save/delete',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getTailsFromApp(params) { // 根据appId查询tail
  return Service({
    url: '/milog/logtail/tail/quick/app',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
