<template>
  <div class="market-wrap" ref="marketWrap" v-loading="loading">
    <div :class="['iframe dashboard-iframe-bg', theme, {filter: showFilter}]">
      <div class="instance" v-if="showFilter" :style="{'justify-content': filterAlign}">
        <slot></slot>
      </div>
      <div class="service-array" v-if="serviceUrlArray && serviceUrlArray.length">
        <div v-for="(iframeItem, iframeIndex) in serviceUrlArray" :key="iframeIndex" class="service-group">
          <h3>{{iframeItem.title}}</h3>
          <iframe :src="iframeItem.url + viewPanel"
                  :height="iframeItem.height"
                  scrolling="no"
                  v-loading="iframeItem.loading"
                  frameborder="0" @load="loadIframe(iframeItem)" />
        </div>
      </div>
      <iframe v-else-if="iframeUrl"
              :src="iframeUrl + viewPanel"
              id="iframe"
              class="iframe-content"
              ref="iframe"
              scrolling="no"
              frameborder="0" @load="loadIframe" />
      <div class="iframe iframe-no-data" v-if="!loading && showNoData">
        <div class="no-data">
          <i class="el-icon-warning" /><br>暂无数据
        </div>
      </div>
      <div class="iframe-mask-layer" v-if="disabledClickEvent"></div>
    </div>
    <span v-if="iframeUrl || serviceUrlArray.length"
          class="refresh" ref="refresh" :style="refreshStyle"
          @mousedown="mousedown($event, 'refresh', 'refreshStyle')">
      <el-button type="primary" size='small' plain
                 :disabled="loading"
                 @click.stop='refreshMarket'>{{ $t('refresh') }}</el-button>
    </span>
    <span v-if="showGrafanaBtn && (iframeUrl || serviceUrlArray.length)"
          class="refresh" ref="grafana" :style="mifassStyle"
          @mousedown="mousedown($event, 'grafana', 'mifassStyle')">
      <el-button type="primary" size='small'
                 :disabled="loading"
                 @click.stop='goMifass'>自定义监控大盘</el-button>
    </span>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  components: {},
  props: {
    url: String,
    serviceArray: { // 多个iframe大盘
      type: Array,
      default: () => [],
    },
    theme: { // grafana展示风格
      type: String,
      default: 'light'
    },
    showFilter: { // 显示筛选项
      type: Boolean,
      default: true
    },
    filterAlign: { // 筛选项对齐方式
      type: String,
      default: ''
    },
    className: { // iframe style样式
      type: String,
      default: ''
    },
    refreshBtnTop: { // 刷新按钮top距离
      type: Number,
      default: 56
    },
    refreshBtnRight: { // 刷新按钮right距离
      type: Number,
      default: 16
    },
    refreshBtnY: { // 刷新按钮Y轴
      type: Number,
      default: 32
    },
    showMifassBtn: { // 显示自定义监控大盘按钮
      type: Boolean,
      default: false
    },
    mifassBtnRight: { // 自定义监控大盘按钮right距离
      type: Number,
      default: 105
    },
    showGrafanaBtn: { // 页面是否显示自定义监控大盘按钮
      type: Boolean,
      default: false
    },
    loadingState: { // 加载状态 需要异步请求大盘地址时需要
      type: Boolean,
      default: false
    },
    appType:{}, // 应用类型
    time:{
      type:Array
    }
  },
  computed:{
    ...mapState({
      mode: state => state.menu.mode,
    }),
    appTypeProps(){
      return this.appType;
    },
    timeProps(){
      return this.time;
    }
  },
  data() {
    return {
      loading: false,
      iframeUrl: '', // DashBoard嵌入iframe地址
      serviceUrlArray: [], // iframe地址数组
      refreshStyle: `top: ${this.refreshBtnTop}px; right: ${this.refreshBtnRight}px`, // 拖拽后样式
      mifassStyle: `top: ${this.refreshBtnTop}px; right: ${this.mifassBtnRight}px`, // 拖拽后样式
      refreshUrl: '',
      showNoData: false, // 显示无数据
      disabledClickEvent: false, // 禁用点击事件
      viewPanel: '', // viewPanel参数
    }
  },
  watch: {
    url: {
      handler(newVal) {
        this.loading = true;
        this.showNoData = false // 显示无数据
        if (newVal) {
          const url = newVal.split("//")[1];
          this.iframeUrl =`//${url}&theme=${this.theme}`;
          setTimeout(() => {
            this.loading = false;
          }, 2000)
        } else {
          this.iframeUrl = ''
          this.loading = false;
           // 显示无数据
          if (!this.loadingState) this.showNoData = true
        }
      },
      immediate: true,
      deep: true
    },
    serviceArray: {
      handler(newValue) {
        this.serviceUrlArray = newValue
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.iframeUrlParamsHandle(); // iframe参数处理
  },
  methods: {
    // iframe参数处理 viewPanel、form、to参数有值的情况下iframe添加viewPanel参数
    iframeUrlParamsHandle() {
      const query = this.$route.query
      const time = [query.from || query.startTime, query.to || query.endTime]
      if (query.viewPanel && time[0] && time[1]) {
        this.viewPanel = `&viewPanel=${query.viewPanel}`
      }
    },
    loadIframe (item) {
      if (this.refreshUrl) {
        setTimeout(() => {
          this.loading = false;
        }, 2000)
      } else {
        this.loading = false;
      }

      if (item) {
        item.loading = false
      }
    },
    // 手动刷新
    refreshMarket() {
      const service = this.serviceUrlArray && this.serviceUrlArray.length
      this.refreshUrl = service ? [...this.serviceUrlArray] : `${this.iframeUrl}`;
      this.loading = true;
      this.iframeUrl = '';
      this.serviceUrlArray = []
      setTimeout(() => {
        service ? this.serviceUrlArray = this.refreshUrl : this.iframeUrl = this.refreshUrl;
      }, 300)
    },
    goMifass() {
      if(this.mode =='all' && this.appTypeProps == 'businessType'){ // 如果是中国区的businessType;
        let { name, id} = this.$route.query;
        let sTime = this.timeProps[0];
        let eTime = this.timeProps[1];
        const projectName = name.replace(/-/g, '_') // 服务名称中划线转成下划线
        let jumpUrl = `${process.env.VUE_APP_GRAFANA_MANUAL_CONFIG_URL}${id}_${projectName}&from=${sTime}&to=${eTime}`;
        window.open(jumpUrl);
        return;
      }
      // mifass项目大盘链接
      if (this.showMifassBtn) {
        const query = this.$route.query;
        const host = `//${this.iframeUrl.split('/')[2]}`
        const name = query.name.replace(/-/g, '_') // 服务名称中划线转成下划线
        window.open(`${host}/d/1HhHBfg4z/mifaaszi-ding-yi-jian-kong-da-pan?orgId=1&theme=${this.theme}&var-application=${query.id}_${name}`)
      } else {
        window.open(this.iframeUrl.replaceAll('&kiosk', ''))
      }
    },
    // 拖拽效果
    mousedown(event, refKey, styleKey) {
      const box = this.$refs[refKey]
      if (!box) return false;
      this.dragFn(event, box, styleKey)
    },
    dragFn(ev, box, styleKey) {
      // 拖拽范围元素宽高
      const el = this.$refs.marketWrap.getBoundingClientRect(); // 拖拽范围元素
      const elWidth = parseInt(el.width);
      const elHeihgt = parseInt(el.height);
      const self = this
      ev.preventDefault()
      let disx = ev.clientX - box.offsetLeft;
      let disy = ev.clientY - box.offsetTop;
      //此处不是box.onmousemove，是document.onmousemove
      document.onmousemove = function(event) {
        self.disabledClickEvent = true; // 禁用点击事件
        let left = event.clientX - disx;
        let top = event.clientY - disy
        if (left < 0) {
          left = 0
        } else if (left > elWidth - box.clientWidth) {
          left = elWidth - box.clientWidth
        }
        if (top < 0) {
          top = 0
        } else if (top > elHeihgt - self.refreshBtnY) {
          top = elHeihgt - self.refreshBtnY
        }
        self[styleKey] = `top: ${parseInt(top)}px; left: ${parseInt(left)}px; right: initial`
      }
      document.onmouseup = function() {
        self.disabledClickEvent = false; // 禁用点击事件
        //这俩都要置为null
        document.onmousemove = null;
        document.onmouseup = null;
      }
    },
  }
}
</script>
<style lang="less" scoped>
.market-wrap {
  height: 100%;
  position: relative;
}
.iframe {
  width: 100%;
  height: calc(100vh - 142px);
  max-height: 100%;
  vertical-align: top;
  background: #f7f8fa;
  overflow: hidden;

  iframe {
    width: 100%;
  }
  .iframe-content, .service-array {
    position: relative;
    left: -16px;
    right: 0;
    top: -10px;
    width: calc(100% + 16px);
    height: 100%;
  }
  &.filter {
    .iframe-content, .service-array {
      height: calc(100% - 32px);
    }
  }
  .service-array {
    top: 0;
    overflow: auto;
    h3 {
      padding: 0 10px 0 16px;
    }
    .service-group:first-child {
      h3 {
        padding-top: 24px;
      }
    }
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
    padding-bottom: 10px;
    background: #f4f5f5;
    position: relative;
    z-index: 1;
  }
}
.nokiosk .iframe .iframe-content {
  left: -72px;
  right: 0;
  top: -54px;
  width: calc(100% + 72px);
  height: calc(100% + 54px);
}
.btn-title {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  border: 1px solid #DCDFE6;
  border-right: 0;
  color: #606266;
  text-align: center;
  font-size: 12px;
  padding: 9px 15px;
  background: #fff;
  vertical-align: middle;
}
.refresh {
  display: inline-block;
  position: absolute;
  top: 56px;
  right: 16px;
  z-index: 999;
  transition: all 500ms;
  button {
    border-radius: 3px;
    cursor: move;
    &:active {
      cursor: pointer;
    }
  }
}
.iframe-mask-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  opacity: 0;
}
</style>

<style lang="less">
.market-mian {
  height: 100%;
  .iframe {
    height: 100%;
    .iframe-content {
      width: 100%;
      left: 0;
    }
  }
}
.hidden-left-nav {
  position: relative;
  overflow: hidden;
  .iframe {
    width: calc(100% + 52px);
    .iframe-content {
      left: -52px;
      margin-top: 5px;
    }
  }
  &:after {
    position: absolute;
    top: 51px;
    left: 0;
    width: 16px;
    height: 100%;
    background: #f4f5f5;
    content: '';
  }
}
</style>
