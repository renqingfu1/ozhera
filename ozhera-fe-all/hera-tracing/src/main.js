import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import "./style/reset.scss";
import "./style/common.scss";
import mitt from "mitt";
import "./public-path";
import { languageI18n } from "@/language/index";

const createMyApp = () => createApp(App);

let app = createMyApp();

function render(props) {
  app = createMyApp();
  const i18n = languageI18n();
  app.config.globalProperties.i18n = i18n;
  app.config.globalProperties.$t = i18n.$t;
  const { container } = props;
  if (props?.onGlobalStateChange) {
    props?.onGlobalStateChange((val) => {
      if (val.type === "lang") {
        i18n.locale.value = val.value;
      }
    }, true);
  }
  // i18n.locale.value = "zh-CN";
  app.config.globalProperties.$emitter = new mitt();
  app
    .use(store)
    .use(router)
    .use(ElementPlus, { size: "small", locale: zhCn })
    .mount(container ? container.querySelector("#app") : "#app");
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

/**
 * bootstrap ： 在微应用初始化的时候调用一次，之后的生命周期里不再调用
 */
export async function bootstrap() {
  console.log("bootstrap");
}

/**
 * mount ： 在应用每次进入时调用
 */
export async function mount(props) {
  render(props);
}

/**
 * unmount ：应用每次 切出/卸载 均会调用
 */
export async function unmount() {
  app.unmount();
}
