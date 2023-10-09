import Vue from 'vue';
import Vuex from 'vuex';
import moduleMenu from './modules/menu';
import moduleUserMenu from './modules/menu-user';
import moduleSpaceTree from './modules/spaceTree';
import moduleLogconfig from './logConfig';
import moduleUserInfo from './modules/user-info';
import moduleMQConfig from './modules/mq-config';
import moduleDic from './modules/dic';
import moduleCreateStoreResource from './modules/create-store-resource';
import moduleChart from './modules/charts';
import moduleSaved from './modules/saved';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {
  },
  actions: {
  },
  modules: {
    moduleMenu,
    moduleUserMenu,
    moduleSpaceTree,
    moduleLogconfig,
    moduleUserInfo,
    moduleMQConfig,
    moduleDic,
    moduleCreateStoreResource,
    moduleChart,
    moduleSaved,
  },
  getters: {},
});
