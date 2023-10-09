import service from '../http/index';

const server = {
    // 慢查询
    slowQuery(params) {
      return service({
          url: '/prometheus/queryRange',
          method: 'post',
          params,
      });
    },
    // 异常
    getException(params) {
      return service({
          url: '/prometheus/queryIncrease',
          method: 'post',
          params,
      });
    },
    // 日志
    getLogList(params) {
      return service({
          url: '/prometheus/logInfo',
          method: 'post',
          params,
      });
    },
    getStatisticsNum(params){
      return service({
        url: '/mimonitor/titlenum/statistics',
        method: 'post',
        params,
      });
    }    
};
export default server;
