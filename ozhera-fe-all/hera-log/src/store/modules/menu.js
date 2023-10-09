const rawList = [
  {
    key: '/',
    text: '日志配置与查询',
    path: '/',
    icon: 'el-icon-tickets',
    child: [
      {
        key: '/admin/space',
        text: '日志配置',
        path: '/admin/space',
        name: 'space',
      }, {
        key: '/admin/logquery-offline',
        text: '离线日志查询',
        path: '/admin/logquery-offline',
        name: 'log',
      }, {
        key: '/admin/data-monitor',
        text: '数据监控',
        path: '/admin/data-monitor',
        name: 'dataMonitor',
      },
      {
        key: '1-5',
        text: '日志报警策略',
        path: '/admin/log-alert',
        name: 'logAlert',
        child: [],
      },
    ],
  },
  {
    key: '/admin/topic',
    text: 'MQ配置管理',
    path: '/admin/topic',
    icon: 'iconfont icon-config',
    child: [
      {
        key: '/admin/topic/list',
        text: '应用管理',
        path: '/admin/topic/list',
        name: 'topicList',
      }, {
        key: '/admin/mqconfig',
        text: '中间件配置',
        path: '/admin/mqconfig',
        name: 'mqConfig',
      },
    ],
  },
  {
    key: '/admin/agent',
    text: 'Agent管理',
    path: '/admin/agent',
    icon: 'el-icon-s-custom',
    child: [
      {
        key: '/admin/agent/list',
        text: 'Agent列表',
        path: '/admin/agent/list',
        name: 'agentList',
      },
    ],
  }, {
    key: '/admin/stream',
    text: 'Stream管理',
    path: '/admin/stream',
    icon: 'el-icon-receiving',
    child: [
      {
        key: '/admin/stream/list',
        text: 'Stream列表',
        path: '/admin/stream/list',
        name: 'streamList',
      },
    ],
  },
];
// eslint-disable-next-line import/prefer-default-export
export default {
  namespaced: true, // 使用命名空间，这样只在局部使用
  state: {
    list: rawList,
    defaultActive: null,
  },
  mutations: {
    updateActiveMutation(state, data) {
      state.defaultActive = data;
    },
  },
  actions: {
    updateActive(context, active) {
      context.commit('updateActiveMutation', active);
    },
  },

};
