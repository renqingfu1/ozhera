<template>
  <div :class="['grafana-iframe-warp', { scaleGrafana: scaleType }]">
    <ITitle>
      <template>
        <span class="header-app-title">{{ $t('applicationName') }}：</span>
        <span class="header-app-select">
          <el-select
            v-model.number="id"
            placeholder=""
            size="small"
            filterable
            style="
              width: 100%;
              height: 32px;
              position: absolute;
              top: 0;
              left: 0;
            "
            class="ititle-select"
            @change="changeApp"
          >
            <el-option
              v-for="item in $store.state.project.appData"
              :key="item.projectId + '-' + item.appSource"
              :label="item.projectName"
              :value="item.projectId"
            >
            </el-option>
          </el-select>
          <span class="header-app-txt"> {{ name }}</span>
        </span>
      </template>
      <template #button v-if="scaleName.includes(activeTab)">
        <el-button
          icon="iconfont icon-scale-big"
          v-if="!scaleType"
          style="padding: 7px"
          @click="clickScale(1)"
        ></el-button>
        <el-button
          icon="iconfont icon-scale-small"
          v-if="scaleType"
          style="padding: 7px"
          @click="clickScale(0)"
        ></el-button>
      </template>
    </ITitle>
    <el-tabs
      v-model="activeTab"
      :class="['tab-pane-wrap tab-app-title-header', `tab-app-${activeTab}`]"
      @tab-click="handleClickTab"
    >
      <el-tab-pane
        label="Dashboard"
        name="dashboard"
        class="el-tab-pane-iframe"
        v-loading="loading"
      >
        <DashBoard v-if="activeTab == 'dashboard' || isRequest['dashboard']" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('resourceUtilization')"
        name="resource"
        class="el-tab-pane-iframe"
      >
        <Resource v-if="activeTab == 'resource' || isRequest['resource']" />
      </el-tab-pane>
      <el-tab-pane name="exception">
        <TabLabelSlot
          slot="label"
          :label="$t('overviewExceptions')"
          :num="exceptionTotal"
        />
        <TwoStageExceptionTabs
          type="exception"
          v-show="activeTab == 'exception'"
          v-if="activeTab == 'exception' && appData"
        />
      </el-tab-pane>
      <el-tab-pane name="slowQuery">
        <TabLabelSlot
          slot="label"
          :label="$t('overviewQueries')"
          :num="slowTotal"
        />
        <TwoStageExceptionTabs
          type="slowQuery"
          v-show="activeTab == 'slowQuery'"
          v-if="activeTab == 'slowQuery' && appData"
        />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('interfaceDisk')"
        name="ApiMarket"
        class="el-tab-pane-iframe"
      >
        <ApiMarket v-if="activeTab == 'ApiMarket' || isRequest['ApiMarket']" />
      </el-tab-pane>
      <!-- <el-tab-pane label="中间件" name="middleware">
        <Middleware v-if="activeTab == 'middleware' || isRequest['middleware']" />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import { setSelectStorage, getSelectStorage } from '@/utils/localStorage'

import ITitle from '@/components/i-title'
// import SlowQueryTabs from '../../slowquery-exception';
import TwoStageExceptionTabs from '../../slowquery-exception/indexTwoStage.vue'
import ApiMarket from '../api-market/index'
// import Middleware from '../../../components/middleware/index'
import { getDataName } from '@/utils/index'
import { mapActions, mapState, mapMutations } from 'vuex'
import DashBoard from './dash-board'
import Resource from '../resource/index'
import TabLabelSlot from '@/pages/slowquery-exception/components/TabLabelSlot.vue'
import { reRealTime } from '@/utils/ret-now-time.js'

