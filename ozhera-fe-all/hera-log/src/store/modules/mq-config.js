import { getMQConfigOptionsApi } from '@/common/req/list/logConfig';
// eslint-disable-next-line import/prefer-default-export
export default {
  namespaced: true, // 使用命名空间，这样只在局部使用
  state: {
    typeOptions: [],
    mqOptions: [],
  },
  mutations: {
    SETTYPOPTIONS(state, data) {
      state.typeOptions = data || [];
    },
    SETMQOPTIONS(state, data) {
      state.mqOptions = data || [];
    },
    SETAllOPTIONS(state, data) {
      console.log('state', state, 'data', data);
    },
  },
  actions: {
    GETTYPEOPTIONSAPI({ commit }, code) {
      getMQConfigOptionsApi({ codes: [code] }).then((res) => {
        commit('SETTYPOPTIONS', res.data[code]);
      });
    },
    GETMQOPTIONSAPI({ commit }, codeArr) {
      getMQConfigOptionsApi({ codes: codeArr }).then((res) => {
        codeArr.forEach((item) => {
          commit('SETAllOPTIONS', {
            name: item,
            data: res.data[item],
          });
        });
      });
    },
  },
};
