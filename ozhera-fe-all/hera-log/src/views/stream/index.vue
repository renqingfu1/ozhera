<template>
  <TableBox>
    <template slot="header">
      <BreadCrumb :items="breadCrumbItems" />
    </template>
    <template>
      <!-- <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item :label="pageKey+ ' name'">
          <el-input v-model="formInline.spaceName" :placeholder="pageKey+ ' name'"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(1)">{{ $t('search') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="isShowFun">新增</el-button>
        </el-form-item>
      </el-form> -->
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
      >

        <el-table-column prop="machineId" label="machineId"> </el-table-column>
        <el-table-column prop="hostName" width="300"
        :label="$t('resourceManage.indexTabItem.table.serviceUrl')">
        </el-table-column>
        <el-table-column prop="ip" label="ip"> </el-table-column>
        <el-table-column prop="group" label="所在组"> </el-table-column>
        <el-table-column prop="updateTime" :label="$t('logConfig.space.table.utime')">
          <template slot-scope="scope">
            {{ $dateFormat(scope.row.utime, "yyyy/mm/dd HH:MM:ss") }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span :class="scope.row.status === 0 ? 'danger' : 'normal'">
              {{ scope.row.status === 0 ? "未部署" : "已部署" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="configSend(scope.row)"
              type="text"
              size="small"
              :disabled="scope.row.status === 0 ? true : false"
              >发送配置</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <PaginationBox>
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="changePage"
          :page-size="formInline.pageSize"
          :total="total"
        >
        </el-pagination>
      </PaginationBox>
    </template>
  </TableBox>
</template>
<script>
import {
  getStreamList,
  streamSendConfig,
} from '@/common/req/list/stream';
import BreadCrumb from '@/components/BreadCrumb.vue';
import TableBox from '@/components/TableBox.vue';
import PaginationBox from '@/components/PaginationBox.vue';

export default {
  components: {
    BreadCrumb,
    TableBox,
    PaginationBox,
  },
  data() {
    return {
      pageKey: 'stream',
      breadCrumbItems: [
        {
          label: 'stream列表',
        },
      ],
      loading: false,
      formInline: {
        page: 1,
        pageSize: 20,
      },
      total: 0,
      tableData: [],
    };
  },
  methods: {
    configSend(row) {
      const params = {
        ip: row.ip,
      };
      streamSendConfig(params)
        .then((res) => {
          this.$message({
            type: 'success',
            message: res.message,
          });
        })
        .catch((err) => {
          console.log('err', err);
        });
    },
    onSubmit(page) {
      this.formInline.page = page;
      this.getList();
    },
    changePage(curPAge) {
      this.formInline.page = curPAge;
      this.getList();
    },
    edit(item) {
      this.$refs.newCreateDialog.getData(item.id);
    },
    isShowFun() {
      this.$refs.newCreateDialog.isShowFn();
    },
    getList() {
      this.loading = true;
      getStreamList(this.formInline)
        .then((res) => {
          const resData = (res && res.data.list) || [];
          // eslint-disable-next-line no-mixed-operators
          this.tableData = resData;
          this.formInline.page = res && res.data.page;
          this.total = res && res.data.total;
          this.loading = false;
        })
        .catch((err) => {
          console.log('err', err);
          this.loading = false;
        });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
<style scoped>
.danger {
  color: #f56c6c;
}
.normal {
  color: #67c23a;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand >>> label {
  color: #99a9bf;
  padding-right: 5px;
}
.demo-table-expand >>> .el-form-item {
  margin-right: 40px;
  margin-bottom: 0;
}

</style>
