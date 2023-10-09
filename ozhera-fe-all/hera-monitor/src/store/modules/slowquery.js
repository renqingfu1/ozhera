import server from "@/api/service/slowQueryException";
import tabsContainer from '@/pages/slowquery-exception/second-tabs.js';
const {exception, slowQuery} = tabsContainer;
const innerArr = [...exception, ...slowQuery];
let innerTabsArr = []
innerArr.forEach((item)=>{
  innerTabsArr = innerTabsArr.concat(...item.innerTabs)
});
const numObj = {};
innerTabsArr.forEach((item)=>{
  numObj[item.statistics] = 0;
})
export default {
  namespaced: true,
  state: {
    timer:[
      new Date().getTime() - 60 * 60 * 1000,
      new Date().getTime(),
    ],
    labels:{
      serverIp:'',
      methodName:'',
    },
    getStatistic : false,
    redisSlowNum:0,
    nums:numObj,
  },
  mutations: {
    // 设置时间
    setTimer(state,param) {
      state.timer = param;
    },
    setLabelsData(state,params){
      state.labels = {...state.labels,...params}
    },
    setStatistics(state,params){
      state.nums = {...state.nums,...params};
      state.getStatistic = true;
    },
    updateGetStatistic(state,param){
      state.getStatistic = param;
    },
    updateNums(state,{type, value}){
      state.nums[type] = value;
    }
  },
  actions: {
    GETNUMSTATISTICS(context,params) {
      server.getStatisticsNum(params).then(res => {
        context.commit('setStatistics', res||{}); 
      });
    },
  }
}