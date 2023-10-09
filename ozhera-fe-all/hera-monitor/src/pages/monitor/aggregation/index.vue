<template>
  <el-container class="container">
    <el-aside style="width: 250px; background: white">
      <DepartmentTree @node-change="onNodeChange" />
    </el-aside>
    <el-main class="content">
      <div id="查看应用"></div>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="部门维度" name="dept">
          <DepartmentPane
            :curDept="curDept"
            :appData="appData"
            :availabilityMetricOptions="availabilityMetricOptions"
            :alertMetricOptions="alertMetricOptions"
            :nameClicked="nameClicked"
          />
        </el-tab-pane>
        <el-tab-pane label="应用维度" name="app">
          <AppPane
            ref="appPane"
            :curDept="curDept"
            :appData="appData"
            :availabilityMetricOptions="availabilityMetricOptions"
            :alertMetricOptions="alertMetricOptions"
          />
        </el-tab-pane>
      </el-tabs>
      <el-backtop></el-backtop>
    </el-main>
  </el-container>
</template>

<script>
import DepartmentTree from "@/components/DepartmentTree.vue"
import DepartmentPane from "./components/department/DepartmentPane.vue"
import AppPane from "./components/app/AppPane.vue"
import server from "@/api/service/aggregation"

export default {
  name: "aggregation",
  components: {
    DepartmentTree,
    DepartmentPane,
    AppPane,
  },
  data() {
    return {
      activeTab: "dept",
      curDept: { id: "1", cname: "小米" },
      appData: null,
      availabilityMetricOptions: [],
      alertMetricOptions: [],
    }
  },
  watch: {
    curDept: {
      handler() {
        server
          .getAppListByDeptId({
            departmentId: this.curDept.id,
            pageSize: server.APP_PAGE_SIZE,
            // name: 'gis_youpin',
          })
          .then(data => {
            this.appData = data
          })
      },
      immediate: true,
    },
  },
  mounted() {
    server.getMultiSupportMetrics().then(data => {
      this.availabilityMetricOptions = data.find(
        item => item.mtype === "可用性指标"
      ).instance
      this.alertMetricOptions = data.find(
        item => item.mtype === "报警指标"
      ).instance
    })
  },
  methods: {
    onNodeChange(data) {
      console.log("onNodeChange", data.id, data.cname)
      this.curDept = data
    },
    nameClicked(row) {
      this.activeTab = 'app'
      this.$extraUI.scrollTop(window.__POWERED_BY_QIANKUN__ ? '#app > section > main' : document.documentElement)
      this.$refs.appPane.selectApp(row)
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
}
.content {
  margin: 5px;
  padding: 5px 20px 20px 20px;
  background: white;
}
.el-tab-pane[aria-hidden="true"] {
  display: block !important;
  height: 0;
  overflow-y: hidden;
  background: red;
}
.el-tab-pane {
  height: auto;
}
</style>
