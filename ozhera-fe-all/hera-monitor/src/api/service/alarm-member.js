
import service from '../http/index';
const server = {
    // 新建告警组
  createAlarmGroup(params) {
    return service({
      url: '/alertGroup/create',
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
  getAppMember(params) { // 获取项目参与人
    return service({
      url: '/mimonitor/appMembers',
      method: 'get',
      params,
      timeout: 20 * 1000,
    });
  },
};
export default server;
