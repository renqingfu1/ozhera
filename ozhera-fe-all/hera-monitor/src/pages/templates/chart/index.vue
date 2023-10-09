<template>
  <div>
    <lone-module>echarts图表</lone-module>
    <lone-module marginTop>
      <div class='chart' id='barChart' ref='chart'></div>
    </lone-module>
  </div>
</template>

<script>
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer])
// 引入配置
import { config } from './config/bar-chart'

export default {
  data() {
    return {}
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    drawChart() {
      let newChart = echarts.init(this.$refs.chart)
      newChart.setOption(config(this))
    }
  }
}
</script>

<style lang="less" scoped>
.chart {
  width: 100%;
  height: 450px;
  margin-top: 20px;
}
</style>