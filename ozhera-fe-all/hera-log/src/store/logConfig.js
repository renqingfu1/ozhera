import { getAppDic } from '@/common/req/list/logConfig';

// eslint-disable-next-line import/prefer-default-export
export default {
  namespaced: true, // 使用命名空间，这样只在局部使用
  state: {
    appDic: [],
    // 日志类型
    logTypeOptions: [],
    // 索引类型
    indexOptions: [{
      value: 'date',
      label: 'DATE',
    }, {
      value: 'ip',
      label: 'IP',
    }, {
      value: 'text',
      label: 'TEXT',
    }],
    periodOptions: [{
      value: '1',
      label: '1天',
    }, {
      value: 7,
      label: '7天',
    }, {
      value: 30,
      label: '30天',
    }, {
      value: 90,
      label: '90天',
    }],
    parseTypeOptions: [
      {
        value: 2,
        label: '分隔符',
      },
      {
        value: 5,
        label: '自定义',
      },
      {
        value: 6,
        label: '正则解析',
      },
      {
        value: 7,
        label: 'Json解析',
      },
      {
        value: 8,
        label: 'Nginx解析',
      },
    ],
  },
  mutations: {
    SETAPPDIC(state, dicArr) {
      state.appDic = dicArr;
    },
    SETLOGTYPEDIC(state, logTypeDic) {
      state.logTypeOptions = logTypeDic;
    },
  },
  actions: {
    GETAPPDIC({ commit }, params) {
      getAppDic(params).then((res) => {
        commit('SETAPPDIC', res.data);
      }).catch((err) => {
        console.log(err);
      });
    },
  },
};
