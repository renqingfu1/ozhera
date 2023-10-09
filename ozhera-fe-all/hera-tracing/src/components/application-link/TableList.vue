<template>
  <div class="application-link-table">
    <div class="table-content table-list">
      <el-table :data="tableValue" style="width: 100%">
        <!-- 状态 -->
        <el-table-column
          prop="status"
          :label="$t('state')"
          sortable
          width="74"
          align="center"
        >
          <template #default="scope">
            <span
              :class="[
                'status-circle',
                scope.row.status === 'error'
                  ? 'status-circle-error'
                  : 'status-circle-success',
              ]"
              style="width: 8px; height: 8px"
            >
            </span>
          </template>
        </el-table-column>
        <!-- traceID -->
        <el-table-column prop="traceID" label="traceID">
          <template #default="scope">
            <span class="trace-link" @click="goTraceID(scope.row)">
              {{ scope.row.traceID }}
            </span>
          </template>
        </el-table-column>
        <!--  执行操作-->
        <el-table-column prop="operationName" :label="$t('performOperations')">
        </el-table-column>
        <!-- 开始时间 -->
        <el-table-column
          prop="startTimeSort"
          :label="$t('starTime')"
          sortable
          width="155"
        >
          <template #default="scope">
            <!-- {{ scope.row.completeTime }} -->
            {{ scope.row.startTimeDay }}
            <span class="time-split">|</span>{{ scope.row.startTime }}
            <br />
            {{ scope.row.startTimeFromNow }}
          </template>
        </el-table-column>
        <!-- 持续时间 -->
        <el-table-column
          prop="durationSort"
          :label="$t('duration')"
          sortable
          width="100"
        >
          <template #default="scope">
            {{ scope.row.duration }}
          </template>
        </el-table-column>
        <!-- Span -->
        <el-table-column prop="spanLen" label="Span" sortable width="170">
          <template #default="scope">
            <span class="span-tag" v-if="scope.row.span">
              {{ scope.row.span }}
            </span>
            <span class="span-tag-error" v-if="scope.row.errorSpan">
              {{ scope.row.errorSpan }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableList",
  props: {
    tableData: {},
    startTime: {},
    endTime: {},
  },
  data() {
    return {
      tableValue: this.$props.tableData,
    };
  },
  watch: {
    tableData(newValue) {
      this.tableValue = newValue;
    },
  },
  methods: {
    // 去traceid页面
    goTraceID(row) {
      let routeData = this.$router.resolve({
        name: "TraceIdChild",
        params: {
          traceid: row.traceID,
          traceidData: JSON.stringify(row.traceidData),
        },
        query: {
          area: row.traceidData.area,
          source: row.traceidData.source,
          startTime: this.$props.startTime,
          endTime: this.$props.endTime,
        },
      });
      window.open(routeData.href, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/theme.scss";
.application-link-table {
  // 表格
  .table-content {
    padding: 0px 20px 20px 20px;
  }
  //traceid
  .trace-link {
    font-size: 15px;
    color: $themeColor;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
  .time-split {
    display: inline-block;
    padding: 0px 5px;
    color: $light-black-color;
  }
  //span
  .span-tag,
  .span-tag-error {
    display: inline-block;
    padding: 3px 6px;
    border-radius: 4px;
  }
  .span-tag {
    border: 1px solid #ddd;
    margin-right: 6px;
  }
  .span-tag-error {
    border: 1px solid #f53841;
    color: #f53841;
    background-color: #fef0ef;
  }
}
</style>
