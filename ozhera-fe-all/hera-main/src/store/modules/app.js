export default {
  namespaced: true,
  state: {
    theme: '',
    language: 'en-US',
  },
  mutations: {
    setTheme(state, theme) {
      state.theme = theme;
    },
    setLanguage(state, lang) {
      state.language = lang;
    },
  },
  actions: {
    setLanguage({ commit }, lang) {
      commit('setLanguage', lang);
    },
  },
};
