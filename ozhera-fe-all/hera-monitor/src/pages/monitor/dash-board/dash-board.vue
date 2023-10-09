<template>
  <div class="dash-borad-page-wrap">
    <div
      :class="[
        'dash-board-iframe dashboard-iframe-bg',
        iframeTheme,
        { nokiosk: !serverType },
      ]"
    >
      <div class="instance">
        <span v-if="serverType" style="margin-right: 10px">
          <span class="btn-title">{{ $t('selectInstance') }}</span>
          <Select
            :data="env"
            :placeholder="$t('selectEnvironmentPlaceholder')"
            class="select-env"
            multiple
            :options="Object.keys(serverEnvList)"
            labelKey=""
            valueKey=""
            isShowCheckAll
            mutexOption="All"
            style="width: 148px"
            @changDateFn="envDataChange"
          />
          <Select
            :data="searchParams.service"
            :placeholder="$t('selectApplicationPlaceholder')"
            class="select-env"
            v-if="serviceOptions && JSON.stringify(serviceOptions) != '{}'"
            multiple
            :options="Object.keys(serviceOptions)"
            labelKey=""
            valueKey=""
            isShowCheckAll
            mutexOption="All"
            style="width: 148px"
            @changDateFn="serviceChange"
          />
          <Select
            :data="instance"
            :placeholder="$t('selectInstancePlaceholder')"
            multiple
            :options="instanceOptions"
            labelKey=""
            valueKey=""
            isShowCheckAll
            mutexOption="All"
            style="width: 148px"
            @changDateFn="instanceChange"
          />
        </span>
        <!-- <span class="btn-title">选择时间</span> -->
        <span>
          <DateTime
            v-model="time"
            :iframeUrl="iframeUrl"
            :timeOptions="timeOptions"
            dashboardFilter
            @changDateFn="changDateFn"
          />
        </span>
      </div>
      <IframeDashborad
        :url="iframeUrl"
        :showFilter="false"
        :loadingState="loading"
        :showMifassBtn="showMifassBtn"
        :appType="appType"
        :time="time"
        showGrafanaBtn
      >
      </IframeDashborad>
    </div>
  </div>
</template>

<script>
import server from '@/api/service/application.js'
import DateTime from '@/components/market-components/date'
import Select from '@/components/market-components/select'
import IframeDashborad from './IframeDashborad.vue'
import { mapMutations } from 'vuex'

