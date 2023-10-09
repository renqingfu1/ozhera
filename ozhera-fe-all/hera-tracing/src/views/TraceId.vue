<template>
  <div class="trace-id main-layout">
    <!-- 头部 -->
    <div class="head">
      <!-- 头部左侧-应用名 -->
      <FilterTraceId
        :getTracesData="getTracesData"
        :history="history"
        :traceId="traceId"
      ></FilterTraceId>
    </div>
    <!-- main -->
    <div class="main">
      <div className="main-container">
        <MainHead></MainHead>
        <TableChart
          :loading="loading"
          :processes="processes"
          :tableData="tableData"
          :tableInfo="tableInfo"
        ></TableChart>
      </div>
    </div>
  </div>
</template>

<script>
import FilterTraceId from "../components/trace-id/FilterTraceId.vue";
import MainHead from "../components/trace-id/MainHead.vue";
import TableChart from "../components/trace-id/TableChart.vue";
import { getTraces } from "../api/trace-id";
import { formatDuration } from "../utils/time";
import moment from "moment";
import { ElMessage } from "element-plus";

export default {
  name: "TraceId",
  components: {
    FilterTraceId,
    MainHead,
    TableChart,
  },
  data() {
    const { traceid } = this.$route.params;
    return {
      traceId: traceid ? traceid : "", // TraceId的值
      source: "", //来源
      startTime: "", //开始时间,默认0点
      endTime: "", //结束时间，默认现在的时间
      history: false, //历史
      loading: false, //是否在加载数据
      processes: {}, //应用名称对应关系
      tableData: [], //传递下去表格数据
      tableInfo: {}, //信息
      requestId: null, //帧
      rightTableData: [], //最终正确的数据
      maxDepth: 0, //链路深度
      traceStartTime: 0, //最小的时间
      traceEndTime: 0, //最大的时间
    };
  },
  mounted() {
    //监听数据
    this.$emitter.on("traceId", (data) => {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    });
    //解析url数据
    this.initUrlData();
    // 初始化数据
    this.init();
  },
  unmounted() {
    this.$emitter.off("traceId");
  },
  methods: {
    initUrlData() {
      //从url解析数据
      const { source, history, startTime, endTime } = this.$route.query;
      if (source !== undefined) this.source = source;
      if (history !== undefined)
        this.history = history === "true" ? true : false;
      if (startTime !== undefined) this.startTime = startTime;
      if (endTime !== undefined) this.endTime = endTime;
    },
    // 初始化
    init() {
      //优化性能
      const { traceidData } = this.$route.params;
      if (traceidData) {
        const data = JSON.parse(traceidData);
        if (data) {
          this.getTableData(data);
        } else {
          this.getTracesData();
        }
      } else {
        this.getTracesData();
      }
    },
    //请求获取初始数据
    getTracesData: function () {
      //重置数据
      this.processes = {};
      this.tableData = [];
      this.tableInfo = {};
      this.rightTableData = [];
      this.maxDepth = 0;
      this.traceStartTime = 0;
      this.traceEndTime = 0;
      const todayStartTime = new Date().setTime(
        new Date(new Date(new Date().toLocaleDateString()).getTime())
      );
      if (this.traceId) {
        this.loading = true;
        getTraces(
          {
            traceId: this.traceId,
          },
          {
            traceId: this.traceId,
            source: this.source,
            history: this.history,
            startTime: this.startTime || todayStartTime,
            endTime: this.endTime || new Date().getTime(),
            area: this.$route.query.area,
          }
        )
          .then((res) => {
            const data = res?.data[0];
            if (data) {
              this.getTableData(data);
            }
          })
          .catch(() => {})
          .finally(() => {
            this.loading = false;
          });
      }
    },
    //处理数据
    getTableData(data) {
      const { spans, processes, traceID } = data;
      if (traceID === "unknown") {
        ElMessage.error(this.$t("notExists"));
      } else {
        this.processes = processes; //应用名匹配
        //得到正确的数据
        this.getRightTableData(spans);
        // //渲染
        this.batchRendering(this.rightTableData);
        this.tableInfo = {
          startTime: moment(this.traceStartTime / 1000).format(
            "YYYY-MM-DD HH:mm:ss"
          ), // 起始点
          startTimeMS: this.traceStartTime,
          duration: formatDuration(this.traceEndTime - this.traceStartTime), // 持续时间
          durationMs: this.traceEndTime - this.traceStartTime,
          depth: this.maxDepth,
          total: this.rightTableData.length,
          // linePos
          // hasLine
        };
      }
    },
    //转换成正确的数据
    getRightTableData(data) {
      //找出所有的跟节点,如果找不到自己的父亲就拿出来
      //filter()方法用于过滤一些不‘合格’的元素，如果回调函数返回true就留下，返回值为一个新数组
      //some()方法类似查找，数组里面只要有某一个元素符合条件，就返回true
      //如有这个元素有父亲就不是跟节点，没有父亲就是跟节点,v是孩子，v2是父亲
      this.traceStartTime = Number.MAX_SAFE_INTEGER;
      const root = data.filter(
        (v) => !data.some((v2) => v2.spanID === v?.references[0]?.spanID)
      );
      for (let i = 0; i < root.length; i++) {
        this.sortData(-1, data, root[i], this.rightTableData.length, 1);
      }
    },
    //数据排序
    sortData(
      parentIndex, //当前元素父亲所在的位置
      ary, //还剩余的需要比较的数据
      item, //当前的元素
      index, //当前元素应该在的位置
      depth //当前元素的深度
    ) {
      const that = this;
      // 时间计算
      const { startTime, duration } = item;
      if (startTime < that.traceStartTime) {
        that.traceStartTime = startTime;
      }
      if (startTime + duration > that.traceEndTime) {
        that.traceEndTime = startTime + duration;
      }
      //深度计算
      that.maxDepth = Math.max(that.maxDepth, depth);
      //区分出孩子和其他的
      var child = [];
      var other = [];
      for (var i = 0; i < ary.length; i++) {
        var content = ary[i];
        if (
          item.spanID !== content.spanID && //不是自己
          !child.filter((v) => v.spanID === content.spanID).length //元素是不是已经存在孩子数组里了，筛选出重复数据
        ) {
          const isChild = item.spanID === content?.references[0]?.spanID;
          if (isChild) {
            child.push(content);
          } else {
            other.push(content);
          }
        }
      }
      //更新正确的数据
      that.rightTableData[index] = {
        ...item,
        arrow: true, //箭头默认为true，向下
        depth, //当前元素的深度
        hasChildren: child.length, //当前元素是否有孩子
        parentIndex, //当前元素父亲所在的位置
      };
      //如果有孩子，不管有没有剩下的都push
      for (let i = 0; i < child.length; i++) {
        that.sortData(
          index,
          other,
          child[i],
          that.rightTableData.length,
          depth + 1
        );
      }
    },
    batchRendering(data) {
      this.requestId && window.cancelAnimationFrame(this.requestId);
      this.tableData = []; //表格数据
      // 总共需要插入的条数
      const total = data?.length || 0;
      //每次都要插入的条数
      const once = 30;
      //插入的数据需要的次数
      const loopCount = Math.ceil(total / once);
      //渲染的系数
      let countRender = 0;
      //添加数据的方法
      this.loop(countRender, loopCount, data, once);
    },
    loop(countRender, loopCount, data, once) {
      let that = this;
      this.requestId = window.requestAnimationFrame(() => {
        if (countRender < loopCount) {
          const currentData = data.slice(
            countRender * once,
            (countRender + 1) * once
          );
          that.tableData = that.tableData.concat(currentData);
          countRender++;
          that.loop(countRender, loopCount, data, once);
        } else {
          window.cancelAnimationFrame(this.requestId);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.head {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
