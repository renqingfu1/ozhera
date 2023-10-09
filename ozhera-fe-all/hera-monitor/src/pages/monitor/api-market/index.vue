<template>
  <div class="list-content">
    <GrafanaIFrame :url="iframeUrl" :serviceArray="serviceArray || []">
      <template>
        <div class="api-market-title">
          <el-tabs v-model="activeName" size="mini" @tab-click="handleClickTab">
            <el-tab-pane
                v-for="(item, index) in activeList"
                :key="`${item.value}-${index}`"
                :label="item.label"
                :name="item.value"
            >
            </el-tab-pane>
          </el-tabs>
          <div class="api-market-title-right">
            <span class="btn-title">{{ $t('selectTime') }}</span>
            <DatePicker v-if="showDateComponent" v-model="date" :iframeUrl="urlParams" :timeOptions="timeOptions"
                        @changDateFn="changParamFn" />
            <Time v-else value="30m" :url="urlParams" :timeOptions="timeOptions" isToSecond @changDateFn="changParamFn" />
            <span v-if="showService">
              <span class="btn-title" style="margin-left: 10px">选择服务</span>
              <el-select v-model="service" ref="select" :placeholder="$t('pleaseSel')" size="small"
                         multiple
                         :multiple-limit="5"
                         style="vertical-align: middle"
                         class="select-multiple-1line-style"
                         @visible-change="serviceChange">
                <el-option
                    v-for="item in serviceOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </span>
          </div>
        </div>
      </template>
    </GrafanaIFrame>
  </div>
</template>

<script>
import GrafanaIFrame from '@/components/market-components/index'
import Time from '@/components/market-components/time';
import DatePicker from '@/components/market-components/date';
import server from "@/api/service/market-common";
import MarketData from './market-data'
import {getSelectStorage} from "@/utils/localStorage";

