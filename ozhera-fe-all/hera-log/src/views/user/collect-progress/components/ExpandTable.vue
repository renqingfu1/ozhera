<template>
  <el-table
    :data="list"
    style="width: 100%"
    class="expand-table"
    border>
    <el-table-column
      prop="configIp"
      label="IP">
    </el-table-column>
    <el-table-column
      prop="collectPercentage"
      label="采集进度">
      <template slot-scope="props">
        <div class="progress-box">
          <el-progress :percentage="retNum(props.row.collectPercentage)"  type="dashboard"
          :colors="colors">
          </el-progress>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    item: {},
  },
  computed: {
    curItem() {
      return this.item;
    },
    list() {
      return this.item.fileProgressDetails || [];
    },
  },
  data() {
    return {
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 },
      ],
    };
  },
  methods: {
    retNum(str) {
      return Number(str.replace('%', ''));
    },
  },
};
</script>
<style lang="scss" scoped>
.progress-box{
  width: 30px;
  ::v-deep .el-progress-circle{
    width: 60px !important;
    height: 60px !important;
  }
  ::v-deep .el-progress__text{
    font-size: 12px  !important;
  }
}
.expand-table{
  ::v-deep .el-table__header-wrapper{
    .el-table__header{
      border: none;
      border-bottom: solid 1px #ebeef5;
    }
  }
}
</style>
