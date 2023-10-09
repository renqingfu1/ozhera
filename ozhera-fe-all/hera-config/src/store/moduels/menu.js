import { filterMenuByMode, isAllMenuMode } from '../../utils/MenuManager';

const rawList = [
  {
    id: '/trace-config',
    label: '过滤配置',
    icon: 'icon-qiankun-config-xinxiguolv',
    path: '/trace-config',
  },
];

export default {
  namespaced: true,
  state: {
    activeIndex: '',
    menuList: rawList,
    mode: 'all', // 菜单模式：区分(all)及一般精简模式(general)
    isAllMenuMode: true,
  },
  mutations: {
    setActive(state, data) {
      state.activeIndex = data;
    },
    setMenu(state, mode) {
      state.mode = mode;
      state.isAllMenuMode = isAllMenuMode(mode);
      state.menuList = filterMenuByMode(rawList, mode);
    },
  },
  actions: {
  },
  modules: {
  },
};
