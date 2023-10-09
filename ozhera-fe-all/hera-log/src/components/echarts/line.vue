<template>
  <v-chart class="chart" :option="option" />
</template>

<script>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
]);

export default {
  name: 'echartsLine',
  components: {
    VChart,
  },
  props: {
    item: null,
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
  data() {
    return {
      option: {},
      params: {
        legendData: [],
        xAxisData: [],
        seriesData: [],
      },
    };
  },
  methods: {
    // 处理图表数据
    optionsHandel(data) {
      this.dataHandle(data);
      this.option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          type: 'scroll',
          data: this.params && this.params.legendData,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.params && this.params.xAxisData,
        },
        yAxis: {
          type: 'value',
        },
        series: this.params && this.params.seriesData,
      };
    },
    dataHandle(data) {
      if (!data || !data.length) {
        return false;
      }
      const self = this;
      const legendData = [];
      const seriesData = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < data.length; i++) {
        legendData.push(data[i].name);
        seriesData.push({
          name: data[i].name,
          type: 'line',
          data: Object.values(data[i].timestamps),
        });
      }
      this.params = {
        legendData,
        seriesData,
        xAxisData: Object.keys(data[0].timestamps).map((key) => self.$dateFormat(self.timestamps(key), 'yyyy-mm-dd HH:MM')),
      };
      return false;
    },
    timestamps(time) {
      if (`${time}`.length === 10) {
        return time * 1000;
      }
      return Number(time);
    },
  },
};
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
