import server from '@/api/service/application.js'
import Vue from 'vue'
import store from '../index'

function returnHealth(item) {
  const healthTxt = this.$t('health');
  const unhealthy = this.$t('unhealthy');
  // 默认绿色：报警数=0，异常数=0，慢查询数=0；黄色（warning）报警数=0，异常数=0，慢查询数>0显示黄色；红色（danger）报警数、异常数任意一个大于0，则显示红色
  const health = {
    type: 'success',
    title: healthTxt,
  }
  if (item.alertTotal > 0 || item.exceptionTotal > 0) {
    health.type = 'danger'
    health.title = unhealthy
  } else if (
    item.alertTotal == 0 &&
    item.exceptionTotal == 0 &&
    item.slowTotal > 0
  ) {
    health.type = 'warning'
    health.title = unhealthy
  }
  return health
}
function transListRes(list) {
  const lang = store.state.moduleLang.langMode
  // 初始化最近半小时的时间段
  let now = new Date().getTime()
  const sTime = now - 1000 * 60 * 30
  const eTime = now
  return list.map(item => {
    // 将返回值的统计数置空
    return {
      ...item,
      alertTotal: 0, // 告警总数
      exceptionTotal: 0, // 异常总数
      slowTotal: 0, // 慢查询总数
      logExceptionNum: 0, // 日志异常总数
      health: {
        type: 'success',
        title: lang === 'zh' ? '健康' : 'Health',
      },
      loadingNum: false,
      sTime,
      eTime,
    }
  })
}

export default {
  namespaced: true,
  state: {
    loadingAppList: false,
    noMoreApp: false,
    form: {
      page: 1,
      pageSize: 20,
      appName: '',
      viewType: '', //
    },
    indexAppList: [],
  },
  mutations: {
    initAppList(state, data) {
      console.log('data', data)
      state.indexAppList = data
    },
    updateIndexLoading(state, data) {
      state.loadingAppList = data
    },
    changeAppName(state, appName) {
      state.form.appName = appName
    },
    changeSearchType(state, type) {
      state.form.viewType = type
    },
    setNewStat(state, { i, newV }) {
      // 根据数据统计接口获取统计数据
      Vue.set(state.indexAppList[i], 'health', returnHealth(newV))
      Vue.set(state.indexAppList[i], 'alertTotal', newV.alertTotal)
      Vue.set(state.indexAppList[i], 'exceptionTotal', newV.exceptionTotal)
      Vue.set(state.indexAppList[i], 'slowTotal', newV.slowTotal)
      Vue.set(state.indexAppList[i], 'logExceptionNum', newV.logExceptionNum)
      Vue.set(state.indexAppList[i], 'sTime', newV.startTime * 1000)
      Vue.set(state.indexAppList[i], 'eTime', newV.endTime * 1000)
    },
    changePageM(state, page) {
      state.form.page = page
    },
    changeNoMore(state, noMoreApp) {
      state.noMoreApp = noMoreApp
    },
    addPage(state) {
      state.form.page = state.form.page + 1
    },
    addApp(state, data) {
      state.indexAppList = state.indexAppList.concat(data)
    },
    updateItemLoading(state, { item, loadingNum }) {
      let i = state.indexAppList.findIndex(
        app => app.projectId == item.projectId
      )
      Vue.set(state.indexAppList[i], 'loadingNum', loadingNum)
    },
  },
  actions: {
    GETAPPREQ({ state, commit, dispatch }, type) {
      // 请求app list
      if (state.noMoreApp || state.loadingAppList) return
      commit('updateIndexLoading', true)
      server
        .getAppList(state.form)
        .then(({ list }) => {
          let resList = list || []
          commit('updateIndexLoading', false)
          commit(
            'changeNoMore',
            resList.length < state.form.pageSize ? true : false
          )
          let res = []
          if (type == 'init' || type == 'addMore') {
            res = transListRes(resList)
            commit(type == 'init' ? 'initAppList' : 'addApp', res)
          } else if (type === 'addOne') {
            // 获取当前页的最后一个填充
            if (list.length > 0) {
              const newItem = list[list.length - 1]
              res = transListRes([newItem])
              commit('addApp', res)
            }
          }
          dispatch('GETSTANUM', res) // 获取统计数据
        })
        .catch(() => {
          commit('updateIndexLoading', false)
        })
    },
    GETINITAPPLIST: ({ commit, dispatch }) => {
      // 获取应用列表
      commit('changePageM', 1)
      commit('changeNoMore', false)
      dispatch('GETAPPREQ', 'init')
    },
    ADDONEAPP({ state, dispatch }, index) {
      // 获取当前页面的最后一个补充上
      state.indexAppList.splice(index, 1)
      if (state.noMoreApp) return
      dispatch('GETAPPREQ', 'addOne')
    },
    LOADMOREAPP({ dispatch, state, commit }) {
      if (state.loadingAppList || state.noMoreApp) return
      commit('addPage')
      dispatch('GETAPPREQ', 'addMore')
    },
    GETSTANUM({ commit, dispatch }, list) {
      let projectList = []
      let numPro = []
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        projectList.push({
          id: item.projectId,
          name: item.projectName,
          iamTreeId: item.iamTreeId,
        })
        numPro.push(item)
        commit('updateItemLoading', { item, loadingNum: true })
      }
      if (projectList.length <= 0) return
      server
        .getStaticsNum({ projectList })
        .then(res => {
          // 拿到返回值修改tableData
          dispatch('updateListNum', res || [])
          numPro.forEach(proItem => {
            commit('updateItemLoading', { item: proItem, loadingNum: false })
          })
        })
        .catch(() => {
          numPro.forEach(proItem => {
            commit('updateItemLoading', { item: proItem, loadingNum: false })
          })
        })
    },
    updateListNum({ state, commit }, list) {
      for (let i = 0; i < state.indexAppList.length; i++) {
        let item = state.indexAppList[i]
        let staticsItem = list.filter(
          resDataItem => resDataItem.id === item.projectId
        )
        if (staticsItem.length > 0) {
          commit('setNewStat', { i, newV: staticsItem[0] })
        }
      }
    },
  },
}
