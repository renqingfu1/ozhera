<template>
  <div class="chart-detail">
    <v-chart :option="option" ref="myChart" :autoresize="true"/>
  </div>
</template>
<script>
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { use } from 'echarts';
import { returnChartOptions } from '../../common';

const myoptions = returnChartOptions();

use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
]);

export default {
  components: {
    VChart,
  },
  // 主题选择，可选dark主题
  provide: {
    [THEME_KEY]: '',
  },
  props: {
    chartType: {
      required: true,
    },
    chartData: {
      type: Array,
    },
  },
  // 数据配置
  data() {
    return {
      option: {
        // 标题配置
        title: {
          show: false,
        },
        // 提示框配置
        tooltip: {
          trigger: 'axis',
        },
        // x轴配置
        dataset: {
          // 提供一份数据。
          dimensions: ['field', 'count'],
          source: [],
        },
        xAxis: {
          type: 'category',
        },
        yAxis: {
          type: 'value',
        },
        series: [],
        grid: {
          x: 100, // 左侧距离
          y: 20, // 顶部距离
          x2: 40, // 右侧距离
          y2: 80, // 底部距离
        },
      },
    };
  },
  methods: {
    isPie(chartType) {
      let switchPie = false;
      if (`${chartType}` === '1' || `${chartType}` === '8' || `${chartType}` === '9') {
        switchPie = true;
      }
      return switchPie;
    },
    updataType(chartType) {
      const curType = myoptions.filter((item) => item.typeCode === chartType);
      if (curType.length <= 0) {
        console.log('数据不对！');
        return;
      }
      const curObj = curType[0];
      this.option.series = [];
      this.option.series.push(curObj.otherData);
      if (chartType === '4') { // 水平条形图
        this.option.xAxis.type = 'value';
        this.option.yAxis.type = 'category';
      } else {
        this.option.xAxis.type = 'category';
        this.option.yAxis.type = 'value';
      }
      this.option.xAxis.show = !this.isPie(chartType);
      this.option.yAxis.show = !this.isPie(chartType);
    },
  },
  watch: {
    chartType(newV, oldV) {
      if (newV !== oldV) {
        this.updataType(newV);
      }
    },
    chartData: {
      immediate: true,
      handler(newV, oldV) {
        console.log('newV', newV);
        if (newV !== oldV) {
          this.updataType(this.chartType);
          this.option.dataset.source = newV;
        }
      },
    },
  },
};
</script>
<style scoped lang="scss" >
.title{
  padding: 10px;
}
.chart-detail{
  height: calc(100% - 20px);
  overflow: hidden;
}
</style>
