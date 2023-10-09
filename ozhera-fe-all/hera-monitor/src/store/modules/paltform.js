import server from '@/api/service/application.js';

export default {
  namespaced: true,
  state: {
    platFormOptions: [],
  },
  getters: {},
  mutations: {
    updatePlatFormOptions(state,data) {
      state.platFormOptions =data||[];
    }
  },
  actions: {
    GETPLATFORMLIST: (context) => {
      server.getPlatformList().then((res)=>{
        context.commit('updatePlatFormOptions', res ); 
      })
    },
  }
}