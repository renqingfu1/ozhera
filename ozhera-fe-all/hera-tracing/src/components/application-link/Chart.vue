<!--
 * @Description: 
 * @Date: 2021-11-11 14:29:42
 * @LastEditTime: 2023-09-13 18:09:14
-->
<template>
  <div class="chart">
    <!-- 头部 -->
    <div class="chart-head">
      <div class="chart-title">
        {{ service }} {{ $t("timeBubble") }}
        <span class="chart-title-tip">({{ $t("explanation") }})</span>
      </div>
      <!-- 显示条数 -->
      <div class="limit-content">
        <el-select
          v-model="limitVal"
          :placeholder="$t('pleaseSelect')"
          @change="handleNumChange"
        >
          <el-option
            v-for="item in limitOptions"
            :key="item.value"
            :label="$t('displayNum', { num: item.value })"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <!-- 图表 -->
    <div class="chart-content">
      <div id="chartContent"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import moment from "moment";
import { formatDuration } from "../../utils/time";
export default {
  name: "Chart",
  props: {
    service: {},
    limit: {},
    getTraces: {},
    tableData: {},
    startTime: {},
    endTime: {},
  },
  data() {
    return {
      limitVal: this.$props.limit, // 显示条数值
      limitOptions: [
        { value: "20" },
        { value: "50" },
        { value: "100" },
        { value: "200" },
        { value: "500" },
        { value: "1000" },
      ],
      chartData: this.$props.tableData,
    };
  },
  watch: {
    limit(newValue) {
      this.limitVal = newValue;
    },
    tableData(newValue) {
      console.log("=====");
      this.chartData = newValue;
      this.initChart();
    },
  },
  mounted() {
    this.initChart();
    var that = this;
    this.$emitter.on("isCollapse", function () {
      that.initChart();
    });
  },
  unmounted() {
    this.$emitter.off("isCollapse");
  },
  methods: {
    //显示条数change
    handleNumChange: function (val) {
      // 向applicationLink组件传值
      Promise.resolve(
        this.$emitter.emit("applicationLink", {
          limit: val,
        })
      ).then(() => {
        // 更新数据
        this.getTraces();
      });
    },
    //初始化图表
    initChart: function () {
      const that = this;
      if (this.chartData) {
        const option = {
          grid: {
            left: "5%",
            right: "5%",
          },
          xAxis: {
            type: "value",
            name: "Time",
            scale: true,
            axisLabel: {
              formatter: function (value) {
                const mDate = moment(value / 1000);
                const timeStr = mDate.format("h:mm:ss a");
                return timeStr.slice(0, -3) + " " + timeStr.slice(-2);
              },
            },
            splitLine: {
              show: false,
            },
          },
          yAxis: {
            type: "value",
            name: "Duration",
            scale: true,
            axisLabel: {
              formatter: function (value) {
                return formatDuration(value);
              },
            },
            splitLine: {
              show: false,
            },
          },
          series: [
            {
              data: this.getChartData(),
              type: "scatter", // 散点图
            },
          ],
          tooltip: {
            formatter: function (params, ticket, callback) {
              callback(ticket, params.data.tooltipValue);
              return params.data.tooltipValue;
            },
          },
        };
        var chartDom = document.getElementById("chartContent");
        const startTime = this.$props.startTime;
        const endTime = this.$props.endTime;
        const timer = setTimeout(() => {
          echarts.dispose(chartDom);
          var myChart = echarts.init(chartDom);
          option && myChart.setOption(option);
          // 处理点击事件并且跳转到相应的页面
          myChart.on("click", function (params) {
            that.$router.push({
              name: "TraceIdChild",
              params: {
                traceid: params.data.traceIDValue,
                traceidData: JSON.stringify(params.data.traceidData),
              },
              query: {
                area: params.data.traceidData.area,
                source: params.data.traceidData.source,
                startTime,
                endTime,
              },
            });
          });
          clearTimeout(timer);
        }, 300);
      }
    },

    getChartData: function () {
      var data = [];
      // 取最大
      let maxTime = 0;
      this.chartData.forEach((item) => {
        maxTime = Math.max(maxTime, item.durationSort);
      });
      //取最小
      let minTime = maxTime;
      this.chartData.forEach((item) => {
        minTime = Math.min(minTime, item.durationSort);
      });

      this.chartData.forEach((item) => {
        let radio = (item.durationSort - minTime) / (maxTime - minTime);
        if (!radio || radio == "NAN") {
          radio = 0;
        }
        let symbolSize = Math.min(50, Math.max(radio * 50, 10));
        data.push({
          value: [item.startTimeSort, item.durationSort], //值
          symbolSize, //大小，取一个最大耗时
          itemStyle: {
            color: item.status === "error" ? "#F5222D" : "#96C9CE",
          },
          tooltipValue: item.tooltipValue,
          traceIDValue: item.traceID,
          traceidData: item.traceidData,
        });
      });
      return data;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/theme.scss";
.chart {
  padding: 20px 20px 0px 20px;
  .chart-head {
    position: relative;
    .chart-title {
      font-size: 16px;
      font-weight: 650;
      color: $deep-black-color;
      text-align: center;
    }
    .chart-title-tip {
      font-size: 14px;
      font-weight: normal;
      color: $light-black-color;
    }
    .limit-content {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .chart-content {
    width: 100%;
    min-height: 400px;
    position: relative;
    #chartContent {
      width: 100%;
      min-height: 400px;
    }
  }
}
</style>
<style lang="scss">
.limit-content {
  .el-select {
    width: 120px;
  }
}
</style>
