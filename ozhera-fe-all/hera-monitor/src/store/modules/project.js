import server from '@/api/service/application.js';
import { getQueryString } from '@/utils/index';

export default {
  namespaced: true,
  state: {
    appData: null, // 我参与和我关注的应用
    myAppData: null, // 我的应用列表
    myAppDataTotal: 0, // 我的应用列表数据总条数
    allAppData: null, // 所有应用列表
    allAppDataTotal: null, // 所有应用列表数据总条数
  },
  mutations: {
    // 更新我参与和我关注的应用
    updateAppList (state, data) {
      state.appData = data;
    },
    // 更新应用列表
    updateMyAppList (state, data) {
      state.myAppData = data;
    },
    // 更新项目数据
    updateAllAppData (state, data) {
      state.allAppData = data;
    },
    // 更新应用列表总条数
    updateMyAppListTotal (state, data) {
      state.myAppDataTotal = data;
    },
    // 更新项目数据总条数
    updateAllAppDataTotal (state, data) {
      state.allAppDataTotal = data;
    },
  },
  actions: {
    // 获取应用列表
    getAppList: (context ,cb) => {
      const param = {
        distinct: 1 // 应用去重
      }
      server.getAppList(param).then(res => {
        const list = res && res.list || [];
        // 获取url项目参数
        const id = getQueryString('id');
        const name = getQueryString('name');
        // 应用下拉数据没有url项目添加到下拉选项中
        const index = list.findIndex((item) => item.projectId == id);
        if (index == -1 && id && name) {
          list.push({
            projectId: Number(id),
            projectName: name
          })
        }
        context.commit('updateAppList', list); // 更新应用列表
        if(cb) cb();
      });
    },
  },
  modules: {
  }
}
