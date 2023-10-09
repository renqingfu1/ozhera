/* eslint-disable no-underscore-dangle */
import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import enLocale from 'element-ui/lib/locale/lang/en';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
import ElementLocale from 'element-ui/lib/locale';
import store from '@/store/index';
import App from './App.vue';
import routes from './router';
import enUS from './locales/en-US';
import zhCN from './locales/zh-CN';
import 'element-ui/lib/theme-chalk/index.css';
import '@/common/css/main.less';

Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.directive('defaultSelect', {
  componentUpdated(el, bindings) {
    const [defaultValues] = bindings.value;
    const dealStyle = (tags) => {
      tags.forEach((elInner) => {
        if (elInner.previousSibling.innerText === defaultValues[0].name && ![...elInner.classList].includes('select-tag-close-none')) {
          elInner.classList.add('none');
        }
      });
    };
    // 设置样式 隐藏close icon
    const tags = el.querySelectorAll('.el-tag__close');
    if (tags.length === 0) {
      // 初始化tags为空处理
      setTimeout(() => {
        const tagTemp = el.querySelectorAll('.el-tag__close');
        dealStyle(tagTemp);
      });
    } else {
      dealStyle(tags);
    }
  },
});

// 全局样式
Vue.use(ElementUI);
Vue.config.productionTip = false;

const dateFormat = require('dateformat');
// 引入dateFormat
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

// 导出子应用生命周期 挂载前
export async function bootstrap(props = {}) {
  console.log('从父应用继承的数据', props);
  // eslint-disable-next-line no-unused-expressions
  Array.isArray(props.fns) && props.fns.map(
    // eslint-disable-next-line array-callback-return
    (i) => {
      Vue.prototype[i.name] = i[i.name];
    },
  );
}

// 导出子应用生命周期 挂载前 挂载后
export async function mount(props) {
  router = new VueRouter({
    // eslint-disable-next-line no-underscore-dangle
    base: window.__POWERED_BY_QIANKUN__ ? `/${process.env.VUE_APP_PROJECT_NAME}` : '/',
    mode: 'history',
    routes,
  });
  router.afterEach(() => {
    const userModule = store.state.moduleUserInfo;
    if (!userModule.userInfo.user) { // 刷新页面
      store.dispatch('moduleUserInfo/GETUSERINFO');
    }
  });
  instance = new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App),
    created() {
      // eslint-disable-next-line no-unused-expressions
      props?.onGlobalStateChange((state) => {
        if (state.type === 'lang') {
          this.$store.commit('moduleLang/setLang', state.value);
          this.$i18n.locale = state.value;
        }
        this.$store.commit('moduleMenu/setMenu', state.menuMode);
      }, true);
      this.$store.commit('moduleMenu/setMenu', props?.getMenuMode());
    },
  }).$mount('#app');
}

// 导出子应用生命周期 挂载前 卸载后
export async function unmount() {
  instance.$destroy();
  instance = null;
  router = null;
}

// 单独开发环境
// eslint-disable-next-line no-unused-expressions
window.__POWERED_BY_QIANKUN__ || mount();
