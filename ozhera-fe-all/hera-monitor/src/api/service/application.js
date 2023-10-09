import service from '../http/index';

const server = {
    // 应用列表
    getAppList(params) {
        return service({
            url: '/mimonitor/listApp',
            method: 'post',
            params,
        });
    },
    // 添加应用
    addApp(params) {
        return service({
            url: '/mimonitor/addApp',
            method: 'post',
            params,
        });
    },
    // 删除应用
    delApp(params) {
        return service({
            url: '/mimonitor/delApp',
            method: 'get',
            params,
        });
    },
    // 项目列表
    getProjects(params) { // 
        return service({
            url: '/mimonitor/getProjects',
            method: 'post',
            params,
        });
    },
    // grafana链接查询
    getGrafanaUrl(params) {
        return service({
            url: '/mimonitor/getGrafanaUrlByAppName',
            method: 'get',
            params,
        });
    },
    // 慢查询、异常详情
    getUnusualDetial(params) {
        return service({
            url: '/prometheus/detail',
            method: 'post',
            params,
        });
    },
    getIndexProjects(params) { // 首页搜索
        return service({
            url: '/mimonitor/heraApps',
            method: 'post',
            params,
        });
    },
    getPlatformList(params) {
        return service({
            url: '/mimonitor/platFormList',
            method: 'get',
            params,
        });
    },
    getNotMioneApp(paramsProps) {
        let params = {
            ...paramsProps,
            ... { env: (process.env.NODE_ENV !== 'production') ? 'test' : '', }
        }
        return service({
            timeout: 20 * 1000,
            baseURL: '/xmon-api/',
            url: '/radar/getlist',
            method: 'get',
            params,
        });
    },
    // 获取应用实例
    getInstanceData(params) {
        return service({
            url: '/prometheus/instanceIpList',
            method: 'post',
            params,
        });
    },
    // 中间件实例列表
    getMiddlewareList(params) {
        return service({
            url: '/middleware/list',
            method: 'post',
            params,
        });
    },
    getStaticsNum(params) {
        return service({
            url: '/mimonitor/statistics',
            method: 'post',
            params,
        });
    },
    // 获取应用的环境、IP映射列表
    getServerEnvList(params) {
        return service({
            url: '/prometheus/serverEnvList',
            method: 'post',
            params,
        });
    },
    // 获取资源利用率（docker部署）url
    getResourceUrl(params) {
        return service({
            url: '/mimonitor/resourceUsage',
            method: 'get',
            params,
        });
    },
    // 获取资源利用率（k8s部署）url
    getK8sResourceUrl(params) {
        return service({
            url: '/mimonitor/resourceUsagek8s',
            method: 'get',
            params,
        });
    },
    getMifassModules(params) {
        return service({
            url: '/alarm/mifaas/functionList',
            method: 'get',
            params,
        });
    },
    getAPPType(params) {
        return service({
            url: '/mimonitor/getAppTypeByName',
            method: 'get',
            params,
        });
    },
    getLogPage(params) {
        return service({
            url: '/milog/store/app',
            method: 'get',
            params,
            baseURL:'/api-log'
        });
    },
};
export default server;