<template >
  <TableBox>
    <template slot="header">
      <BreadCrumb :items="breadItems" />
    </template>
    <div class="search-box">
      <label>采集进度：</label>
      <ProgressSelVue v-model="progressRation" @change="getList"/>
    </div>
    <el-table
      class = "table-box"
      :data="tableData"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <ExpandTableVue :item="props.row"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="tailName"
        label="tailName">
      </el-table-column>
      <el-table-column
        prop="appName"
        label="应用名">
      </el-table-column>
      <el-table-column
        prop="path"
        label="日志路径">
      </el-table-column>
    </el-table>
  </TableBox>
</template>
<script>
import BreadCrumb from '@/components/BreadCrumb.vue';
import TableBox from '@/components/TableBox.vue';
import getCollectProgress from '@/common/req/list/collect-progress';
import ProgressSelVue from './components/ProgressSel.vue';
import ExpandTableVue from './components/ExpandTable.vue';

export default {
  components: {
    BreadCrumb,
    TableBox,
    ProgressSelVue,
    ExpandTableVue,
  },
  data() {
    return {
      breadItems: [{ label: '采集进度' }],
      tableData: [],
      progressRation: 100,
      form: {
        page: 1,
        pageSize: 20,
      },
    };
  },
  methods: {
    getList() {
      const query = {
        ...this.form,
        progressRation: (this.progressRation / 100),
      };
      getCollectProgress(query).then(({ data }) => {
        this.tableData = data;
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
<style lang="scss" scoped>
.search-box{
  padding-bottom: 10px;
  label{
    font-size: 14px;
  }
}
.table-box{
  ::v-deep .el-table__expanded-cell{
    // background:#f5f7fa;
    padding:10px 15px;
  }
}
</style>
