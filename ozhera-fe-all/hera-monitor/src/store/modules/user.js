import server from '@/api/service/user-info.js';

export default {
  namespaced: true,
  state: {
    userInfo: {
      user:'',
      name:'',
      displayName:'',
      departmentName:'',
      email:'',
      miID:null
    }
  },
  mutations: {
    // 更新userInfo
    updateUserInfo (state, data) {
      window._Sentry?.setUser({
        id: data.user,
        username: data.name,
        email: data.email,
      });
      state.userInfo = {...state.userInfo,...data};
    },
  },
  actions: {
    // 获取应用列表
    GETUSERINFO: (context) => {
      server.getUserInfo({}).then(res => {
        context.commit('updateUserInfo', res ); // 更新应用列表
      }).catch((err)=>{
        console.log('err', err);
      });
    },
  },
  modules: {
  }
}
