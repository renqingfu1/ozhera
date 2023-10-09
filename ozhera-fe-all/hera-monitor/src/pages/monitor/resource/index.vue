<template>
  <div class="list-content" v-loading="loading">
    <GrafanaIFrame :url="iframeUrl" filter-align="right">
      <template>
        <div class="header-content">
          <el-tabs v-model="activeName" size="mini" @tab-click="handleClickTab">
            <el-tab-pane
                v-for="item in activeList"
                :key="item.value"
                :label="$t(`${item.label}`)"
                :name="item.value"
            >
            </el-tab-pane>
          </el-tabs>
          <div class="header-content-right">
            <span class="btn-title">{{ $t('selectTime') }}</span>
            <span>
              <DateTime v-model="time" :iframeUrl="iframeUrl" :timeOptions="timeOptions"
                    @changDateFn="changDateFn" />
            </span>
          </div>
        </div>
      </template>
    </GrafanaIFrame>
  </div>
</template>

<script>
import GrafanaIFrame from '@/components/market-components/index'
import DateTime from '@/components/market-components/date';
import server from '@/api/service/application.js';
import { mapMutations } from 'vuex';

export default {
  name: 'api-market',
  components: {
    GrafanaIFrame,
    DateTime
  },
  data() {
    return {
      loading: false,
      iframeUrl: '',
      timeOptions: ['30s', '1m', '5m', '15m', '30m', '1h', '2h', '6h', '12h', '1d', '2d', '3d'],
      scaleType: false, // 全屏状态
      activeName: this.$route.query.deployType || 'k8s', // tab选中值
      activeList:[
      //   {
      //   label: 'docker部署',
      //   value: 'docker',
      //   appParamName: 'var-application',
      //   url: '/d/fwCTLWJnz/mione-dubbofu-wu-da-pan?orgId=1&kiosk'
      // }, 
      {
        label:'k8sDeploy',
        value: 'k8s',
        appParamName: 'var-serverName',
        url: '/d/uXn9oUp7k/httpjie-kou-da-pan?orgId=1&kiosk&var-timeRange=$__auto_interval_timeRange&var-url=%2Fredis'
      }],
      ajaxName: 'getResourceUrl', // 请求接口方法名
    }
  },
  computed:{
    time:{
      get(){
        return this.$store.state.slowquery.timer
      },
      set(val){
        this.setTimer(val);
      }
    },
  },
  watch: {
    '$route'() {
      this.handleClickTab(); // 获取大盘地址
    },
  },
  mounted() {
    this.initTime();
    this.handleClickTab(); // 获取大盘地址
  },

  methods: {
    ...mapMutations('slowquery',['setTimer']),
    initTime(){
      let {start_time, end_time , from, to} = this.$route.query;
      if(from && to){
        this.setTimer([from,to])
      }
      if(start_time &&  end_time){
        this.setTimer([start_time,end_time])
      }
    },
    // 获取大盘地址
    getGrafanaUrl() {
      this.loading = true;
      const query = this.$route.query
      const param = {
        appId: query.id,
        appName: query.name // 查询的应用名称
      }
      server[this.ajaxName](param).then(data => {
        this.loading = false;
        const url = data.split('//')[1];
        let baseUrl =  `//${url}&kiosk&theme=light`;
        if(this.time[0] &&  this.time[1]){
          baseUrl = `${baseUrl}&from=${this.time[0]}&to=${this.time[1]}`
        }
        this.iframeUrl = baseUrl;
      }).catch(() => {
        this.loading = false;
        this.iframeUrl = ''
      })
    },
    // 选择时间日期组件回调事件
    changDateFn(url, time) {
      this.iframeUrl = url
      this.setRouteTimer(time);
    },
    setRouteTimer(){
      if(!this.time[0] || !this.time[1]) return;
      this.$router.push({
        query:{
          ...this.$route.query,
          start_time: this.time[0],
          end_time:this.time[1]
        }
      })
    },
    // tab 被选中时触发
    handleClickTab() {
      this.ajaxName = this.activeName=='k8s'?'getK8sResourceUrl':'getResourceUrl';
      this.getGrafanaUrl(); // 获取大盘地址
    },
  }
}
</script>

<style scoped>
.api-market-title >>> .el-tabs__header {
  background: #f4f5f5;
}
</style>
<style lang="less" scoped>
.header-content {
  width: 100%;
    position: relative;
    &-right {
      position: absolute;
      top: 0;
      right: 16px;
      z-index: 9;
      max-width: calc(100% - 320px);
      overflow: hidden;
      white-space: nowrap;
    }
    .el-tabs {
      position: relative;
      top: -10px;
      height: 40px;
    }
}
.header-content-right{
  display: flex;
}
</style>
