import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './router/routes.js'
import store from './store'

// element-ui库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ElEnlang from 'element-ui/lib/locale/lang/en'
import ElZhlang from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale';
// import ExtraUI from '@mi/extra-ui'
// import '@mi/extra-ui/dist/style.css'

// 注入全局组件
import '@/components'

// 初始化menu
import menu from '@/menu'

// 徽章
import { badge } from '@/utils'
import i18n from './lang'

Vue.use(ElementUI, {
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
})
// Vue.use(ExtraUI)
Vue.config.productionTip = false

Vue.directive('defaultSelect', {
  componentUpdated(el, bindings) {
    const [defaultValues] = bindings.value
    const dealStyle = tags => {
      tags.forEach(elInner => {
        if (
          elInner.previousSibling.innerText === defaultValues[0].name &&
          ![...elInner.classList].includes('select-tag-close-none')
        ) {
          elInner.classList.add('none')
        }
      })
    }
    // 设置样式 隐藏close icon
    const tags = el.querySelectorAll('.el-tag__close')
    if (tags.length === 0) {
      // 初始化tags为空处理
      setTimeout(() => {
        const tagTemp = el.querySelectorAll('.el-tag__close')
        dealStyle(tagTemp)
      })
    } else {
      dealStyle(tags)
    }
  },
})

const dateFormat = require('dateformat') // 引入dateFormat
Vue.prototype.$dateFormat = dateFormat

import '@/assets/style/rewrite.less' // 重写组件样式
import '@/assets/style/iconfont.less' // 字体图表

// 声明变量管理vue及路由实例
let router = null
let instance = null

// 导出子应用生命周期 挂载前
export async function bootstrap(props = {}) {
  console.log('从父应用继承的数据', props)
  // eslint-disable-next-line no-unused-expressions
  Array.isArray(props.fns) &&
    props.fns.map(
      // eslint-disable-next-line array-callback-return
      i => {
        Vue.prototype[i.name] = i[i.name]
      }
    )
}

// 导出子应用生命周期 挂载前 挂载后
export async function mount(props) {
  if(props?.initLocale){
    store.commit('moduleLang/setLaAng', props.initLocale );
  }
  const original = VueRouter.prototype.push
  VueRouter.prototype.push = function push(location) {
    return original.call(this, location).catch(err => err)
  }
  Vue.use(VueRouter)
  router = new VueRouter({
    // eslint-disable-next-line no-underscore-dangle
    base: window.__POWERED_BY_QIANKUN__ ? '/project-target-monitor' : '/',
    mode: 'history',
    routes,
  })
  router.afterEach(() => {
    const userModule = store.state.moduleUserInfo
    if (window.location.pathname === '/authority') {
      return
    }
    if (!userModule.userInfo.user) {
      // 刷新页面
      store.dispatch('moduleUserInfo/GETUSERINFO')
      return
    }
  })
  // ExtraUI.initSentry({
  //   Vue,
  //   router,
  //   appName: 'stasi',
  // });
  instance = new Vue({
    router,
    store,
    render: h => h(App),
    created() {
      props?.onGlobalStateChange((val) => {
        if(val.type==='lang'){
          this.$store.commit('moduleLang/setLang', val.value );
          this.$i18n.locale= val.value;
          if(val.value=='zh-CN'){
            locale.use(ElZhlang);
          }else{
            locale.use(ElEnlang);
          }
        }
        this.$store.commit('menu/setMenu', { menu, mode: 'all' })
      },true)
      this.$store.commit('menu/setMenu', { menu, mode: 'all' })
      badge(process.env.VUE_APP_TITLE)
    },
    beforeDestory() {},
    i18n,
  }).$mount('#app')
}

// 导出子应用生命周期 挂载前 卸载后
export async function unmount() {
  instance.$destroy()
  // eslint-disable-next-line no-unused-expressions
  window._Sentry?.close()
  window._Sentry = undefined
  instance = null
  router = null
}

// 单独开发环境
// eslint-disable-next-line no-unused-expressions
window.__POWERED_BY_QIANKUN__ || mount()
