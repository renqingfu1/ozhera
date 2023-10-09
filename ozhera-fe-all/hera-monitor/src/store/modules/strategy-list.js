import server from "@/api/service/alarm-template";
import serverStrategy from "@/api/service/alarm-srategy";
export default {
  namespaced: true,
  state: {
    presetMetrics:[],
    checkDataCount:[],
    alarmLevels:[],
    sendInterval:[],
    strategyOptions:[], // 策略所有类型
    strategyOptionsTem:[], // 模板也所有策略类型
    httpArr:[],
    dobboArr:[],
    httpHasErrorCodeArr:[],
    httpClientArr:['http_client_error_times','http_client_availability','http_client_qps','http_client_cost']
  },
  getters: {},
  mutations: {
    initOptions(state,param) {
      state.presetMetrics = param.presetMetrics;
      state.checkDataCount = param.checkDataCount;
      state.alarmLevels = param.alarmLevels;
      state.sendInterval = param.sendInterval;
      state.httpArr = param.presetMetrics.filter(filteI=>(filteI.kind ===2 ||filteI.kind ===1)).map(item=>item.value)
      state.dobboArr= param.presetMetrics.filter(filteI=>filteI.kind ===3).map(item=>item.value)
      state.httpHasErrorCodeArr=param.presetMetrics.filter(filteI=>filteI.kind ===1).map(item=>item.value) 
    },
    initStrateGyOptions(state,param) {
      state.strategyOptions = param;
    },
    initStrategyOptionsTemp(state,param) {
      state.strategyOptionsTem = param;
    },
  },
  actions: {
    // 获取报警规则下拉列表数据
    GETRUlESOPTION(context) {
      return server.getRulesOption().then(res => {
        if (res) {
          context.commit('initOptions', res||{}); 
        }
      });
    },
    // 获取策略类型
    GETSTRATEGYOPTION(context) {
      return serverStrategy.strategyTypesApi({
        ruleNeed:true // 策略
      }).then(res => {
        if (res) {
          context.commit('initStrateGyOptions', res||[]); 
        }
      });
    },
    // 模板策略类型
    GETSTRATEGYOPTIONTEM(context) {
      serverStrategy.strategyTypesApi({
        templateNeed:true  // 策略
      }).then(res => {
        if (res) {
          context.commit('initStrategyOptionsTemp', res||[]); 
        }
      });
    },
  }
}