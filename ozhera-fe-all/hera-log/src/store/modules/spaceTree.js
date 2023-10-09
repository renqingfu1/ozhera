// import { Message } from 'element-ui';
import { getTreeBySpace } from '@/common/req/list/user/tree';

// eslint-disable-next-line import/prefer-default-export
export default {
  namespaced: true, // 使用命名空间，这样只在局部使用
  state: {
    spaceTree: [],
    editableTabs: [],
    activeTabValue: '', // 当前激活的tab
    defaultExpandedKeys: [], // 默认展开的节点
  },
  mutations: {
    emptyTabs(state) {
      state.editableTabs = [];
    },
    deleteTabMutaion(state, tabName) { // 删除tab
      // 删除这个tab
      const filterData = state.editableTabs.filter((item) => item.name !== tabName);
      state.editableTabs = filterData;
      // 修改active
      if (state.activeTabValue === tabName) {
        state.activeTabValue = state.editableTabs[state.editableTabs.length - 1].name;
      }
    },
    addExpanedKey(state, data) {
      state.defaultExpandedKeys.push(data);
    },
    removeExpandKey(state, data) {
      const i = state.defaultExpandedKeys.indexOf(data);
      state.defaultExpandedKeys.splice(i, 1);
    },
    setSpaceTree(state, data) {
      state.spaceTree = data;
    },
    setActvieTab(state, data) {
      state.activeTabValue = data;
    },
    addTabMutation(state, data) { // 日志查询时候content中只需要storeId
      state.editableTabs.push(data);
    },
    removeTab(state, tabName) {
      // if (state.editableTabs.length === 1) {
      //   Message({
      //     message: '禁止删除',
      //     type: 'warn',
      //     duration: 3 * 1000,
      //   });
      //   return;
      // }
      let index = 0;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < state.editableTabs.length; i++) {
        if (state.editableTabs[i].name === tabName) { // tabs以name作为标志
          index = i;
          break;
        }
      }
      state.editableTabs.splice(index, 1);
      // 如果删除的是当前active的则把最后一个设置为active
      const { activeTabValue, editableTabs } = state;
      if (activeTabValue === tabName && editableTabs.length > 0) {
        this.commit('moduleSpaceTree/setActvieTab', state.editableTabs[state.editableTabs.length - 1].name);
      }
    },
  },
  actions: {
    setSpaceTreeAction({ commit }, { data }) {
      commit('setSpaceTree', data);
    },
    getSpaceTreeAction(context, spaceId) {
      if (!spaceId) return null;
      return getTreeBySpace({ spaceId }).then((res) => {
        context.commit('setSpaceTree', res.data || []);
      });
    },
  },
};