export default {
  name: 'dash-board',
  components: {
    ITitle,
    // SlowQueryTabs,
    TwoStageExceptionTabs,
    ApiMarket,
    // Middleware,
    DashBoard,
    Resource,
    TabLabelSlot,
  },
  computed: {
    ...mapState({
      statistics: state => state.slowquery.nums,
      isAllMenuMode: state => state.menu.isAllMenuMode,
      appData: state => state.project.appData,
      commonTime: state => state.slowquery.timer,
    }),
    staKeys() {
      return Object.keys(this.statistics)
    },
    slowNumsKey() {
      const slowKeys = this.staKeys.filter(
        item => item.indexOf('slow') > -1 || item.indexOf('Slow') > -1
      )
      return slowKeys
    },
    errorNumsKey() {
      const errorKeys = this.staKeys.filter(
        item => item.indexOf('Error') > -1 || item.indexOf('Exception') > -1
      )
      return errorKeys
    },
    exceptionTotal() {
      //异常总数
      return this.getTotalNums('errorNumsKey')
    },
    slowTotal() {
      //慢查询总数
      return this.getTotalNums('slowNumsKey')
    },
  },
  watch: {
    $route(to, from) {
      if (
        to.query.id !== from.query.id ||
        to.query.start_time !== from.query.start_time ||
        to.query.end_time !== from.query.end_time
      ) {
        // 如果切换了应用 或者时间
        this.getStatistics()
      }
    },
    isAllMenuMode(newValue) {
      if (!newValue) {
        //切到精简模式
        if (['resource', 'middleware'].indexOf(this.activeTab) > -1) {
          this.activeTab = 'dashboard'
        }
      }
    },
  },
  data() {
    return {
      loading: false,
      activeTab: this.$route.query.activeTab || 'dashboard', // tabs选中值
      id: Number(this.$route.query.id) || null,
      name: '',
      iframeUrl: '', // DashBoard嵌入iframe地址
      isRequest: {}, // tab-pane是否已请求
      scaleType: false, // 全屏状态
      scaleName: ['dashboard', 'resource', 'ApiMarket'],
    }
  },
  mounted() {
    // 统一设置tab时间，后面统计要用
    this.initTime()
    this.getProjectSelectLocal()
    this.initAppInfo() // app time 回显
    this.getAppOptions()
    // esc退出全屏
    document.addEventListener('keyup', e => {
      if (e.keyCode == 27 && this.scaleType) {
        this.clickScale(0) // grafana全屏事件
      }
    })
  },
  methods: {
    ...mapActions('slowquery', ['GETNUMSTATISTICS']),
    ...mapMutations('slowquery', ['setTimer']),
    initTime() {
      let { start_time, end_time, from, to } = this.$route.query
      if (from && to) {
        this.setTimer([from, to])
      }
      if (start_time && end_time) {
        this.setTimer([start_time, end_time])
      }
    },
    // grafana全屏事件
    clickScale(type) {
      this.scaleType = !!type
    },
    getTotalNums(typeName) {
      let val = 0
      for (let i = 0; i < this[typeName].length; i++) {
        const curKey = this[typeName][i]
        val = val + this.statistics[curKey]
      }
      return val
    },
    getAppOptions() {
      this.$store.dispatch('project/getAppList', () => {
        let { id } = this.$route.query
        if (!id) {
          // 若没有携带应用id 此时不获取统计数据因为这里会更新地址id ，到时候会触发路由监听
          this.id = this.appData[0].projectId
          this.name = this.appData[0].projectName
          this.changeApp()
        } else {
          this.getStatistics()
        }
      })
    },
    // 处理url携带时间、app参数
    initAppInfo() {
      const { id, name } = this.$route.query
      if (id && name) {
        this.id = Number(id)
        this.name = name
      }
    },
    reRealTime,
    retTime(preTime) {
      let newT =
        (preTime + '').indexOf('now') >= 0 ? this.reRealTime(preTime) : preTime
      return parseInt(newT / 1000)
    },
    getStatistics() {
      let { query } = this.$route
      const { id } = query
      if (!id) return
      let startTime = this.retTime(this.commonTime[0])
      let endTime = this.retTime(this.commonTime[1])
      let params = {
        startTimeCurrent: startTime,
        endTimeCurrent: endTime,
        startTime,
        endTime,
        methodName: query.method_name,
        projectList: [
          {
            id: query.id,
            name: query.name,
            // iamTreeId:query.iamTreeId
          },
        ],
      }
      this.GETNUMSTATISTICS(params)
    },
    // 跳转页面
    goPageName() {
      this.$router.push({ name: 'application' }) // 跳转到
    },
    // tab 被选中时触发
    handleClickTab() {
      this.scaleType = false
      const param = Object.assign({}, this.$route.query, {
        activeTab: this.activeTab,
      })
      this.$router.push({
        path: this.$route.path,
        query: {
          ...param,
          method_name: '',
        },
      })
    },
    // 头部应用切换时重新获取
    changeApp() {
      let filter = this.appData.filter(item => item.projectId === this.id)
      let item = filter[0] || {}
      let name = getDataName(this.id, this.appData, 'projectId', 'projectName')
      this.name = name
      const param = Object.assign({}, this.$route.query, {
        id: this.id,
        name,
        iamTreeId: item.iamTreeId,
      })
      setSelectStorage('projectSelect', param) // 存储已访问项目数据到localStorage
      this.$router.replace({
        path: this.$route.path,
        query: param,
      })
    },
    loadIframe() {
      this.loading = false
    },
    // 替换参数
    replaceQueryString(url, name, value) {
      const re = new RegExp(name + '=[^&]*', 'gi')
      return url.replace(re, name + '=' + value || '')
    },
    // 获取url参数
    getQueryString(name, url) {
      const param = {}
      const urlSearch = url.split('?')[1].split('&')
      urlSearch.forEach(item => {
        const val = item.split('=')
        if (param[val[0]]) {
          param[val[0]] = param[val[0]] + ',' + val[1]
        } else {
          param[val[0]] = val[1]
        }
      })
      return param[name]
    },
    // 获取localStorage存储的已访问项目数据
    getProjectSelectLocal() {
      const param = getSelectStorage('projectSelect')
      if (param) {
        const params = Object.assign({}, this.$route.query, param)
        this.$router
          .replace({
            path: this.$route.path,
            query: params,
          })
          .catch(() => {})
        return param
      }
      return false
    },
  },
}
</script>
<style scoped>
.dashboard-iframe-bg.black >>> .el-button,
.dashboard-iframe-bg.black >>> .el-input__inner {
  border-color: rgba(51, 62, 85, 1);
  color: #c5ced6;
  background: rgba(38, 47, 62, 1);
}
.dashboard-iframe-bg.black >>> .el-tag.el-tag--info {
  color: #c5ced6;
}
.dashboard-iframe-bg >>> .el-button {
  height: 32px;
  border-right: none;
  vertical-align: top;
}

