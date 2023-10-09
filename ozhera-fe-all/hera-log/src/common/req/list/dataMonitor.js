import { Service } from '../service';

const server = {
  // 获取topic数据
  getTopicList(params) {
    return Service({
      url: '/milog/topic/list',
      method: 'get',
      params,
      baseURL: process.env.VUE_APP_MIONEDOMAIN,
    });
  },
  // 获取图表数据
  getEChartData(params) {
    return Service({
      url: '/milog/statistic/rmq',
      method: 'post',
      params,
      baseURL: process.env.VUE_APP_MIONEDOMAIN,
    });
  },
};
export default server;
