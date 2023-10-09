export default {
  namespaced: true,
  state: {
    langMode: 'en-US',
  },
  getters: {},
  mutations: {
    // 设置语言
    setLang(state, lang) {
      state.langMode =lang||'en-US'
    },
  },
  actions: {}
}
