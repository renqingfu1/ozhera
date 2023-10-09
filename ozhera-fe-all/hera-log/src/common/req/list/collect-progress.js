import { Service } from '../service';

export default function getCollectProgress(params) { // 日志采集进度
  return Service({
    url: '/milog/col/process/imperfect',
    method: 'get',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
