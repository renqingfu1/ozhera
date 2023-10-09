<template>
  <div :class="['market-mian', { scaleGrafana: scaleType }]">
    <GrafanaIFrame
      :url="iframeUrl"
      :refreshBtnTop="68"
      :loadingState="loading"
      v-loading="loading"
    >
      <template>
        <ITitle>
          <template>
            <el-button type="text" @click="goPageName" style="font-size: 16px">
              <i
                class="el-icon-arrow-left"
                style="font-size: 18px; vertical-align: -1px"
              />{{ $t('GoBack') }}
            </el-button>
            <el-popover trigger="hover" placement="bottom-start">
              <div class="server-name-popover">
                <span
                  v-for="(sItem, sIndex) in serverName.split(';')"
                  :key="sItem"
                  class="server-name-item"
                >
                  {{ sItem
                  }}<span v-if="sIndex + 1 < serverName.split(';').length"
                    >、</span
                  >
                </span>
              </div>
              <em
                slot="reference"
                class="el-icon-warning-outline"
                style="margin: 0 8px; color: #666; cursor: pointer"
              ></em>
            </el-popover>
          </template>
          <template #button>
            <el-select
              v-model="time"
              :placeholder="$t('pleaseSel')"
              size="small"
              style="width: 110px; margin-right: 10px; vertical-align: top"
              @change="selectChange"
            >
              <el-option
                v-for="item in timeOptions"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <el-date-picker
              v-if="false"
              v-model="time"
              style="margin: 0 10px; width: 400px"
              type="datetimerange"
              popper-class="el-data-picker-quick-key"
              :picker-options="pickerOptions"
              :default-time="['00:00:00', '23:59:59']"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="timestamp"
              range-separator="~"
              size="small"
              :start-placeholder="startPlaceholder"
              :end-placeholder="endPlaceholder"
              align="right"
              @change="confirmTime"
            >
            </el-date-picker>
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
      </template>
    </GrafanaIFrame>
  </div>
</template>

<script>
import ITitle from '@/components/i-title'
import server from '@/api/service/market'
import GrafanaIFrame from '@/components/market-components'
import { setSelectStorage, getSelectStorage } from '@/utils/localStorage'

