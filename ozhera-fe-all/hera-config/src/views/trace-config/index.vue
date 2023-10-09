<template>
  <div>
    <HeraTitle :text="$t('traceConfig.title')" />
    <div  class="top-box">
      <el-button type="primary" @click="newCreate">{{ $t('traceConfig.add') }}</el-button>
    </div>
    <ContainBox>
      <div>
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
          <el-table-column prop="appName" :label="$t('traceConfig.table.name')" >
          </el-table-column>
          <el-table-column prop="createUser" :label="$t('traceConfig.table.name')" >
          </el-table-column>
          <el-table-column prop="createTime" :label="$t('traceConfig.table.createTime')" >
            <template slot-scope="scope">
              <MiDateformat v-model="scope.row.createTime"/>
            </template>
          </el-table-column>
          <el-table-column  :label="$t('traceConfig.table.operation')" width="140px">
            <template slot-scope="scope">
              <el-button type="text" size="small"
              @click="editeItem(scope.row)">{{ $t('traceConfig.table.edit') }}</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteItem(scope.row)">{{ $t('traceConfig.table.del') }}</el-button>
              <el-button
                type="text"
                size="small"
                @click="toDetail(scope.row)">{{ $t('traceConfig.table.detail') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box">
          <el-pagination
            background
            layout="total,prev, pager, next"
            :total="total"
            :page-size="req.pageSize"
            @current-change="changePage"
          >
          </el-pagination>
        </div>
      </div>
    </ContainBox>
  </div>
</template>
<script>
import { traceList, deleteTrace } from '@/common/server/list/trace';
import HeraTitle from '@/components/hera-title.vue';
import ContainBox from '@/components/contain-box.vue';
import MiDateformat from '@/components/MiDateformat.vue';

export default {
  components: {
    HeraTitle, ContainBox, MiDateformat,
  },
  data() {
    return {
      showNew: false,
      loading: false,
      total: 0,
      itemData: {
        name: '',
        chartId: '',
        memberIds: [],
      },
      tableData: [],
      req: {
        name: '',
        page: 1,
        pageSize: 20,
      },
      dialogType: 'newCreate',
      dialogOptions: {
        edit: '编辑',
        newCreate: '新增',
      },
    };
  },
  mounted() {
    this.req = {
      ...this.req,
      ...{ name: this.$route.query.name },
    };
    this.getListData();
  },
  methods: {
    getListData() {
      this.loading = true;
      traceList(this.req).then((res) => {
        this.total = res.data.total;
        this.tableData = res.data.list;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    deleteItem(item) {
      this.$confirm('确定删除该过滤配置吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteTrace({ id: item.id }).then(() => {
          this.$message.success('删除成功');
          this.getListData();
        }).catch((err) => {
          console.log('err', err);
        });
      }).catch(() => {});
    },
    changePage(page) {
      this.req = {
        ...this.req,
        ...{ page },
      };
      this.getListData();
    },
    groupNameEnter() {
      this.req = {
        ...this.req,
        ...{ page: 1 },
      };
      this.$router.push({
        query: this.req,
      });
      this.getListData();
    },
    switchShowCreate() {
      this.showNew = !this.showNew;
    },
    addGroups() {
      this.getListData();
    },
    newCreate() {
      this.$router.push({
        name: 'TraceConfigCreate',
      });
    },
    editeItem(item) {
      this.$router.push({
        name: 'TraceConfigCreate',
        query: {
          id: item.id,
        },
      });
    },
    toDetail(item) {
      this.$router.push({
        name: 'TraceConfigCreate',
        query: {
          id: item.id,
          type: 'detail',
        },
      });
    },
  },
};
</script>
<style scoped>
.top-box{
  display: flex;
  justify-content: space-between;
  padding:20px 20px 0 20px;
}
.top-box >>> .el-input{
  width: 190px;
}
.top-box >>> .el-input .el-input__inner{
  border-right: none;
}
.top-box >>> .el-input-group__append{
  background-color: #fff;
  padding:0 15px;
}
.top-box >>> .el-input__inner:focus{
  border-color: #DCDFE6;
}
</style>
