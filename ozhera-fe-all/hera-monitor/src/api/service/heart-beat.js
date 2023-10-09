import service from '../http/index';

const server = {
  configList(params) {
    return service({
        url: '/appHeartBeat/getConfig',
        method: 'get',
        params,
    });
  },
  configAdd(params) {
    return service({
        url: '/appHeartBeat/createConfig',
        method: 'post',
        params,
    });
  },
  getEnvOptions(params) {
    return service({
        url: '/appDeploy/envList',
        method: 'get',
        params,
    });
  },
  searchGroupApi(params){
    return service({
        url: '/alertGroup/search',
        method: 'post',
        params:{
          ...params,
          pageSize:50
        },
    });
  },
  createConfig(params){
    return service({
      url: '/appHeartBeat/createConfig',
      method: 'post',
      params,
    });
  },
  editConfig(params){
    return service({
      url: '/appHeartBeat/editConfig',
      method: 'post',
      params,
    });
  },
  deleteConfig(params){
    return service({
      url: '/appHeartBeat/delConfig',
      method: 'get',
      params,
    });
  }
};
export default server;