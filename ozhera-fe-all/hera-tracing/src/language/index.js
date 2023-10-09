/*
 * @Description:
 * @Date: 2021-11-01 19:13:51
 * @LastEditTime: 2023-09-13 15:33:11
 */
import { ref, provide, inject } from "vue";
import en from "./en";
import zh from "./zh";

const createI18n = (config) => ({
  locale: ref(config.locale),
  messages: config.messages,
  $t(key, paramsObj) {
    let str = this.i18n.messages[this.i18n.locale.value][key];
    if (paramsObj) {
      Object.keys(paramsObj).forEach((item) => {
        console.log("item", str, item, paramsObj[item]);
        str = str.replace("{" + item + "}", paramsObj[item]);
      });
    }
    return str;
  },
});

const i18nSymbol = Symbol();

export function provideI18n(i18nConfig) {
  const i18n = createI18n(i18nConfig);
  provide(i18nSymbol, i18n);
  return i18n;
}

//语言配置
//app里的语言初始化
export function languageI18n() {
  return provideI18n({
    locale: "en-US", // 默认的语言或者自己切换存储在本地
    messages: {
      "en-US": {
        ...en,
      },
      "zh-CN": {
        ...zh,
      },
    },
  });
}
//组件内的应用
export function useI18n() {
  const i18n = inject(i18nSymbol);
  if (!i18n) throw new Error("No i18n provided!!!");

  return i18n;
}
