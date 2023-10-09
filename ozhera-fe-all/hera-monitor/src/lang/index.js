/*
 * @Description:
 * @Date: 2023-09-06 10:27:20
 * @LastEditTime: 2023-09-06 10:27:22
 */
// 语言切换
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from './en'
import zhLocale from './zh'
import store from '../store'
import ElEnlang from 'element-ui/lib/locale/lang/en'
import ElZhlang from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale';
Vue.use(VueI18n)

const messages = {
  'en-US': {
    ...enLocale,
    ...ElEnlang
  },
  'zh-CN': {
    ...zhLocale,
    ...ElZhlang
  },
}

let lang = store.state.moduleLang.langMode;
let selectedLang = window.localStorage.getItem('selectedLang')
if(lang=='zh-CN'){
  locale.use(ElZhlang);
}else{
  locale.use(ElEnlang);
}
export default new VueI18n({
  locale: lang === null ? 'en-US' : lang,
  selectedLang: selectedLang === null ? '简体中文' : selectedLang,
  messages,
})
