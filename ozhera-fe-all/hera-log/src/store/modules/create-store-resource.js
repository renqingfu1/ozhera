export default {
  namespaced: true, // 使用命名空间，这样只在局部使用
  state: {
    initializedFlag: false, // 是否已经初始化
    showFlag: false,
    notInitializedMsg: '',
    mqResourceList: [],
    esResourceList: [],
  },
  mutations: {
    SETAllDATA(state, obj) {
      state.initializedFlag = obj.initializedFlag || false;
      state.showFlag = obj.showFlag || false;
      state.mqResourceList = obj.mqResourceList || [];
      state.esResourceList = obj.esResourceList || [];
      state.notInitializedMsg = obj.notInitializedMsg || '';
    },
    INITALLDATA(state) {
      state.initializedFlag = false;
      state.showFlag = false;
      state.mqResourceList = [];
      state.esResourceList = [];
      state.notInitializedMsg = '';
    },
  },
  actions: {
    SETRESOURCEDATA(context, data) {
      context.commit('SETAllDATA', data);
    },
    INITRESOURCEDATA(context, data) {
      context.commit('INITALLDATA', data);
    },
  },
};
