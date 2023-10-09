import { getChartTypes } from '@/common/req/list/user/charts';

export default {
  namespaced: true,
  state: {
    colNum: 12,
    chartTypes: [],
    timer: [ // 分析tab的时间
      new Date().setTime(new Date().getTime() - 15 * 60 * 1000),
      new Date().getTime(),
    ],
    isAutoRefresh: false,
  },
  mutations: {
    SETCHARTTYPES(state, data) {
      state.chartTypes = data;
    },
    SETTIME(state, data) {
      state.timer = data;
    },
    SETAUTOFRESH(state, data) {
      state.isAutoRefresh = data;
    },
  },
  actions: {
    GETCHARTTYPEOPTIONS({ commit }) {
      getChartTypes({}).then(({ data }) => {
        commit('SETCHARTTYPES', data);
      });
    },
    CHANGETIME({ commit }, timer) {
      commit('SETTIME', timer);
    },
    CHANGEAUTOFRESH({ commit }, value) {
      commit('SETAUTOFRESH', value);
    },
  },
};
