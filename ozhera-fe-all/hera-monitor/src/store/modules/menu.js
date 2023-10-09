import { filterMenuByMode, isAllMenuMode } from "../../utils/MenuManager"
export default {
  namespaced: true,
  state: {
    mode: 'all',//菜单模式：区分中国区(all)及一般精简模式(general)
    isAllMenuMode: true,
    menuList: [],
    expandAside: true,
    defaultActive: '1',
  },
  getters: {},
  mutations: {
    // 设置菜单列表
    setMenu(state, {menu, mode}) {
      state.mode = mode || 'all'
      state.isAllMenuMode = isAllMenuMode(state.mode)
      state.menuList = filterMenuByMode(menu, state.mode)
    },
    // 切换侧边栏
    toggleAside(state) {
      state.expandAside = !state.expandAside
    }
  },
  actions: {}
}
