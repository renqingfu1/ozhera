import service from '../http/index';

const server = {
    // 获取模板列表
    getTemplateList(params) {
        return service({
            url: '/alarm/template/list',
            method: 'get',
            params,
        });
    },
    getTemplateListIndex(params) { // 模板列表数据
        return service({
            url: '/alarm/template/query',
            method: 'post',
            params,
        });
    },
    getTepList(params,cancelToken) { // 模板列表数据
        return service({
            url: '/alarm/template/query',
            method: 'post',
            params,
            cancelToken
        });
    },
    // 添加监控模板 除了自定义模板
    addAlarmTemplate(params) {
        return service({
            url: '/alarm/template/add',
            method: 'post',
            params,
        });
    },
    // 编辑监控模板
    editAlarmTemplate(params) {
        return service({
            url: '/alarm/template/edit',
            method: 'post',
            params,
        });
    },
    // 获取监控模板详情
    getTemplateDetail(params) {
        return service({
            url: '/alarm/template/get',
            method: 'get',
            params,
        });
    },
    // 获取监控模板详情 可删除
    getTemDetailCancel(params,cancelToken) {
        return service({
            url: '/alarm/template/get',
            method: 'get',
            params,
            cancelToken
        });
    },
     // 删除报警模板  
     deleteAlarmTemplate(params){
        return service({
            url: '/alarm/template/delete',
            method: 'post',
            params,
        });
    },
    // 获取报警规则下拉列表数据
    getRulesOption(params) {
        return service({
            url: '/alarm/ruleSelectDataInfo',
            method: 'get',
            params,
        });
    },
};
export default server;
