/* eslint-disable no-underscore-dangle */
import Vue from 'vue';
import VueRouter from 'vue-router';
import { Message } from 'element-ui';
import VueI18n from 'vue-i18n';
import enLocale from 'element-ui/lib/locale/lang/en';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
import ElementLocale from 'element-ui/lib/locale';
import App from './App.vue';
import routes from './router';
import enUS from './locales/en-US';
import zhCN from './locales/zh-CN';
import store from './store';
import './plugins/element';
import '@/common/css/main.scss'; // 全局样式
import './plugins/mione-product';

Vue.use(VueI18n);
const dateFormat = require('dateformat');

Vue.config.productionTip = false;
Vue.prototype.$dateFormat = dateFormat;

// 声明变量管理vue及路由实例
let router = null;
let instance = null;

const defaultLocale = 'en-US';
const i18n = new VueI18n({
  locale: defaultLocale,
  fallbackLocale: 'en-US',
  allowComposition: true,
  messages: {
    'en-US': {
      ...enUS,
      ...enLocale,
    },
    'zh-CN': {
      ...zhCN,
      ...zhLocale,
    },
  },
});

ElementLocale.i18n((key, value) => i18n.t(key, value));

export async function bootstrap(props = {}) {
  // eslint-disable-next-line no-unused-expressions
  Array.isArray(props.fns) && props.fns.map(
    // eslint-disable-next-line array-callback-return
    (i) => {
      Vue.prototype[i.name] = i[i.name];
    },
  );
}
export function getUserCb(to, userInfo) {
  const reg = /^\/admin\//;
  if (reg.test(to.fullPath) && !userInfo.isAdmin) { // 以/admin/开头的
    Message({
      message: '您不是管理员!',
      type: 'error',
      duration: 1 * 1000,
      onClose: () => {
        router.push('/');
      },
    });
  }
}

export async function redirect() {
  const userModule = store.state.moduleUserInfo;
  if (!userModule.userInfo.user) { // 刷新页面
    store.dispatch('moduleUserInfo/FRESHPAGE').then(() => {
      getUserCb(userModule.userInfo);
    });
    return;
  }
  getUserCb(userModule.userInfo);
}
export function userMenu(from, to, menu, myStore) {
  const toPath = to.path;
  const filterData = menu.filter((item) => item.path === toPath);
  if (filterData.length > 0) {
    const defaultActive = filterData[0].path;
    myStore.dispatch('moduleUserMenu/updateActive', defaultActive);
    redirect(to);
  }
}

export function routerActive() {
  router.beforeEach((to, from, next) => { // beforeEach是router的钩子函数，在进入路由前执行
    if (to.meta.title) { // 判断是否有标题
      document.title = to.meta.title;
    }
    next();// 执行进入路由，如果不写就不会进入目标页
  });
  router.afterEach((to, from) => {
    const myStore = router.app.$options.store;
    const menu = myStore.state.moduleUserMenu.list;
    userMenu(from, to, menu, myStore);
  });
}

// 导出子应用生命周期 挂载前 挂载后
export async function mount(props) {
  Vue.use(VueRouter);
  const orginalPush = VueRouter.prototype.push;
  VueRouter.prototype.push = function push(location) {
    return orginalPush.call(this, location).catch((err) => err);
  };

  router = new VueRouter({
    // eslint-disable-next-line no-underscore-dangle
    base: window.__POWERED_BY_QIANKUN__ ? '/project-milog' : '/',
    mode: 'history',
    routes,
  });
  routerActive();
  instance = new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App),
    created() {
      // eslint-disable-next-line no-unused-expressions
      props?.onGlobalStateChange((state) => {
        this.$store.commit('moduleUserMenu/setMenu', state.menuMode);
        this.$i18n.locale = state.value;
      }, true);
      this.$store.commit('moduleUserMenu/setMenu', props?.getMenuMode());
    },
  }).$mount('#app');
}

// 导出子应用生命周期 挂载前 卸载后
export async function unmount() {
  instance.$destroy();
  // eslint-disable-next-line no-unused-expressions
  window._Sentry?.close();
  window._Sentry = undefined;
  instance = null;
  router = null;
}

// 单独开发环境
// eslint-disable-next-line no-unused-expressions
window.__POWERED_BY_QIANKUN__ || mount();
