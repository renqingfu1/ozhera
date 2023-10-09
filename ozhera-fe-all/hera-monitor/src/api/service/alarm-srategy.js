
import service from '../http/index';
const server = {
    // 获取未设置策略的应用
    getNoConfigApp(params) {
        return service({
            url: '/alarm/appAlarmRules/noConfigApp',
            method: 'post',
            params,
        });
    },
    // // 获取应用报警策略模板
    getAlarmStrategyList(params) {
        return service({
            url: '/alarm/appAlarmRules/query',
            method: 'post',
            params,
        });
    },
    // 添加监控模板
    addAlarmStrategry(params) {
        return service({
            url: '/alarm/rule/add',
            method: 'post',
            params,
        });
    },
    // 复制监控模板
    copyAlarmStrategry(params) {
        return service({
            url: '/alarm/rule/copy',
            method: 'post',
            params,
        });
    },
    // 报警组下拉选择
    alarmGroupList(params) {
        return service({
            url: '/alarm/alertTeam/query',
            method: 'post',
            params,
        });
    },
    // 是否开启报警
    switchOpenAlarm(params) {
        return service({
            url: '/alarm/strategy/enabled',
            method: 'post',
            params,
        });
    },
     // 根据iamid获取策略详情
     getStrategyDetail(params) {
        return service({
            url: '/alarm/strategy/detailed',
            method: 'post',
            params,
        });
    },
    // 编辑报警策略
    editStrategy(params) {
        return service({
            url: '/alarm/strategy/edit',
            method: 'post',
            params,
        });
    },
    // 删除报警策略
    delStrategy(params) {
        return service({
            timeout: 30000,
            url: '/alarm/strategy/deleteById',
            method: 'post',
            params,
        });
    },
     // 策略报警策略
     strategyListApi(params) {
        return service({
            url: '/alarm/strategy/search',
            method: 'post',
            params,
        });
    },
    // 获取报警策略类型
    strategyTypesApi(params) {
        return service({
            url: '/alarm/strategy/type_list',
            method: 'post',
            params,
        });
    },
    manualTemListApi(params) {
        return service({
            url: '/promql/template/search',
            method: 'post',
            params,
        });
    },
    // tesla网关列表
    taslaGateWay(params) {
        return service({
            url: '/tesla/groups',
            method: 'get',
            params,
        });
    },
    getMyApp(params){ // 我参与及我关注的应用
        return service({
            url: 'mimonitor/my_and_care_app_list',
            method: 'post',
            params,
        });
    },
    searchGroupApi(params) {
        return service({
            url: '/alertGroup/user/search',
            method: 'post',
            params:{
                ...params,
                pageSize:50
            },
        });
    },
    deleteRule(params){
        return service({
            url: '/alarm/rule/delete',
            method: 'post',
            params,
        });
    },
    editRuleSingle(params){
        return service({
            url: '/alarm/rule/edit/single',
            method: 'post',
            params,
        });
    },
    getAppDomain(params){
        return service({
            url: '/prometheus/httpClientDomainList',
            method: 'post',
            params,
        });
    }
};
export default server;
