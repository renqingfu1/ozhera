<template>
  <div>
    <div class="section-title" style="margin-top: 15px">
      查看应用：
      <el-select
        v-model="selectedApp"
        placeholder="请搜索或选择应用"
        style="width: 400px"
        :disabled="selectDisabled"
        filterable
        remote
        :remote-method="queryAppList"
        :loading="loading"
      >
        <el-option
          v-for="item in appList"
          :key="item.value + item.label"
          :label="item.label"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-popover
        placement="top-start"
        title=""
        width="230"
        trigger="hover"
        :content="`最多显示前${APP_PAGE_SIZE}条可选应用`"
      >
        <span slot="reference" class="tips"
          ><i class="iconfont icon-question" style="font-size: 18px"></i
        ></span>
      </el-popover>
    </div>
    <div class="section-title" style="margin-top: 15px">应用信息</div>
    <div class="box">
      <div v-for="item in appInfo" :key="item.description" style="width: 33.3%">
        <div class="title" v-loading="item.title === '...'" :title="item.title">
          {{ item.title }}
        </div>
        <div class="description">{{ item.description }}</div>
      </div>
    </div>
    <AppGraphContainer
      :curDept="curDept"
      :curApp="curApp"
      :availabilityMetricOptions="availabilityMetricOptions"
      :alertMetricOptions="alertMetricOptions"
      :pointClicked="pointClicked"
    />
    <InterfaceListContainer
      ref="listContainer"
      :curDept="curDept"
      :curApp="curApp"
      :availabilityMetricOptions="availabilityMetricOptions"
      :alertMetricOptions="alertMetricOptions"
    />
  </div>
</template>

<script>
import AppGraphContainer from "./AppGraphContainer.vue"
import InterfaceListContainer from "./InterfaceListContainer.vue"
import server from "@/api/service/aggregation"
import { getTimeSeconds } from "@/utils/index"
import debounce from "lodash/debounce"

export default {
  name: "aggregation",
  components: {
    AppGraphContainer,
    InterfaceListContainer,
  },
  props: {
    curDept: {},
    appData: {},
    availabilityMetricOptions: {},
    alertMetricOptions: {},
  },
  data() {
    return {
      APP_PAGE_SIZE: server.APP_PAGE_SIZE,
      appInfo: [
        { title: "...", description:this.$t('appName') },
        { title: "...", description: "所属部门" },
        { title: "...", description: "可用率" },
        { title: "...", description: "报警数" },
      ],
      backupList: [],
      appList: [],
      loading: false,
      selectDisabled: false,
      selectedApp: null,
      curApp: null,
    }
  },
  watch: {
    curDept: {
      handler() {
        this.selectDisabled = true
        this.appInfo[0].title = "..."
        this.appInfo[1].title = this.curDept.cname
        this.appInfo[2].title = "..."
      },
      immediate: true,
    },
    appData(data) {
      this.backupList = this.processAppList(data)
      this.selectedApp = this.appList[0]
    },
    selectedApp(item) {
      this.curApp = item ? { id: item.value, name: item.label } : null
      this.selectDisabled = false
    },
    curApp(app) {
      this.appInfo[0].title = app.name
      this.appInfo[2].title = "..."
      this.appInfo[3].title = "..."
      server
        .getAppGraph({
          appId: app.id,
          appName: app.name,
          metricType: "可用性指标",
          metric: "server_availability",
          start: getTimeSeconds(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
          end: getTimeSeconds(new Date()),
        })
        .then(data => {
          this.appInfo[2].title = `${
            data?.metric_datas[0]?.values[0].value || "0"
          }%`
        })
      server
        .getAppGraph({
          appId: app.id,
          appName: app.name,
          metricType: "报警指标",
          metric: "alert_total",
          start: getTimeSeconds(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
          end: getTimeSeconds(new Date()),
        })
        .then(data => {
          this.appInfo[3].title = `${
            data?.metric_datas[0]?.values[0].value || "0"
          }`
        })
    },
  },
  methods: {
    processAppList(data) {
      const backupList = data.list.map(item => ({
        value: item.id,
        label: item.name,
      }))
      this.appList = backupList
      return backupList
    },
    queryAppList: debounce(function (query) {
      if (query !== "") {
        this.loading = true
        server
          .getAppListByDeptId({
            departmentId: this.curDept.id,
            pageSize: server.APP_PAGE_SIZE,
            name: query,
          })
          .then(data => {
            this.processAppList(data)
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.appList = this.backupList
      }
    }, 200),
    selectApp({ appId, name }) {
      const appItem = { value: appId, label: name }
      this.appList = [appItem]
      this.queryAppList(name)
      this.selectedApp = appItem
    },
    pointClicked(metricType, date) {
      const id = '接口' + metricType.replace('指标', '详情')
      // const mainEle = document.getElementById("app")
      const target = document.getElementById(id)
      const isQiankun = !!window.__POWERED_BY_QIANKUN__
      console.log('pointClicked', id, date, target.offsetTop, isQiankun)
      this.$extraUI.scrollTo(
        isQiankun ? '#app > section > main' : document.documentElement,
        target
      )
      this.$refs.listContainer.search(id, date)
    },
  },
}
</script>

<style lang="less" scoped>
.tips {
  margin-left: 10px;
}
.section-title {
  font-size: large;
  font-weight: bold;
  margin: 30px 0 10px 0;
}
.box {
  border: solid 1px rgba(0, 0, 0, 0.1);
  display: flex;
  margin: 5px 0;
  padding: 20px;
  justify-content: space-around;

  div {
    text-align: center;
    .title {
      font-size: larger;
      font-weight: bold;
      margin-bottom: 10px;
      color: var(--ant-primary-color);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .description {
      font-size: 13px;
      color: #909399;
    }
  }
}
</style>
