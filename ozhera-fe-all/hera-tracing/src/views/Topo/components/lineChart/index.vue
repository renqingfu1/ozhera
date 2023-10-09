<template>
  <div class="line-chart">
    <div class="title">{{ title }}</div>
    <div class="title" v-if="showYaxisTitle">{{ getContent() }} {{ unit }}</div>
    <div ref="chart" class="chart-content"></div>
  </div>
</template>

<script setup>
import { ref, defineProps, toRefs, onMounted, onBeforeUnmount } from "vue";
import * as Echarts from "echarts";

const props = defineProps({
  unit: String,
  data: Object,
  title: String,
  showYaxisTitle: {
    type: Boolean,
    default: true,
  },
  isPercentChart: Boolean,
  intervalTime: Array,
});
const chart = ref(null);
const { data, title, isPercentChart, intervalTime, showYaxisTitle, unit } =
  toRefs(props);
let chartInstance = null;

const getContent = () => {
  if (isPercentChart.value) return 0;
  if (data.value.length === 0) return 0;
  const noZero = data.value.filter((i) => i);

  const sum = noZero.length
    ? noZero.reduce((preValue, curValue) => preValue + curValue) / noZero.length
    : 0;

  return sum.toFixed(2);
};

const getOption = () => {
  const defaultOptions = {
    tooltip: {
      trigger: "axis",
      // backgroundColor: '#333844',
      textStyle: {
        fontSize: 13,
      },
    },
    title: {
      show: data.value.length === 0,
      textStyle: {
        fontSize: 12,
      },
      text: "暂无数据",
      left: "center",
      top: "center",
    },
    xAxis: {
      type: "category",
      axisTick: {
        lineStyle: { color: "#c1c5ca41" },
        alignWithLabel: true,
      },
      splitLine: { show: false },
      axisLine: { lineStyle: { color: "rgba(0,0,0,0)" } },
      axisLabel: { color: "#9da5b2", fontSize: "11" },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      // splitLine: { lineStyle: { color: "#c1c5ca41", type: "dashed" } },
      // axisLabel: { color: "#9da5b2", fontSize: "11" },
    },
  };
  let resultOptions = {};
  if (isPercentChart.value) {
    const temp = [];
    const keys = Object.keys(data.value || {}).filter(
      (i) => Array.isArray(data.value[i]) && data.value[i].length
    );
    keys.map((k) => {
      const serie = {
        data: data.value[k].map((item, i) => [intervalTime.value[i], item]),
        name: k,
        type: "line",
        symbol: "none",
        barMaxWidth: 10,
        lineStyle: {
          width: 1.5,
          type: "solid",
        },
      };
      temp.push(serie);
    });
    resultOptions = Object.assign({}, defaultOptions, {
      series: temp,
      color: [
        "#30A4EB",
        "#45BFC0",
        "#FFCC55",
        "#FF6A84",
        "#a0a7e6",
        "#6be6c1",
        "#626c91",
        "#96dee8",
        "#3f96e3",
      ],
      legend: {
        show: false,
      },
      grid: {
        top: 5,
        left: 0,
        right: 18,
        bottom: 5,
        containLabel: true,
      },
    });
  } else {
    resultOptions = Object.assign({}, defaultOptions, {
      tooltip: {
        trigger: "axis",
        textStyle: {
          fontSize: 13,
        },
      },
      grid: {
        top: 4,
        left: 0,
        right: 0,
        bottom: 7,
        containLabel: true,
      },
      series: [
        {
          data: data.value.map((i, index) => [intervalTime.value[index], i]),
          type: "line",
          symbol: "none",
          barMaxWidth: 5,
          lineStyle: {
            width: 1,
          },
        },
      ],
    });
  }
  return resultOptions;
};

const resize = () => {
  chartInstance?.resize();
};

const renderChart = () => {
  const option = getOption();
  chartInstance = Echarts.init(chart.value);
  chartInstance.setOption(option);
};

onMounted(() => {
  renderChart();
  window.addEventListener("resize", resize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);
});
</script>

<style lang="scss" scoped>
.line-chart {
  margin-bottom: 25px;
  .title {
    margin-bottom: 10px;
  }
  .chart-content {
    height: 100px;
  }
}
</style>