export default {
  name: 'market-details',
  components: {
    ITitle,
    GrafanaIFrame,
  },
  data() {
    return {
      loading: false,
      iframeUrl: '', // grafana嵌入iframe地址
      iframeTheme: 'light', // iframe主题
      time: getSelectStorage('timePickerSelect') || '30m', // 选中时间
      timeOptions: [
        '5m',
        '15m',
        '30m',
        '1h',
        '3h',
        '6h',
        '12h',
        '24h',
        '2d',
        '3d',
        '7d',
      ],
      serverName: this.$route.query.serverName,
      scaleType: false, // 全屏状态
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      pickerOptions: {
        // 当前时间日期选择器特有的选项
        shortcuts: [],
      },
      unit: {
        // 日期时间快捷键显示对应时间单位
        m: 'minutes',
        h: 'hours',
        d: 'days',
      },
      serverKey: 'var-serverName',
    }
  },
  created() {
    this.getMarketGrafanaFn() // 获取大盘服务地址
    this.pickerOptionsChange() // 日期时间组件快捷键数据处理
    // esc退出全屏
    document.addEventListener('keyup', e => {
      if (e.keyCode == 27 && this.scaleType) {
        this.clickScale(0) // grafana全屏事件
      }
    })
  },
  methods: {
    // 获取大盘服务地址
    getMarketGrafanaFn() {
      const query = this.$route.query
      let serverTypeParam = 'project'
      if (query.serverType == 'quality') {
        this.qualityParamHandle() // 质量大盘grafana url数据处理
        return false
      }
      this.loading = true
      const param = {
        serviceType: this.$route.query.serverType,
      }
      server
        .getMarketGrafanaPromise(param, serverTypeParam)
        .then(res => {
          this.loading = false
          this.serverChange(`${res}&var-interval=$__auto_interval_interval`)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 质量大盘grafana url数据处理
    qualityParamHandle() {
      this.serverKey = 'var-application'
      let params = {
        url: process.env.VUE_APP_GRAFANA_DOMAIN,
        env: 'online',
      }
      const url = `${params.url}/d/Cqzx0NMVz/zhi-liang-da-pan?orgId=1&var-serviceName=jaeger&var-env=${params.env}`
      this.serverChange(url)
    },
    // grafana全屏事件
    clickScale(type) {
      this.scaleType = !!type
    },
    // grafana服务地址处理
    serverChange(res) {
      // 后端没有返回grafana地址，大盘不显示
      if (!res) {
        this.iframeUrl = ''
        return false
      }
      this.loading = true
      const grafanaUrl = `${res}&kiosk&theme=${this.iframeTheme}`
      this.serverName = this.$route.query.serverName
      // 应用列表参数处理
      const serverName = this.serverName
        .replace(/-/g, '_')
        .replace(/;/g, `&${this.serverKey}=`)
      this.iframeUrl = `${grafanaUrl}&from=now-${this.time}&to=now&${this.serverKey}=${serverName}`
      this.loading = false
    },
    // 跳转页面
    goPageName() {
      this.$router.go(-1)
      // this.$router.push({name: 'Market'}); // 跳转到
    },
    // 日期时间组件快捷键数据处理
    pickerOptionsChange() {
      const self = this
      const shortcuts = []
      this.timeOptions.forEach(item => {
        shortcuts.push({
          text: `Last ${item.slice(0, -1)} ${this.unit[item.slice(-1)]}`,
          onClick(picker) {
            const start = `now-${item}`
            const end = 'now'
            self.startPlaceholder = start
            self.endPlaceholder = end
            picker.$emit('pick', [start, end])
          },
        })
      })
      this.pickerOptions.shortcuts = shortcuts
    },
    // 选择时间
    selectChange() {
      this.loading = true
      setSelectStorage('timePickerSelect', this.time) // 存储选中数据
      let url = this.replaceQueryString(
        this.iframeUrl,
        'from',
        `now-${this.time}` || ''
      )
      this.iframeUrl = url // 接口返回地址
    },
    // 日期时间组件change事件
    confirmTime(val) {
      if (!val) {
        this.time = [undefined, undefined]
        this.startPlaceholder = '开始日期'
        this.endPlaceholder = '结束日期'
      }
      this.selectDateChange()
    },
    // 选择日期处理
    selectDateChange() {
      this.loading = true
      let url = this.replaceQueryString(
        this.iframeUrl,
        'from',
        this.time[0] || ''
      )
      url = this.replaceQueryString(url, 'to', this.time[1] || '')
      this.iframeUrl = url // 接口返回地址
    },
    // iframe load
    loadIframe() {
      this.loading = false
    },
    // 替换参数
    replaceQueryString(url, name, value) {
      const re = new RegExp(name + '=[^&]*', 'gi')
      return url.replace(re, name + '=' + value || '')
    },
  },
}
</script>
<style lang="less" scoped>
.scaleGrafana {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  transition: all 600ms;
  .iframe {
    height: calc(100vh - 70px);
  }
}
.content {
  padding: 16px 0 0 16px;
  background: #f7f8fa;
}
.iframe {
  width: 100%;
  height: calc(100vh - 126px);
  vertical-align: top;
  background: #f7f8fa;
  overflow: hidden;
  iframe {
    position: relative;
    left: -16px;
    right: 0;
    top: -10px;
    width: calc(100% + 16px);
    height: calc(100% + 10px);
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
    height: 32px;
    padding-bottom: 10px;
    background: #f7f8fa;
    position: relative;
    z-index: 1;
    .ip-select {
      position: relative;
      display: inline-block;
      max-width: 100%;
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
.server-name {
  position: relative;
  min-width: 120px;
  max-width: 500px;
  border-right: 1px solid #dcdfe6;
  padding-right: 30px;
  white-space: nowrap;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: not-allowed;
  &:before {
    position: absolute;
    top: 8px;
    right: 8px;
    font-family: element-icons !important;
    content: '\e6df';
    color: #c0c4cc;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }
}
// 应用名称popover内容样式
.server-name-popover {
  max-width: 400px;
  .server-name-item {
    display: inline-block;
    white-space: nowrap;
  }
}
</style>
