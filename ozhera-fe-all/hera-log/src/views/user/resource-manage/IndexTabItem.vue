<template lang="">
  <div class="index-tab-item">
    <div class="btn-box">
      <el-button
        type="primary"
        @click="clickCreate">{{ $t('resourceManage.indexTabItem.add') }}</el-button>
      <el-button
        type="text"
        @click="toESListTips"
        v-if="type==4" >{{ $t('resourceManage.indexTabItem.tip') }}</el-button>
    </div>
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column
          prop="alias"
          :label="$t('resourceManage.indexTabItem.table.alias')"> </el-table-column>
        <el-table-column
          prop="clusterName"
          :label="$t('resourceManage.indexTabItem.table.clusterName')" v-if="type==1">
        </el-table-column>
        <el-table-column
          prop="serviceUrl"
          :label="$t('resourceManage.indexTabItem.table.serviceUrl')" v-else>
        </el-table-column>
        <el-table-column
          :label="$t('resourceManage.indexTabItem.table.regionCn')"
          width="90px"
          prop="regionCn">
        </el-table-column>
        <el-table-column
          prop="ak"
          :label="(type==2||type==1) ? 'ak': $t('resourceManage.indexTabItem.table.ak')"
          v-if="type!=1 && type!=4"></el-table-column>
        <el-table-column
          prop="teamId"
          :label="$t('resourceManage.indexTabItem.table.teamId')"
          v-if="type==2" width="90px"></el-table-column>
        <el-table-column
          prop="orgId"
          :label="$t('resourceManage.indexTabItem.table.orgId')"
          v-if="type==2" width="90px"></el-table-column>
        <el-table-column
          :label="$t('resourceManage.indexTabItem.table.ops')"
          fixed="right"
          width="130">
          <template slot-scope="scope">
            <el-button
              @click="editItem(scope.row)"
              type="text"
              size="small"
              >{{ $t('resourceManage.indexTabItem.table.edit') }}</el-button
            >
            <el-button
              @click="deleteItem(scope.row)"
              type="text"
              size="small"
              >{{ $t('resourceManage.indexTabItem.table.del') }}</el-button
            >
            <el-button
              @click="showDetail(scope.row)"
              type="text"
              size="small"
              >{{ $t('resourceManage.indexTabItem.table.detail') }}</el-button
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
    <CreateResource :type="type" :dialogVisible="dialogVisible"
    @changeDialog="changeDialog"
    @getListFn="getListFn"
    :itemId="detailId"/>
    <ResourceDetail
      :type="type"
      :itemId="detailId" :dialogVisible="detailVisible" v-if="detailVisible"
      @changeDialog="changeDetailShow"/>
  </div>
</template>
<script>
import PaginationBox from '@/components/PaginationBox.vue';
import { mapState } from 'vuex';
import { addResource, getResourceList } from '@/common/req/list/resource-manage';
import CreateResource from './create-resource/CreateResource.vue';
import ResourceDetail from './ResourceDetail.vue';
// import IsDefault from './components/IsDefault.vue';

export default {
  components: {
    PaginationBox,
    CreateResource,
    ResourceDetail,
    // IsDefault,
  },
  data() {
    return {
      loading: false,
      tableData: [],
      formInline: {
        page: 1,
        pageSize: 20,
      },
      total: 0,
      dialogVisible: false,
      detailVisible: false,
      detailId: '',
    };
  },
  computed: {
    ...mapState({
      typeOptions: (state) => state.moduleMQConfig.typeOptions,
    }),
  },
  props: {
    type: {
      required: true,
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    switchShowCreate() {
      this.dialogVisible = !this.dialogVisible;
    },
    switchShowDetail() {
      this.detailVisible = !this.detailVisible;
    },
    changeDetailShow(val) {
      this.detailVisible = val;
    },
    clickCreate() {
      this.detailId = null;
      this.switchShowCreate();
    },
    changeDialog(val) {
      this.dialogVisible = val;
    },
    editItem(row) {
      this.detailId = row.id;
      this.switchShowCreate();
    },
    deleteItem(item) {
      this.$confirm(this.$t('delTips'), this.$t('prompt'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancle'),
        type: 'warning',
      }).then(() => {
        addResource({
          id: item.id,
          operateCode: 3,
          resourceCode: this.type,
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.getList();
        });
      }).catch(() => {

      });
    },
    showDetail(row) {
      this.detailId = row.id;
      this.switchShowDetail();
    },
    changePage(curPAge) {
      this.formInline.page = curPAge;
      this.getList();
    },
    getList() {
      this.loading = true;
      const reqParams = { ...this.formInline, resourceCode: this.type };
      getResourceList(reqParams)
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
    getListFn(params) {
      if (params.page === 1) {
        this.formInline.page = 1;
      }
      this.getList();
    },
    toESListTips() {
      window.open('/#/pc/article-detail?id=16845', '_blank');
    },
  },
};
</script>
<style lang="scss" scoped>
.btn-box {
  margin-bottom: 20px;
  padding-right: 10px;
  display:flex;
  justify-content: space-between;

}
</style>
