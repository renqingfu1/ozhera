import { getUserInfo } from '@/common/server/list/user-info';

export default {
  namespaced: true,
  state: {
    userInfo: {
      user: '',
      name: '',
      avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      displayName: '',
      departmentName: '',
      firstDepartment: '',
      secondDepartment: '',
      email: '',
      miID: null,
    },
  },
  mutations: {
    // 更新userInfo
    updateUserInfo(state, data) {
      state.userInfo = {
        ...state.userInfo,
        ...data,
      };
    },
  },
  actions: {
    // 获取用户信息
    GETUSERINFO: (context) => {
      getUserInfo({}).then((res) => {
        context.commit('updateUserInfo', res.data);
      }).catch((err) => {
        console.log('err', err);
      });
    },
  },
  modules: {
  },
};
