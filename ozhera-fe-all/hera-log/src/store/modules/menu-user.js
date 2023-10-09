import { filterMenuByMode, isAllMenuMode } from '@/utils/MenuManager';

const rawList = [
  {
    key: '1',
    text: '日志概览',
    path: '/user/index',
    icon: 'iconfont icon-yingyongjieruguanli',
    type: 'userAdmin',
  }, {
    key: '2',
    text: '日志管理',
    path: '/user/space-tree',
    icon: 'iconfont icon-rizhiguanli',
  },
  // {
  //   key: '3',
  //   text: '报警策略',
  //   path: '/user/log-alert',
  //   icon: 'iconfont icon-baojingliebiao',
  //   mode: 'general',
  // },
  {
    key: '4',
    text: '资源管理',
    path: '/user/resource',
    icon: 'iconfont icon-resource',
    mode: 'general',
    type: 'userAdmin',
  },
  // {
  //   key: '5',
  //   text: '采集进度',
  //   path: '/user/collect-progress',
  //   icon: 'iconfont icon-jindulishi',
  //   type: 'admin',
  // },
];
// eslint-disable-next-line import/prefer-default-export
export default {
  namespaced: true, // 使用命名空间，这样只在局部使用
  state: {
    list: rawList,
    defaultActive: null,
    isCollapse: false,
    mode: 'all', // 菜单模式，中国区全部菜单，非中国区精简菜单
    isAllMenuMode: true,
  },
  mutations: {
    updateActiveMutation(state, data) {
      const filter = state.list.filter((item) => data.indexOf(item.path) > -1);
      if (filter.length > 0) {
        state.defaultActive = filter[0].path;
      }
    },
    switchCollapse(state) {
      state.isCollapse = !state.isCollapse;
    },
    menuSwitchCollapse(state, params) {
      state.isCollapse = params;
    },
    setMenu(state) {
      state.mode = 'all';
      state.isAllMenuMode = isAllMenuMode(state.mode);
      state.list = filterMenuByMode(rawList, state.mode);
    },
  },
  actions: {
    updateActive(context, active) {
      context.commit('updateActiveMutation', active);
    },
  },
};
