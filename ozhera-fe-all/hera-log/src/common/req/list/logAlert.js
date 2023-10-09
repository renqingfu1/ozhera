/* eslint-disable import/prefer-default-export */
import { Service } from '../service';

export function getLogAlertList(params) {
  return Service({
    url: '/alert/getAll',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function switchLogAlert(flag, params) {
  return Service({
    url: `/alert/${flag}`,
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function deleteLogAlert(params) {
  return Service({
    url: '/alert/remove',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function createLogAlert(params) {
  return Service({
    url: '/alert/create',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getFeishuGroups(params) {
  return Service({
    url: '/alert/feishuGroups',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getApplicationList(params) {
  return Service({
    url: '/open/api/milog/app/list',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getLogPathList(params) {
  return Service({
    url: '/open/api/milog/config/log/path',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function updateLogAlert(params) {
  return Service({
    url: '/alert/update',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}

export function getAlertDetail(params) {
  return Service({
    url: '/alert/detail',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
