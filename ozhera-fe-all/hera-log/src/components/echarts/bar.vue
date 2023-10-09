<template>
  <v-chart class="chart" :option="option" @click="clickChartFn" />
</template>

<script>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
]);

export default {
  name: 'log-echarts',
  components: {
    VChart,
  },
  props: {
    item: null,
    isLoki: {
      type: Boolean,
    },
  },
  watch: {
    item: {
      handler(newValue) {
        this.option = {};
        this.params = {};
        this.optionsHandel(newValue);
      },
      immediate: true,
      // deep: true,
    },
  },
  computed: {
    isLokiData() {
      return this.isLoki;
    },
  },
  data() {
    return {
      xAxisData: [],
      option: {},
    };
  },
  methods: {
    // 处理图表数据
    optionsHandel(data) {
      const { isLokiData } = this;
      this.xAxisData = data.timestamps;
      this.option = {
        title: null,
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter(datas) {
            let res = `${datas[0].seriesName}<br/>`;
            // eslint-disable-next-line no-plusplus
            for (let i = 0, { length } = datas; i < length; i++) {
              const val = (isLokiData && datas[i].value >= 5000) ? '5000+' : datas[i].value;
              res += `${datas[i].name}：${val}<br/>`;
            }
            return res;
          },
        },
        grid: {
          left: '10px',
          right: '10px',
          top: '10px',
          bottom: '10px',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: this.xAxisData,
        },
        yAxis: {
          axisLabel: {
            formatter(val) {
              if (val >= 5000 && isLokiData) {
                return '5000+';
              }
              return val;
            },
          },
        },
        series: {
          name: data.name,
          type: 'bar',
          data: data.counts,
          itemStyle: {
            normal: {
              color: '#54b399',
            },
          },
        },
      };
    },
    clickChartFn(params) {
      let time = [
        this.timestampChange(params.name),
        this.timestampChange(this.xAxisData[params.dataIndex + 1]),
      ];
      if (params.dataIndex + 1 === this.xAxisData.length) {
        time = [
          this.timestampChange(this.xAxisData[params.dataIndex - 1]),
          this.timestampChange(params.name),
        ];
      }
      // 查询时间>=十秒才查询
      if ((time[1] - time[0]) >= 10000) {
        this.$emit('change-data', time);
      }
    },
    dataHandle(data) {
      if (!data || !data.length) {
        return false;
      }
      const seriesData = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < data.length; i++) {
        seriesData.push({
          name: data[i].name,
          type: 'bar',
          data: Object.values(data[i].timestamps),
        });
      }
      this.params = {
        seriesData,
        xAxisData: Object.keys(data[0].timestamps),
      };
      return false;
    },
    // 转换成时间戳
    timestampChange(value) {
      return new Date(value).getTime();
    },
  },
};
</script>

<style scoped>
.chart {
  height: 150px;
}
</style>
