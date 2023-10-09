<template>
  <div>
    <div class="section-title" style="margin-top: 15px">部门信息</div>
    <div class="box">
      <div v-for="item in deptInfo" :key="item.description">
        <div class="title" v-loading="item.title === '...'">
          {{ item.title }}
        </div>
        <div class="description">{{ item.description }}</div>
      </div>
    </div>
    <DepartmentGraphContainer
      :curDept="curDept"
      :availabilityMetricOptions="availabilityMetricOptions"
      :alertMetricOptions="alertMetricOptions"
      :pointClicked="pointClicked"
    />
    <AppListContainer
      ref="listContainer"
      :curDept="curDept"
      :availabilityMetricOptions="availabilityMetricOptions"
      :alertMetricOptions="alertMetricOptions"
      :nameClicked="nameClicked"
    />
  </div>
</template>

<script>
import DepartmentGraphContainer from './DepartmentGraphContainer.vue'
import AppListContainer from './AppListContainer.vue'
import { getTimeSeconds } from '@/utils/index'
import server from '@/api/service/aggregation'

export default {
  name: 'aggregation',
  components: {
    DepartmentGraphContainer,
    AppListContainer,
  },
  props: {
    curDept: {},
    appData: {},
    availabilityMetricOptions: {},
    alertMetricOptions: {},
    nameClicked: {},
  },
  data() {
    return {
      deptInfo: [
        { title: '小米', description: '部门名称' },
        { title: '...', description: '应用个数' },
        { title: '...', description: '应用可用率' },
        { title: '...', description: '报警数' },
      ],
    }
  },
  watch: {
    curDept: {
      handler() {
        this.deptInfo[0].title = this.curDept.cname
        this.deptInfo[1].title = '...'
        this.deptInfo[2].title = '...'
        this.deptInfo[3].title = '...'
        const start = getTimeSeconds(
          new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        )
        const end = getTimeSeconds(new Date())
        server
          .getDepartmentGraph({
            departmentId: this.curDept.id,
            metricType: '可用性指标',
            metric: 'server_availability',
            start,
            end,
            groupByChildren: false,
          })
          .then(data => {
            this.deptInfo[2].title = `${
              data?.metric_data[0].values[0].value || '-'
            }%`
          })
        server
          .getDepartmentGraph({
            departmentId: this.curDept.id,
            metricType: '报警指标',
            metric: 'alert_total',
            start,
            end,
            groupByChildren: false,
          })
          .then(data => {
            this.deptInfo[3].title = `${
              data?.metric_data[0].values[0].value || '0'
            }`
          })
      },
      immediate: true,
    },
    appData(data) {
      this.deptInfo[1].title = data.total
    },
  },
  methods: {
    pointClicked(metricType, date) {
      const id = '应用' + metricType.replace('指标', '详情')
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
    }
    .description {
      font-size: 13px;
      color: #909399;
    }
  }
}
</style>
