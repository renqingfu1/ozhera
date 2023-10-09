import { getUserInfoApi } from '@/common/server/list/user-info';

export default {
  namespaced: true,
  state: {
    loading: false,
    userInfo: {
      user: '',
      name: '',
      displayName: '',
      departmentName: '',
      email: '',
      miID: null,
    },
  },
  mutations: {
    // 更新userInfo
    updateUserInfo(state, data) {
      state.userInfo = { ...state.userInfo, ...data };
    },
    updateLoading(state, data) {
      state.loading = data;
    },
  },
  actions: {
    // 获取应用列表
    GETUSERINFO: (context) => {
      if (context.state.loading) return;
      context.commit('updateLoading', true);
      getUserInfoApi({}).then((res) => {
        context.commit('updateUserInfo', res.data); // 更新应用列表
        context.commit('updateLoading', false);
      }).catch(() => {
        context.commit('updateLoading', false);
      });
    },
  },
  modules: {
  },
};
