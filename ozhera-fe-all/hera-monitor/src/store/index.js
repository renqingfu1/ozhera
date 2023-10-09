import Vue from "vue"
import Vuex from "vuex"
import menu from './modules/menu'
import project from './modules/project'
import slowquery from './modules/slowquery'
import moduleUserInfo from './modules/user'
import moduleStrategyList from './modules/strategy-list'
import moduleStrategyGateway from './modules/strategy-gateway'
import modulePlatForm from './modules/paltform.js';
import moduleIndexPage from './modules/index-page.js';
import moduleLang from './modules/lang.js';
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    menu,
    project,
    slowquery,
    moduleUserInfo,
    moduleStrategyList,
    moduleStrategyGateway,
    modulePlatForm,
    moduleIndexPage,
    moduleLang
  }
})
