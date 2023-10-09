<template>
  <div>
    <el-form
      :inline="true"
      :model="formInline"
      class="form-inline"
      size="small"
    >
      <el-form-item label="查看指标:">
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
    <div class="chart" ref="chart1"></div>
    <!-- <div class='chart' ref='chart2'></div> -->
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
import { getTimeSeconds, getAxisMin, getAxisMax } from '@/utils/index'

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
    curApp: {},
    metricType: {},
    metricOptions: {},
    defaultMetricName: {},
    pointClicked: {},
  },
  components: {},
  watch: {
    curApp() {
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
      // this.chart2.resize()
    },
    initChart() {
      this.chart1 = echarts.init(this.$refs.chart1)
      this.chart1.setOption(getOption1())
      this.chart1.on('click', params => {
        this?.pointClicked(this.metricType, params.name)
      })
      // this.chart2 = echarts.init(this.$refs.chart2)
      // this.chart2.setOption(getOption2())
    },
    getAppGraph(isSecondChart) {
      const { selectMetricName, timeRange } = this.formInline
      if (!this.curApp || !selectMetricName) {
        return Promise.resolve()
      }
      const chart = isSecondChart ? this.chart2 : this.chart1
      chart.showLoading('default', echartLoadingConfig)
      return server
        .getAppGraph({
          appId: this.curApp.id,
          appName: this.curApp.name,
          metricType: this.metricType,
          metric: selectMetricName,
          start: getTimeSeconds(timeRange[0]),
          end: getTimeSeconds(timeRange[1]),
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
      this.getAppGraph(false).then(data => {
        if (!data) {
          return
        }
        const arr = data.metric_datas[0]?.values || []
        this.chart1.setOption(
          getOption1(
            `${data.meta_datas.cname}（${data.meta_datas.unit}）`,
            arr.map(item => this.formatTime(item.timestamp)),
            arr.map(item => item.value)
          ),
          true
        )

        setTimeout(() => {
          this.chart1.resize()
        }, 100)
      })

      // this.getAppGraph(true).then(data => {
      //   if(!data) {
      //     return
      //   }
      //   const metrics = data.metric_data || []
      //   const xdata = metrics[0]?.values.map(item => this.formatTime(item.timestamp)) || []
      //   const legend = metrics.map(item => item.labels.department_name)
      //   const ydata = metrics.map(item => ({
      //     name: item.labels.department_name,
      //     data: item.values.map(item => item.value)
      //   }))
      //   this.chart2.setOption(getOption2(
      //     `子部门${data.meta_data.cname}（${data.meta_data.unit}）`,
      //     legend,
      //     xdata,
      //     ydata), true)
      // })
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
    max: getAxisMax(title),
  },
  series: [
    {
      data: ydata,
      type: 'line',
      smooth: true,
    },
  ],
})
</script>

<style lang="less" scoped>
.title {
  font-size: 17px;
  font-weight: 500;
}
.chart {
  width: 100%;
  height: 450px;
}
</style>
