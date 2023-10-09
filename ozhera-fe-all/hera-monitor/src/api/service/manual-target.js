import service from '../http/index';

const server = {
  manualTargetListApi(params) { // 自定义指标列表
    return service({
      url: '/promql/template/search',
      method: 'post',
      params,
    });
  },
  manualTargetCreateApi(params) { // 自定义指标列表
    return service({
      url: '/promql/template/add',
      method: 'post',
      params,
    });
  },
  manualTargetEditApi(params) { // 自定义指标编辑
    return service({
      url: '/promql/template/edit',
      method: 'post',
      params,
    });
  },
  manualTargetDeleteApi(params) { // 自定义指标delete
    return service({
      url: '/promql/template/deleteById',
      method: 'post',
      params,
    });
  },
  manualTestPromQLApi(params) { // 测试proQL
    return service({
      url: '/promql/template/test_promql',
      method: 'post',
      params,
    });
  }
};
export default server;
