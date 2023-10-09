import {
  delSaveItemApi, removeStoreTailApi,
  spaceTreeApi, swapPositionApi,
} from '@/common/req/list/user/saved-api';
import {
  searchRecordList, saveRecord,
} from '@/common/req/list/logConfig';

function forFun(arr) {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    item.level = 'space';
    item.key = `${item.value}_${item.label}`;
    const stores = (item.children || []);
    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < stores.length; j++) {
      const storeI = stores[j];
      storeI.key = `${storeI.value}_${storeI.label}`;
      storeI.level = 'store';
      storeI.spaceId = item.value;
      storeI.spaceName = item.label;
    }
  }
  return arr;
}

function retStore(spaceStore) {
  let stores = [];
  spaceStore.forEach((item) => {
    const storeArr = item.children.map((store) => ({
      ...store,
      spaceId: item.value,
      spaceName: item.label,
    }));
    stores = stores.concat(storeArr);
  });
  return stores;
}

export default {
  namespaced: true,
  state: {
    keyList: [], // 查询条件
    tailList: [],
    storeList: [],
    spaceStore: [],
  },
  mutations: {
    UpdateKeyList(state, data) {
      state.keyList = data;
    },
    UpdateTailList(state, data) {
      state.tailList = data;
    },
    UpdateStoreList(state, data) {
      state.storeList = data;
    },
    UpdateTree(state, data) {
      const resD = forFun(JSON.parse(JSON.stringify(data)));
      state.spaceStore = resD;
      state.allStore = retStore(JSON.parse(JSON.stringify(resD)));
    },
  },
  actions: {
    GetSaveKeyList({ commit }) {
      searchRecordList({ sort: 1 }).then(({ data }) => {
        commit('UpdateKeyList', data);
      });
    },
    GetSaveStoreList({ commit }) {
      searchRecordList({ sort: 3 }).then(({ data }) => {
        commit('UpdateStoreList', data);
      });
    },
    GetSaveTailList({ commit }) {
      searchRecordList({ sort: 2 }).then(({ data }) => {
        commit('UpdateTailList', data);
      });
    },
    RemoveStoreTailAction({ commit }, { params, callback }) {
      console.log('commit', commit);
      removeStoreTailApi(params).then(() => {
        if (callback) callback();
      });
    },
    GetTreeAction({ commit }) {
      spaceTreeApi().then(({ data }) => {
        commit('UpdateTree', data);
      });
    },
    AddSaveItem({ dispatch }, { params, type, callback }) { // 收藏store / tail
      saveRecord(params).then(() => {
        if (type === 'store') {
          dispatch('GetSaveStoreList');
        } else if (type === 'app') {
          dispatch('GetSaveTailList');
        }
        if (callback) callback();
      });
    },
    DelSaveItem({ dispatch }, { params, type, callback }) {
      delSaveItemApi(params).then(() => {
        if (type === 'query') { // 查询条件
          dispatch('GetSaveKeyList');
        } else if (type === 'store') {
          dispatch('GetSaveStoreList');
          dispatch('GetTreeAction');
        } else if (type === 'app') {
          dispatch('GetSaveTailList');
        }
        if (callback) callback();
      });
    },
    GetMySaved({ dispatch }) {
      dispatch('GetSaveKeyList');
      dispatch('GetSaveStoreList');
      dispatch('GetSaveTailList');
    },
    SwapSavedPosition({ dispatch }, { params, type }) {
      swapPositionApi(params).then(() => {
        if (type === 'query') { // 查询条件
          dispatch('GetSaveKeyList');
        } else if (type === 'store') {
          dispatch('GetSaveStoreList');
        } else if (type === 'app') {
          dispatch('GetSaveTailList');
        }
      });
    },
  },
};
