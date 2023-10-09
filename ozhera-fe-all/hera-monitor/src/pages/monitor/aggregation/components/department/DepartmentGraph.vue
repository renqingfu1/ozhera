<template>
  <div>
    <el-form
      :inline="true"
      :model="formInline"
      class="form-inline form"
      size="small"
    >
      <el-form-item label="指标名:">
        <el-select v-model="formInline.selectMetricName" :placeholder=" $t('pleaseSel')">
          <el-option
            v-for="item in metricOptions"
            :key="item.name"
            :label="item.cname"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围:">
        <el-date-picker
          v-model="formInline.timeRange"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSearch"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <el-tabs>
      <el-tab-pane label="部门">
        <div class="chart" ref="chart1"></div>
      </el-tab-pane>
      <el-tab-pane label="子部门">
        <div class="chart" ref="chart2"></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { LineChart } from 'echarts/charts'
// import { UniversalTransition, LabelLayout } from 'echarts/features'; //MILINE报错not found
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer,
])
import server from '@/api/service/aggregation'
import { getTimeSeconds, getAxisMin } from '@/utils/index'

const echartLoadingConfig = {
  text: '',
  spinnerRadius: 18,
  lineWidth: 2,
  color: '#409EFF',
  maskColor: 'rgba(255, 255, 255, 0.9)',
}

export default {
  props: {
    curDept: {},
    metricType: {},
    metricOptions: {},
    defaultMetricName: {},
    pointClicked: {},
  },
  components: {},
  watch: {
    curDept() {
      this.onSearch()
    },
    metricOptions() {
      this.formInline.selectMetricName = this.defaultMetricName
      this.onSearch()
    },
  },
  data() {
    const d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return {
      formInline: {
        selectMetricName: '',
        timeRange: [d, new Date()],
      },
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.resizeListener)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeListener)
  },
  methods: {
    resizeListener() {
      this.chart1.resize()
      this.chart2.resize()
    },
    initChart() {
      this.chart1 = echarts.init(this.$refs.chart1)
      this.chart1.setOption(getOption1())
      this.chart1.on('click', params => {
        this?.pointClicked(this.metricType, params.name)
      })
      this.chart2 = echarts.init(this.$refs.chart2)
      this.chart2.setOption(getOption2())
    },
    getDepartmentGraph(groupByChildren) {
      const chart = groupByChildren ? this.chart2 : this.chart1
      chart.showLoading('default', echartLoadingConfig)
      const { selectMetricName, timeRange } = this.formInline
      return server
        .getDepartmentGraph({
          departmentId: this.curDept.id,
          metricType: this.metricType,
          metric: selectMetricName,
          start: getTimeSeconds(timeRange[0]),
          end: getTimeSeconds(timeRange[1]),
          groupByChildren,
        })
        .then(res => {
          chart.hideLoading()
          return res
        })
        .catch(() => {
          chart.hideLoading()
        })
    },
    formatTime(timestamp) {
      return this.$dateFormat(new Date(timestamp * 1000), 'yyyy-mm-dd')
    },
    onSearch() {
      this.getDepartmentGraph(false).then(data => {
        if (!data) {
          return
        }
        const arr = data.metric_data[0].values
        this.chart1.setOption(
          getOption1(
            `${data.meta_data.cname}（${data.meta_data.unit}）`,
            arr.map(item => this.formatTime(item.timestamp)),
            arr.map(item => item.value)
          ),
          true
        )

        setTimeout(() => {
          this.chart1.resize()
        }, 100)
      })

      this.getDepartmentGraph(true).then(data => {
        if (!data) {
          return
        }
        const metrics = data.metric_data || []
        const xdata =
          metrics[0]?.values.map(item => this.formatTime(item.timestamp)) || []
        const legend = metrics.map(item => item.labels.department_name)
        const ydata = metrics.map(item => ({
          name: item.labels.department_name,
          data: item.values.map(item => item.value),
        }))
        this.chart2.setOption(
          getOption2(
            `子部门${data.meta_data.cname}（${data.meta_data.unit}）`,
            legend,
            xdata,
            ydata
          ),
          true
        )
      })
    },
  },
}

const getOption1 = (title = '总体可用率（%）', xdata = [], ydata = []) => ({
  title: {
    text: title,
    textStyle: { fontSize: 15 },
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: xdata,
  },
  yAxis: {
    type: 'value',
    min: getAxisMin(title),
  },
  series: [
    {
      data: ydata,
      type: 'line',
      smooth: true,
    },
  ],
})

const getOption2 = (
  title = '子部门总体可用率（%）',
  legend = [],
  xdata = ['', '', ''],
  ydata = []
) => ({
  title: {
    text: title,
    textStyle: { fontSize: 15 },
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: legend,
    left: 200,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: xdata,
  },
  yAxis: {
    type: 'value',
    min: getAxisMin(title),
  },
  series: ydata.map(item => ({
    name: item.name,
    data: item.data,
    type: 'line',
    smooth: true,
  })),
})
</script>

<style lang="less" scoped>
.form {
  margin-top: 20px;
  margin-bottom: -20px;
}
.title {
  font-size: 17px;
  font-weight: 500;
}
.chart {
  width: 100%;
  height: 450px;
}
.el-tab-pane[aria-hidden='true'] {
  display: block !important;
  height: 0;
  overflow-y: hidden;
  background: red;
}
.el-tab-pane {
  height: auto;
}
</style>