export default {
  name: 'api-market',
  components: {
    GrafanaIFrame,
    Time,
    DatePicker
  },
  props: {},
  data() {
    return {
      loading: false,
      activeName: this.$route.query.activeMarket || 'DubboProviderView', // tab选中值
      urlParams: '',
      iframeUrl: '',
      activeList: MarketData[this.$store.state.menu.mode],
      id: Number(this.$route.query.id) || null,
      name: this.$route.query.name,
      time: '',
      date: ['now-30m','now'],
      service: [],
      serviceOptions: [],
      serviceArray: [], // dubbo服务grafana服务数组
      showServiceData: ['DubboProvider', 'DubboConsumer', 'httpClient', 'grpcClient', 'grpcServer', 'thriftClient', 'thriftServer', 'apusClient', 'apusServer'], // 大盘显示选择服务筛选项
      timeOptions: ['30s', '1m', '5m', '15m', '30m', '1h', '2h', '6h', '12h', '1d', '2d', '3d', '7d'],
      serviecLoading: false,
      showDataFilterData: ['DubboProvider', 'DubboConsumer', 'Http'],
    }
  },
  watch: {
    '$route'() {
      this.activeName = this.$route.query.activeMarket || 'DubboProviderView'
      this.serviceArray = []
      // this.getLocalDate(); // 获取本地存储日期选中数据
      this.getDubboServiceList(); // 修改iframe地址
    },
    // "$store.state.menu.mode": {
    //   handler() {
    //     this.MarketDataHandle(val)
    //     this.activeName = this.activeList[0].value; // tab选中值
    //     this.handleClickTab()
    //   },
    //   immediate: true
    // }
  },
  computed: {
    // 显示选择服务筛选项
    showService() {
      return this.showServiceData.includes(this.activeName)
    },
    showDateComponent() {
      return this.showDataFilterData.includes(this.activeName)
    }
  },
  async created() {
    server.getMarketBase({}).then((res)=>{
      this.activeList = res ||[];
      this.changeIframeUrl(); // 修改iframe地址
      this.addCloseEvent();
    })
  },
  methods: {
    // 点击其他地方隐藏下拉选项框
    addCloseEvent() {
      const fn = () => {
        setTimeout(() => {
          const activeElement = document.activeElement;
          const selectVm = this.$refs.select
          if (activeElement.nodeName === "IFRAME") {
            selectVm.handleClose() // element-ui 统一命名的关闭下拉框方法
          }
        }, 100);
      };
      document.addEventListener("focusout", fn);
      this.$once("hook:beforeDestroy", () => {
        document.removeEventListener("focusout", fn);
      });
    },
    // tab 被选中时触发
    handleClickTab() {
      const param = Object.assign({}, this.$route.query, {'activeMarket': this.activeName});
      this.$router.push({
        'path': this.$route.path,
        'query': param
      });
    },
    serverTimeHandle() {
      let val = this.date
      if (!this.showDateComponent || this.date[1] == 'now') { // 快捷键日期值处理\
        let quickValue = this.time
        if (this.date[1] == 'now') {
          quickValue = this.date[0].split('-')[1]
        }
        const timeUnit = { // 日期时间快捷键换算
          's': 1000, // 秒
          'm': 60 * 1000, // 分
          'h': 3600 * 1000, // 小时
          'd': 3600 * 1000 * 24 // 天
        }
        const time = timeUnit[quickValue.replace(/[^a-zA-Z]/g,'')] * parseInt(quickValue)
        const start = new Date();
        val = [start.getTime() - time, new Date().getTime()]
      }
      return val
    },
    // 获取DubboService列表数据
    getDubboServiceList() {
      this.changeIframeUrl(); // 修改iframe地址
      if (!this.showService || this.serviecLoading) return false;
      this.serviecLoading = true;
      const time = this.serverTimeHandle()
      const param = {
        serviceName: `${this.$route.query.id}_${this.$route.query.name.replace(/-/g, '_')}`, // 查询的应用名称
        startTime: parseInt(time[0] / 1000),
        endTime: parseInt(time[1] / 1000),
      }
      console.log('--->>>',this.activeList,this.activeName);
      const activeList = this.activeList.find(item => item.value == this.activeName);
      if (activeList && activeList.type) {
        param.type = activeList.type
      }
      this.serviceOptions = []; // 清空下拉选项
      this.serviceArray = []; // dubbo服务grafana服务数组
      console.log('param', param);
      server.getDubboServiceListPromise(param).then(res => {
        this.serviecLoading = false;
        this.serviceOptions = res || [];
        if (this.serviceOptions.length) {
          const { service } = this.$route.query
          if (typeof service == 'object') {
            this.service = [...service]
          } else if (this.service.length) {
            // 已选中服务处理
            const select = this.service.filter(item=> this.serviceOptions.includes(item))
            this.service = select.length ? select : [this.serviceOptions[0]]
          } else {
            this.service = [service || this.serviceOptions[0]]
          }
        } else {
          this.service = []; // 清空选中值
        }
        this.serviceChange(this.service); // 修改iframe地址
      }).catch(() => {
        this.serviecLoading = false;
        this.service = []; // 清空选中值
        this.serviceChange(this.service); // 修改iframe地址
      })
    },
    // 修改iframe地址
    changeIframeUrl() {
      const activeList = this.activeList.find(item => item.value == this.activeName);
      if (!activeList) return false
      const appParamName = activeList.appParamName; // 应用参数key
      const query = this.$route.query
      const appParam = `&${appParamName}=${query.id}_${query.name.replace(/-/g, '_')}`
      const url = activeList[`${process.env.NODE_ENV}Url`] || activeList.url
      this.iframeUrl = `${url}${appParam}${this.urlParams}`
    },
    // 选择时间change事件
    changParamFn(url, val) {
      this.urlParams = url;
      if (this.showDateComponent) {
        this.date = val
      } else {
        this.time = val
      }
      this.getDubboServiceList(); // 获取DubboService列表数据
    },
    // 选择服务change事件
    serviceChange() {
      const val = this.service
      if (!val.length) {
        this.serviceArray = []
        return false;
      }
      const iframeArray = []
      val.forEach(item => {
        iframeArray.push({
          url: `${this.iframeUrl}&theme=light&var-serviceName=${item}`,
          height: 366,
          title: item,
          loading: true
        })
      })
      this.serviceArray = iframeArray
    },
    // 替换参数
    replaceQueryString(url, name, value) {
      if (url.includes(`&${name}=`)) {
        const re = new RegExp(name + '=[^&]*', 'gi')
        return url.replace(re, name + '=' + value || '')
      } else {
        return `${url}&${name}=${value}`
      }
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
      return param[name];
    },
    // 模式切换接口大盘tab数据处理
    // MarketDataHandle(val) {
    //   if (val == 'general') {
    //     this.activeList = [
    //       ...MarketData['all'],
    //       ...MarketData['general']
    //     ]
    //   } else {
    //     this.activeList = MarketData[val]
    //   }
    // },
    // 获取本地存储日期选中数据
    getLocalDate() {
      if (this.showDateComponent) {
        const param = getSelectStorage('datePickerSelect')
        const quickValue = param && param.quickValue
        let val = param && param.value || ['now-30m', 'now']
        if (quickValue && typeof quickValue == "string") { // 快捷键日期值处理
          val = [`now-${quickValue}`, 'now']
        }
        this.date = val
      } else if (getSelectStorage('timePickerSelect')) {
        this.time = getSelectStorage('timePickerSelect')
      }
    },
  }
}
</script>
<style scoped>
.api-market-title >>> .el-tabs__header {
  background: #f4f5f5;
}
.list-content >>> .iframe .iframe-content, .list-content >>> .iframe .service-array {
  height: calc(100% - 72px);
}
</style>
<style lang="less" scoped>
.list-content {
  .api-market-title {
    width: 100%;
    position: relative;
    &-right {
      padding-top: 10px;
      //position: absolute;
      //top: 0;
      //right: 16px;
      //z-index: 9;
      //max-width: calc(100% - 320px);
      //overflow: hidden;
      //white-space: nowrap;
    }
    .el-tabs {
      position: relative;
      top: -10px;
      height: 40px;
    }
  }
}
.api-market-title-right{
  display: flex;
}
</style>
