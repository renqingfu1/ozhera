import serverTesla from "@/api/service/alarm-strategy-gateway";

export default {
  namespaced: true,
  state: {
    teslaOptions:[]
  },
  getters: {},
  mutations: {
    initOptions(state,param) {
      state.teslaOptions = param;
    },
  },
  actions: {
    GETTESLAOPTIONS(context){
      return serverTesla.getTeslaCascade({}).then(res => {
        context.commit('initOptions', res||[]); 
        this.teslaOptions = res.list;
      });
    },
  }
}