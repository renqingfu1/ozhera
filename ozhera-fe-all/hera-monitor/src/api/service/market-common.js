import service from '../http/index';

const server = {
    // 项目列表
    getProjects(params) { //
        return service({
            url: '/mimonitor/getProjects',
            method: 'post',
            params,
        });
    },
    // 获取DubboService列表数据
    getDubboServiceListPromise(params) {
        return service({
            url: '/api/prometheus/getDubboServiceList',
            method: 'get',
            params,
        });
    },
    // 获取平台类型
    getPlatFormListPromise(params) {
        return service({
            url: '/mimonitor/platFormList',
            method: 'get',
            params,
        });
    },
    // 获取应用列表
    getAppListPromise(params) {
        return service({
            url: '/mimonitor/heraApps',
            method: 'post',
            params,
        });
    },
    getMarketBase(params){
        return service({
            url: '/mimonitor/grafanaInterfaceList',
            method: 'get',
            params,
        });
    }
};
export default server;