export default {
  name: 'dash-board',
  components: {
    DateTime,
    Select,
    IframeDashborad,
  },
  computed: {
    time: {
      get() {
        return this.$store.state.slowquery.timer
      },
      set(val) {
        this.setTimer(val)
      },
    },
  },
  data() {
    const heraEnv = this.$route.query.heraEnv
    const heraService = this.$route.query.heraService
    // const now = (new Date()).getTime();
    return {
      loading: true,
      id: null,
      name: '',
      iframeUrl: '', // DashBoard嵌入iframe地址
      iframeTheme: 'light', // iframe主题
      instance: ['All'], // 实例选中值
      checkAll: false, // 实例是否全选
      isIndeterminate: false, // 全选checkbox 的不确定状态
      instanceOptions: [], // 实例下拉选项
      startIframeUrl: '', // 接口返回地址
      timeOptions: [
        '30s',
        '1m',
        '5m',
        '15m',
        '30m',
        '1h',
        '2h',
        '6h',
        '12h',
        '1d',
        '2d',
        '3d',
        '7d',
      ],
      scaleType: false, // 全屏状态
      env: heraEnv ? [heraEnv] : ['All'], // 应用环境
      serverEnvList: {}, // 应用环境 - IP映射列表
      serverType: true, // 服务类型
      searchParams: {
        service: heraService ? [heraService] : ['All'],
      },
      serviceOptions: {},
      showMifassBtn: false, // 是否线上自定义监控大盘按钮
      heraEnv,
      heraService,
      // time:[now-1000*60*60,now], // 默认是最近1h
      appType: '',
    }
  },
  watch: {
    $route(newV, oldV) {
      this.id = Number(this.$route.query.id)
      this.name = this.$route.query.name
      this.heraEnv = this.$route.query.heraEnv
      this.heraService = this.$route.query.heraService
      if (newV.query.id != oldV.query.id) {
        this.getGrafana() // 获取当前页面数据
      }
    },
  },
  mounted() {
    let { id, name } = this.$route.query
    if (id && name) {
      this.id = Number(id)
      this.name = name
    }
    this.getGrafana() // 获取当前页面数据
    this.addCloseEvent()
    // esc退出全屏
    document.addEventListener('keyup', e => {
      if (e.keyCode == 27 && this.scaleType) {
        this.clickScale(0) // grafana全屏事件
      }
    })
  },
  methods: {
    ...mapMutations('slowquery', ['setTimer']),
    setRouteTimer() {
      if (!this.time[0] || !this.time[1]) return
      let { query } = this.$route
      this.$router.push({
        query: {
          ...query,
          start_time: this.time[0],
          end_time: this.time[1],
          from: this.time[0],
          to: this.time[1],
        },
      })
    },
    // grafana全屏事件
    clickScale(type) {
      this.scaleType = !!type
    },
    addCloseEvent() {
      const fn = () => {
        setTimeout(() => {
          const activeElement = document.activeElement
          const selectVm = this.$refs.select
          if (activeElement.nodeName === 'IFRAME' && selectVm) {
            selectVm.handleClose() // element-ui 统一命名的关闭下拉框方法
          }
        }, 100)
      }
      document.addEventListener('focusout', fn)
      this.$once('hook:beforeDestroy', () => {
        document.removeEventListener('focusout', fn)
      })
    },
    getGrafana() {
      let { id, name } = this.$route.query
      if (!id) return
      this.loading = true
      this.iframeUrl = ''
      const param = {
        appName: `${id}_${name}`, // 查询的应用名称
      }
      server
        .getGrafanaUrl(param)
        .then(data => {
          if (data) {
            const gurl = typeof data == 'string' ? data : data.url
            const res = gurl && gurl.split('//')[1]
            const iframeUrl = res
              ? `//${res}${
                  res.includes('?') ? '&' : '?'
                }orgId=1&theme=light&var-interval=$__auto_interval_interval
&from=${this.time[0]}&to=${this.time[1]}`
              : '' // 隐藏左侧+上方
            this.startIframeUrl = `${iframeUrl}&kiosk` // 接口返回地址
            this.serverType = data.appType != 'serverless'
            this.appType = data.appType
            // 服务类型不是serverless显示实例选项
            if (this.serverType) {
              this.showMifassBtn = false // 不显示自定义监控大盘链接按钮
              // this.iframeUrl = `${iframeUrl}&var-serverEnv=All&var-instance=All`;
              this.getGrafanaInstance() // 获取grafana实例
            } else {
              this.showMifassBtn = true // 显示自定义监控大盘链接按钮
              this.iframeUrl = iframeUrl.replaceAll('&var-funcName=All', '')
            }
          } else {
            this.loading = false
            this.iframeUrl = null
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取grafana实例
    getGrafanaInstance() {
      this.checkAll = false
      const param = {
        projectId: this.id, // 项目id
        projectName: this.name, // 项目名称
      }
      server.getServerEnvList(param).then(data => {
        // 应用的环境、IP映射列表数据
        const param = {
          All: (data && (data.list || data.allIps)) || [],
        }
        const envData = (data && data.envIpMapping) || []
        this.serverEnvList = {
          ...param,
          ...envData,
        }
        this.env = this.heraEnv ? [this.heraEnv] : ['All'] // 环境默认All
        this.instance = ['All'] // 实例默认All
        this.searchParams.service = this.heraService
          ? [this.heraService]
          : ['All'] // 应用默认All
        this.serverEnvOption() // 按环境选中值，获取实例ip下拉选项
      })
    },
    // 环境change事件
    envDataChange(val) {
      this.env = val
      this.searchParams.service = ['All'] // 应用默认All
      this.instance = ['All']
      this.selectChange() // 改变grafana地址实例选中值
      this.serverEnvOption() // 按环境选中值，获取实例ip下拉选项
    },
    // 应用change事件
    serviceChange(val) {
      this.searchParams.service = val
      this.instance = ['All']
      this.selectChange() // 改变grafana地址实例选中值
      let list = []
      for (let i = 0; i < val.length; i++) {
        list = ['All', ...list, ...this.serviceOptions[val[i]]]
      }
      this.instanceOptions = list
    },
    // 实例change事件
    instanceChange(val) {
      this.instance = val
      this.selectChange() // 改变grafana地址实例选中值
    },
    // 应用数据处理
    serverListHandle() {
      // 判断是否有应用数据
      let isServer = false
      let serviceList = {} // 服务
      for (let i = 0; i < this.env.length; i++) {
        if (this.env[i] === 'All') {
          for (let i in this.serverEnvList) {
            const list = this.serverEnvList[i] // envIpMapping数据
            if (list.serviceList) {
              isServer = true
              serviceList = {
                ...serviceList,
                ...list.serviceList,
              }
            }
          }
        } else if (this.serverEnvList[this.env[i]].serviceList) {
          isServer = true
          serviceList = {
            ...serviceList,
            ...this.serverEnvList[this.env[i]].serviceList,
          }
        }
      }
      if (isServer) {
        let ip = []
        Object.values(serviceList).forEach(item => {
          ip = [...ip, ...item]
        })
        this.serverEnvList['All'] = {
          envIps: ip,
          serviceList,
        }
        this.serviceOptions = {
          All: ip,
          ...serviceList,
        }
      } else {
        this.serviceOptions = {}
      }
    },
    // 按环境选中值，获取实例ip下拉选项
    serverEnvOption() {
      let list = ['All']
      this.serverListHandle() // 应用数据处理
      for (let i = 0; i < this.env.length; i++) {
        let serveList = this.serverEnvList[this.env[i]]
        const envip = (serveList && serveList.envIps) || serveList
        list = [...list, ...envip]
      }
      this.instanceOptions = list
      // url携带ip参数处理
      const ip = this.$route.query.ip
      if (typeof ip == 'string') {
        const i = this.instanceOptions.find(item => item == ip)
        if (i) this.instance = [ip || 'All'] // 实例默认All
      } else if (typeof ip == 'object') {
        const newIp = []
        ip.forEach(item => {
          const i = this.instanceOptions.find(item2 => item2 == item)
          i && newIp.push(item)
        })
        if (newIp.length) this.instance = [...newIp]
      } else {
        this.instance = ['All'] // 实例默认All
      }
      this.selectChange() // 改变grafana地址实例选中值
    },
    // 改变grafana地址实例选中值
    selectChange() {
      this.loading = true
      // 实例环境参数处理
      const env = this.env.join(',').replace(/,/g, '&var-serverEnv=')
      var sZLabel = 'var-serverZone'
      const serveZoneEnv = this.env.join(',').replace(/,/g, `&${sZLabel}=`)
      // 实例ip参数处理
      const service = this.searchParams.service
        .join(',')
        .replace(/,/g, '&var-service=')
      const instance = this.instance.join(',').replace(/,/g, '&var-instance=')
      let url = this.startIframeUrl
      // 改变时间参数
      url = this.replaceQueryString(url, 'from', this.time[0] || '')
      url = this.replaceQueryString(url, 'to', this.time[1] || '')
      env
        ? (url = `${url}&var-serverEnv=${env}&${sZLabel}=${serveZoneEnv}`)
        : ''
      service ? (url = `${url}&var-service=${service}`) : ''
      instance ? (url = `${url}&var-instance=${instance}`) : ''
      this.iframeUrl = url
      this.loading = false
    },
    // 选择时间日期组件回调事件 time
    changDateFn(url) {
      this.iframeUrl = url
      this.setRouteTimer()
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
.dashboard-iframe-bg >>> .select-env {
  margin-right: -1px;
}
.dashboard-iframe-bg >>> .select-env:hover,
.dashboard-iframe-bg >>> .select-env:focus {
  position: relative;
  z-index: 19;
}
</style>
<style lang="less" scoped>
.wrap {
  padding: 16px;
  background: rgba(255, 255, 255, 1);
}
.tab-pane-wrap {
  .dash-board-iframe {
    width: 100%;
    height: calc(100vh - 134px);
    vertical-align: top;
    background: #f4f5f5;
    overflow: hidden;
    .iframe {
      height: calc(100vh - 150px);
    }
    iframe {
      position: relative;
      left: -16px;
      right: 0;
      top: -10px;
      width: calc(100% + 16px);
      height: calc(100% + 16px);
    }
    &.iframe-no-data {
      display: flex;
      align-items: center;
    }
  }
  .dashboard-iframe-bg {
    background: #f4f5f5;
    &.light {
      background: #f4f5f5;
    }
    &.black {
      background: #0b0c0e;
    }
    .instance {
      display: flex;
      height: 42px;
      padding-bottom: 10px;
      background: #f4f5f5;
      position: relative;
      z-index: 1;
      max-width: 960px;
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
.btn-title {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  border: 1px solid #dcdfe6;
  border-right: 0;
  color: #606266;
  text-align: center;
  font-size: 12px;
  padding: 9px 15px;
  background: #fff;
}
.dash-borad-page-wrap {
  min-width: 953px;
}
</style>
