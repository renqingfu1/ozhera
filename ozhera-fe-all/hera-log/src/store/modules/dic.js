import { getMQConfigOptionsApi } from '@/common/req/list/logConfig';

const filterFn = (arr, key) => (arr.filter(
  (item) => item[key],
)
).map((mapI) => mapI.value);
// eslint-disable-next-line import/prefer-default-export
export default {
  namespaced: true, // 使用命名空间，这样只在局部使用
  state: {
    dicObj: {
      1001: 'mqconfig_options', // 创建tail的时候选择采集的mq配置
      1002: 'mq_options', // mq类型
      1003: 'topic_options', // 存在的topic列表
      1004: 'apptype_options', // 应用类型
    },
    mqconfig_options: [],
    mq_options: [],
    topic_options: [],
    apptype_options: [],
    switchShowArr: {
      showDeployTypes: [], // 创建tail时展示部署方式的类型
      showEnvTypes: [], // 创建tail时展示环境分组的类型
      showMachineTypeTypes: [], // 创建tail时展示机器类型的类型
      showMachineRegionTypes: [], // 创建tail时展示机房的类型
      showServiceIpTypes: [], // 创建tail时展示IP的类型
      showMqconfigTypes: [], // 创建tail时展示MQ配置的类型
    },
  },
  mutations: {
    SETAllOPTIONS(state, obj) {
      state[state.dicObj[obj.name]] = obj.data;
    },
    setShowTypeArr(state, val) {
      state.switchShowArr.showDeployTypes = filterFn(val, 'showDeploymentType');
      state.switchShowArr.showEnvTypes = filterFn(val, 'showEnvGroup');
      state.switchShowArr.showMachineTypeTypes = filterFn(val, 'showMachineType');
      state.switchShowArr.showMachineRegionTypes = filterFn(val, 'showMachineRegion');
      state.switchShowArr.showServiceIpTypes = filterFn(val, 'showServiceIp');
      state.switchShowArr.showMqconfigTypes = filterFn(val, 'showMqConfig');
    },
  },
  actions: {
    GETALLOPTIONSAPI({ commit }, codeArr) {
      getMQConfigOptionsApi({ codes: codeArr }).then((res) => {
        codeArr.forEach((item) => {
          commit('SETAllOPTIONS', {
            name: item,
            data: res.data[item],
          });
          console.log('item', item);
          if (item === '1004') {
            console.log('res.data', res.data['1004']);
            commit('setShowTypeArr', res.data['1004']);
          }
        });
      });
    },
  },
};
