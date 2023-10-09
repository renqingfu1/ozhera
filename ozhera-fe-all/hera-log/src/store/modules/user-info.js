import { getUserInfoApi } from '@/common/req/list/user-info';
// eslint-disable-next-line import/prefer-default-export
export default {
  namespaced: true, // 使用命名空间，这样只在局部使用
  state: {
    userInfo: {},
  },
  mutations: {
    setUserInfo(state, data) {
      // eslint-disable-next-line no-underscore-dangle, no-unused-expressions
      window._Sentry?.setUser({
        id: data.user,
        username: data.name,
        email: data.email,
      });
      state.userInfo = { ...state.userInfo, ...data };
    },
  },
  actions: {
    GETUSERINFO(context) {
      getUserInfoApi().then((res) => {
        context.commit('setUserInfo', res.data || {});
      });
    },
    FRESHPAGE(context) {
      return getUserInfoApi().then((res) => {
        context.commit('setUserInfo', res.data || {});
      });
    },
  },
};
