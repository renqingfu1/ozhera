import Vue from 'vue';
import Vuex from 'vuex';
import moduleUserInfo from '@/store/moduels/user';
import moduleMenu from '@/store/moduels/menu';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    moduleUserInfo, moduleMenu,
  },
});