.dashboard-iframe-bg >>> .el-input__inner {
  padding: 2px 15px;
  font-size: 12px;
}
.dashboard-iframe-bg >>> .el-select .el-select__tags > span {
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.dashboard-iframe-bg >>> .el-tag.el-tag--info {
  display: inline-block;
  border: none;
  background: none;
  padding: 0;
  color: #606266;
}
.dashboard-iframe-bg >>> .el-tag.el-tag--info .el-tag__close {
  display: none;
}
.dashboard-iframe-bg >>> .el-tag.el-tag--info:not(:last-child):after {
  display: inline-block;
  content: '+';
  margin-left: 5px;
  vertical-align: 1px;
}
</style>
<style lang="less" scoped>
.scaleGrafana {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  transition: all 600ms;
  .tab-pane-wrap .iframe {
    height: calc(100vh - 70px);
  }
}
.wrap {
  padding: 16px;
  background: rgba(255, 255, 255, 1);
}
.tab-pane-wrap {
  .iframe {
    width: 100%;
    height: calc(100vh - 142px);
    vertical-align: top;
    background: #f7f8fa;
    overflow: hidden;
    iframe {
      position: relative;
      left: -16px;
      right: 0;
      top: -10px;
      width: calc(100% + 16px);
      height: calc(100% - 32px);
    }
    &.iframe-no-data {
      display: flex;
      align-items: center;
    }
  }
  .dashboard-iframe-bg {
    background: #f7f8fa;
    &.light {
      background: #f7f8fa;
    }
    &.black {
      background: #0b0c0e;
    }
    .instance {
      display: flex;
      height: 42px;
      padding-bottom: 10px;
      background: #f7f8fa;
      position: relative;
      z-index: 1;
      .ip-select {
        position: relative;
        display: inline-block;
        max-width: 100%;
        cursor: pointer;
        overflow: hidden;
        .instance-select {
          position: relative;
          display: inline-block;
          padding: 0 30px 0 5px;
          min-width: 200px;
          line-height: 30px;
          color: #fff;
          font-size: 12px;
          background: #141619;
          border: 1px solid #202226;
          box-sizing: border-box;
          overflow: hidden;
          span {
            padding: 0 8px;
          }
        }
        .el-select {
          position: absolute;
          top: 0;
          left: 5px;
          z-index: 9;
        }
      }
    }
  }
}
.header-app-title {
  display: inline-block;
  vertical-align: middle;
  padding-right: 5px;
}
.header-app-select {
  position: relative;
  display: inline-block;
  height: 32px;
  vertical-align: middle;
}
.header-app-txt {
  display: inline-block;
  margin-right: 40px;
  max-width: 200px;
  line-height: 32px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
