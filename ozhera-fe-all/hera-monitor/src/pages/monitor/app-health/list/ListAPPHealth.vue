<template>
  <div>
    <div style="margin-bottom: 20px">
      <label style="font-size: 14px">{{$t('appName')}}：</label>
      <el-input
        :placeholder="$t('enterNameSearch')"
        prefix-icon="el-icon-search"
        v-model="form.appName"
        size="mini"
        style="width: 200px; margin-right: 10px"
        @keyup.enter.native="getList"
      ></el-input>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
      class="health-table"
    >
      <el-table-column prop="appName" :label="$t('appName')"> </el-table-column>
      <el-table-column :label="$t('appHealthPage.basicAlarm')">
        <el-table-column prop="name" :label="$t('appHealthPage.isQualified')">
          <template slot-scope="scope">
            <span
              :class="scope.row.baseAlarmNum === 0 ? 'danger' : 'health'"
              @click="openCreate(scope.row, 'baseAlarmNum')"
            >
              {{ scope.row.baseAlarmNum === 0 ? $t('appHealthPage.unacceptable') : $t('appHealthPage.acceptable')}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="basicMetricScore" :label="$t('appHealthPage.score')">
          <template slot="header">
            {{ $t('appHealthPage.score') }}
            <ScoreConfigTip v-model="basicInfo" />
          </template>
          <template slot-scope="scope">
            {{ scope.row.basicMetricScore }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column :label="$t('appHealthPage.interfaceAlarms')">
        <el-table-column prop="name" :label="$t('appHealthPage.isQualified')">
          <template slot-scope="scope">
            <span
              :class="scope.row.appAlarmNum === 0 ? 'danger' : 'health'"
              @click="openCreate(scope.row, 'appAlarmNum')"
            >
              {{ scope.row.appAlarmNum === 0 ? $t('appHealthPage.unacceptable') :$t('appHealthPage.acceptable') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="basicMetricScore" :label="$t('appHealthPage.score')">
          <template slot="header">
            {{ $t('appHealthPage.score') }}
            <ScoreConfigTip v-model="apiInfo" />
          </template>
          <template slot-scope="scope">
            {{ scope.row.interfaceMetricScore }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="comprehensiveScore" :label="$t('appHealthPage.comprehensiveScore')">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import server from "@/api/service/app-health.js"
import ScoreConfigTip from "@/pages/monitor/app-health/list/ScoreConfigTip"
export default {
  components: {
    ScoreConfigTip,
  },
  data() {
    return {
      form: {
        appName: "",
      },
      total: 100,
      tableData: [],
      loading: false,
      basicInfo: {
        width:280,
        allTips: "基础报警配置评分（满分10分）",
        detailTips: [
          {
            label: "cpu使用率",
            value: "2分",
            key: "cpuUse",
          },
          {
            label: "cpu负载",
            value: "2分",
            key: "cpuFuzai",
          },
          {
            label: "内存使用率",
            value: "2分",
            key: "inStore",
          },
          {
            label: "容器数量",
            value: "2分",
            key: "containerNum",
          },
          {
            label: "jvmThread",
            value: "1分",
            key: "jvmThread",
          },
          {
            label: "jvmGc（gc次数、gc耗时）",
            value: "1分",
            key: "jvmGc",
          },
        ],
      },
      apiInfo: {
        width:476,
        allTips: "接口报警配置评分（满分19分）",
        detailTips: [
          {
            label: "httpServer可用性（包括可用性、错误数配置任一，或同时两项）",
            value: "2分",
          },
          {
            label: "httpServer qps",
            value: "1分",
          },
          {
            label: "httpServer 耗时",
            value: "1分",
          },
          {
            label: "httpCleint可用性（包括可用性、错误数配置任一，或同时两项）",
            value: "1分",
          },
          {
            label: "httpClient qps",
            value: "1分",
          },
          {
            label: "httpClient 耗时",
            value: "1分",
          },
          {
            label: "dubboProvider可用性（包括可用性、错误数配置任一，或同时两项）",
            value: "2分",
          },
          {
            label: "dubboProvider Qps",
            value: "1分",
          },{
            label: "dubboProvider 耗时",
            value: "1分",
          },{
            label: "dubboProvider 慢查询",
            value: "1分",
          },{
            label: "dubboConsumer可用性（包括可用性、错误数配置任一，或同时两项）",
            value: "1分",
          },{
            label: "dubboConsumer Qps",
            value: "1分",
          },{
            label: "dubboConsumer耗时",
            value: "1分",
          },{
            label: "dubboConsumer慢查询",
            value: "1分",
          },{
            label: "db（mysql） 可用性（包括可用性、错误数配置任一，或同时两项）",
            value: "2分",
          },{
            label: "db（mysql） 慢查询",
            value: "1分",
          },
        ],
      },
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      server
        .getAppHealthList(this.form)
        .then(res => {
          this.tableData = res
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    openCreate(item, type) {
      if (item[type] != 0) return
      let strategyType = ""
      if (type === "baseAlarmNum") {
        strategyType = "0"
      } else if (type === "appAlarmNum") {
        strategyType = "1"
      }
      this.$router.push({
        name: "warnStrategyCreate",
        params: {
          appDetail: {
            projectId: item.appId,
            projectName: item.appName,
            // iamTreeId: item.iamTreeId,
          },
          strategyType,
        },
      })
    },
  },
}
</script>
<style scoped >
.danger {
  color: #f56c6c;
  cursor: pointer;
}
.health {
  color: #67c23a;
}
.health-table >>> th,
.health-table >>> th.is-leaf {
  border-bottom: solid 1px #eee;
  border-right: solid 1px #eee;
}
.health-table >>> .el-table__header {
  border: none;
}
</style>
