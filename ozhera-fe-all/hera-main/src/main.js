import Vue from 'vue';
import VueI18n from 'vue-i18n';
import {
  registerMicroApps, setDefaultMountApp, start, initGlobalState,
} from 'qiankun';
import ViewUI from 'view-design';
import VueCompositionAPI from '@vue/composition-api';
// eslint-disable-next-line import/no-unresolved
import App from './App.vue';
import router from './router';
import '@/assets/reset.css';
import store from './store';
import enUS from './locales/en-US';
import zhCN from './locales/zh-CN';
import 'view-design/dist/styles/iview.css';

Vue.use(ViewUI);
Vue.use(VueCompositionAPI);
Vue.use(VueI18n);
Vue.config.productionTip = false;
let app = null;

const { setGlobalState } = initGlobalState({});
const defaultLocale = store.state.appModule.language || 'en-US';
const i18n = new VueI18n({
  locale: defaultLocale,
  fallbackLocale: 'en-US',
  allowComposition: true,
  messages: {
    'en-US': enUS,
    'zh-CN': zhCN,
  },
});
setGlobalState({
  type: 'lang',
  value: defaultLocale,
});

/**
 * 渲染函数
 * appContent 子应用html内容
 * loading 子应用加载效果，可选
 */
function render({ appContent, loading } = {}) {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      i18n,
      data() {
        return {
          content: appContent,
          loading,
        };
      },
      render(h) {
        return h(App, {
          props: {
            content: this.content,
            loading: this.loading,
          },
        });
      },
    });
  } else {
    app.content = appContent;
    app.loading = loading;
  }
}

/**
 * 路由监听
 * @param {*} routerPrefix 前缀
 */
function genActiveRule(routerPrefix) {
  return (location) => location.pathname.startsWith(routerPrefix);
}

function initApp() {
  render({ appContent: '', loading: true });
}

initApp();

// 传入子应用的数据
const msg = {
  data: {
    auth: false,
  },
  fns: [
    {
      name: '_LOGIN',
      // eslint-disable-next-line no-underscore-dangle
      _LOGIN(data) {
        console.log(`父应用返回信息${data}`);
      },
    },
  ],
  menuMode: localStorage.getItem('hera-menu-mode') || 'all', // DEPRECATED
  getMenuMode: () => localStorage.getItem('hera-menu-mode') || 'all',
};
// 注册子应用
registerMicroApps(
  [
    {
      name: 'project-milog', // 日志系统
      entry: process.env.VUE_APP_MILOGENTRY,
      render,
      activeRule: genActiveRule('/project-milog'), // /qiankun-milog/
      props: msg,
    },
    {
      name: 'project-target-monitor', // 指标监控
      entry: process.env.VUE_APP_TARGETMONITORENTRY, // /qiankun-target-monitor/
      render,
      activeRule: genActiveRule('/project-target-monitor'),
      props: msg,
    },
    {
      name: 'project-hera-tracing', // 指标监控
      entry: process.env.VUE_APP_TRACING, // /qiankun-tracing/
      render,
      activeRule: genActiveRule('/project-hera-tracing'),
      props: msg,
    },
    {
      name: 'project-config', // 设置
      entry: process.env.VUE_APP_CONFIGRENTRY,
      render,
      activeRule: genActiveRule('/project-config'),
      props: msg,
    },
  ],
  {
    beforeLoad: [
      // eslint-disable-next-line no-shadow
      (app) => {
        console.log('before load', app);
      },
    ], // 挂载后回调
    afterMount: [
      // eslint-disable-next-line no-shadow
      (app) => {
        console.log('afterMount》》》》》》》》 moun》', app);
      },
    ],
    afterUnmount: [
      // eslint-disable-next-line no-shadow
      (app) => {
        console.log('after unload', app);
      },
    ], // 卸载后回调
  },
);

// 设置默认子应用,与 genActiveRule中的参数保持一致
setDefaultMountApp('/project-target-monitor');

// 启动
start();
