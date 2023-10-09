<template>
  <div class="application-link main-layout">
    <!-- 头部 -->
    <div class="head">
      <!-- 头部左侧-应用名 -->
      <Services :getTraces="getTraces" :service="service"></Services>
      <!-- 头部右侧 -->
      <div class="filter">
        <DateTime
          :getTraces="getTraces"
          :start="start ? start / 1000 : ''"
          :end="end ? end / 1000 : ''"
        ></DateTime>
        <el-button
          size="small"
          class="more-filter-btn"
          @click="moreFilterBtnClick"
          >{{ $t("advancedFiltering") }}</el-button
        >
      </div>
    </div>
    <!-- 筛选 -->
    <MoreFilter
      v-show="isShowMoreFilter"
      :service="service"
      :operation="operation"
      :tags="tags"
      :maxDuration="maxDuration"
      :minDuration="minDuration"
      :getTraces="getTraces"
      :operationsOptions="operationsOptions"
      :serverEnv="serverEnv"
      :serviceName="serviceName"
    ></MoreFilter>
    <!-- main -->
    <div class="main">
      <div
        className="main-container"
        v-loading="loading"
        :element-loading-text="$t('loading')"
      >
        <Chart
          :service="service"
          :limit="limit"
          :getTraces="getTraces"
          :tableData="tableData"
          :startTime="start / 1000"
          :endTime="end / 1000"
        ></Chart>
        <TableList
          :tableData="tableData"
          :startTime="start / 1000"
          :endTime="end / 1000"
        ></TableList>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import Services from "../components/application-link/Services.vue";
import DateTime from "../components/application-link/DateTime.vue";
import MoreFilter from "../components/application-link/MoreFilter.vue";
import Chart from "../components/application-link/Chart.vue";
import TableList from "../components/application-link/TableList.vue";
import { getTracesData, getOperationsList } from "../api/application-link";
import { formatRelativeDate, formatDuration } from "../utils/time";
import moment from "moment";

export default {
  name: "ApplicationLink",
  components: {
    Services,
    DateTime,
    MoreFilter,
    Chart,
    TableList,
  },
  data() {
    return {
      loading: false, //是否在加载数据
      isShowMoreFilter: false, // 是否显示高级筛选区域
      service: localStorage.getItem("HeraTracingServices") || "", // 应用名选中的值
      source: "",
      start: moment().subtract(1, "hours").valueOf() * 1000, // 时间 lookback
      end: moment().valueOf() * 1000,
      lookback: "1h", //差值
      traceID: "",
      operation: "all", // 应用操作
      tags: "", // 标记
      maxDuration: "", // 持续时间
      minDuration: "",
      limit: "20", // 显示条数
      operationsOptions: [
        {
          value: "all",
          label: "all",
        },
      ],
      serverEnv: "",
      serviceName: "",
      tableData: [],
    };
  },
  mounted() {
    this.initUrlData();
    //监听数据变化
    this.$emitter.on("applicationLink", (data) => {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    });
    this.$emitter.on("serviceChangemoreFilter", (data) => {
      this.operation = "all";
      this.getOperations(data);
    });
  },
  unmounted() {
    this.$emitter.off("applicationLink");
    this.$emitter.off("serviceChangemoreFilter");
  },
  methods: {
    initUrlData() {
      //从url解析数据
      const {
        service, // 应用名选中的值
        start, // 时间 lookback
        end,
        traceID,
        operation, // 应用操作
        tags, // 标记
        maxDuration, // 持续时间
        minDuration,
        limit,
        lookback,
        source,
        serverEnv,
        serviceName,
      } = this.$route.query;
      if (service !== undefined) this.service = service;
      if (start !== undefined) this.start = start;
      if (end !== undefined) this.end = end;
      if (traceID !== undefined) this.traceID = traceID;
      if (operation !== undefined) this.operation = operation;
      if (tags !== undefined && tags) {
        const tagObj = JSON.parse(tags);
        let tagValue = "";
        if (tagObj) {
          Object.keys(tagObj).forEach((key) => {
            tagValue += tagValue ? " " : "";
            tagValue += key + "=" + tagObj[key];
          });
        }
        this.tags = tagValue;
      }
      if (maxDuration !== undefined) this.maxDuration = maxDuration;
      if (minDuration !== undefined) this.minDuration = minDuration;
      if (limit !== undefined) this.limit = limit;
      if (lookback !== undefined) this.lookback = lookback;
      if (source !== undefined) this.source = source;
      if (serverEnv !== undefined) this.serverEnv = serverEnv;
      if (serviceName !== undefined) this.serviceName = serviceName;
    },
    // 获取应用操作列表
    getOperations: function (params) {
      this.operationsOptions = [];
      getOperationsList(params).then((res) => {
        if (res && res.data) {
          const initials = res.data;
          initials.unshift("all");
          this.operationsOptions = Array.from({ length: initials.length }).map(
            (_, idx) => ({
              value: `${initials[idx]}`,
              label: `${initials[idx]}`,
            })
          );
        }
      });
    },
    getTraces: function () {
      if (this.service) {
        const serviceRouteLine = localStorage.getItem(
          "HeraTracingServiceRouteLine"
        );
        if (this.traceID && serviceRouteLine === "1") {
          // 个人觉得有点问题
          this.tableData = this.tableData.filter((item) => {
            return item.traceID === this.traceID;
          });
        } else {
          const params = {
            service: this.service,
            start: this.start ? this.start : "",
            end: this.end ? this.end : "",
            operation: this.operation === "all" ? "" : this.operation,
            maxDuration: this.maxDuration,
            minDuration: this.minDuration,
            limit: this.limit,
            serverEnv: this.serverEnv,
            serviceName: this.serviceName,
          };
          // 云平台
          if (serviceRouteLine === "2") {
            params.source = this.source;
            params.traceId = this.traceID;
          }
          //中国区
          if (serviceRouteLine === "1") {
            params.lookback = this.lookback;
          }
          //Tag
          if (this.tags) {
            let newTags = {};
            const tagsArr = this.tags.split(" ");
            if (tagsArr && tagsArr.length) {
              tagsArr.forEach((item) => {
                const itemArr = item.split("=");
                newTags[itemArr[0]] = itemArr[1] || "true";
              });
              params.tags = JSON.stringify(newTags);
            }
          }
          this.loading = true;
          this.tableData = [];
          getTracesData(params)
            .then((res) => {
              this.tableData = this.getTableData(res.data);
            })
            .finally(() => {
              this.loading = false;
            });
        }
      } else {
        ElMessage.error(this.$t("pleaseSelectAnApplication"));
      }
    },
    getTableData(tableData) {
      const newTableData = [];
      const isErrorTag = ({ key, value }) =>
        key === "error" && (value === true || value === "true");

      tableData.forEach((item, index) => {
        const { traceID, spans, processes } = item;
        let traceStartTime = Number.MAX_SAFE_INTEGER;
        let traceEndTime = 0;
        let operation = "";
        let tooltipValue = "";
        if (spans[0]) {
          operation = spans[0].operationName;
          tooltipValue =
            processes[spans[0].processID].serviceName +
            "：" +
            spans[0].operationName;
        }
        spans.forEach((spanItem) => {
          const { startTime, duration, operationName, references } = spanItem;
          if (startTime < traceStartTime) {
            traceStartTime = startTime;
          }
          if (startTime + duration > traceEndTime) {
            traceEndTime = startTime + duration;
          }
          // 根
          if (references.length === 0) {
            operation = operationName;
            if (processes[spanItem.processID]) {
              tooltipValue =
                processes[spanItem.processID].serviceName +
                "：" +
                operationName;
            }
          }
        });
        const mDate = moment(traceStartTime / 1000);
        const timeStr = mDate.format("h:mm:ss a");
        const fromNow = mDate.fromNow();
        const numErredSpans = spans.filter((sp) =>
          sp.tags.some(isErrorTag)
        ).length;
        newTableData.push({
          key: index,
          status: numErredSpans ? "error" : "sucess", //状态
          traceID: traceID.toLowerCase(), // traceID
          operationName: operation, // 执行操作
          startTimeSort: traceStartTime, // 开始时间
          completeTime: mDate.format("YYYY-MM-DD hh:mm:ss"), // 完整的时间
          startTimeDay: formatRelativeDate(traceStartTime / 1000),
          startTime: timeStr.slice(0, -3) + " " + timeStr.slice(-2),
          startTimeFromNow: fromNow,
          durationSort: traceEndTime - traceStartTime,
          duration: formatDuration(traceEndTime - traceStartTime), // 持续时间
          span:
            `${item.spans.length} Span` +
            `${item.spans.length > 1 ? "s" : ""} `, // span
          errorSpan: numErredSpans
            ? `${numErredSpans} Error` + `${numErredSpans > 1 ? "s" : ""} `
            : "", // span
          spanLen: Number(item.spans.length),
          tooltipValue, //图表上的提示
          traceidData: item, //原始数据，给跳转到traceid用
        });
      });
      return newTableData;
    },
    // 高级筛选查询按钮点击
    moreFilterBtnClick: function () {
      this.isShowMoreFilter = !this.isShowMoreFilter;
    },
  },
};
</script>
<style lang="scss" scoped></style>
