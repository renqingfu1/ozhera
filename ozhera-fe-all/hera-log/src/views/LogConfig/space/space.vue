<template>
  <div>
    <el-form v-if="!isUser" :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item :label="pageKey + ' name'">
        <el-input
          v-model="formInline.spaceName"
          :placeholder="pageKey + ' name'"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(1)">{{ $t('logConfig.space.query') }}</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button type="primary" @click="isShowFun">{{ $t('logConfig.space.add') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="tableData" style="width: 100%" size="medium">
      <el-table-column prop="spaceName" :label="$t('logConfig.space.table.spaceName')">
        <template slot-scope="scope" >
          <router-link v-if="isUser"
          :to="`/user/space-tree?spaceId=${scope.row.id}`" class="el-link--primary">
            {{scope.row.spaceName}}
          </router-link>
          <span  v-else >{{scope.row.spaceName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="creator" :label="$t('logConfig.space.table.creator')" width="120"/>
      <el-table-column prop="ctime" :label="$t('logConfig.space.table.ctime')" width="170">
        <template slot-scope="scope">
          {{ $dateFormat(scope.row.ctime, "yyyy/mm/dd HH:MM:ss") }}
        </template>
      </el-table-column>
      <el-table-column v-if="!isUser" prop="utime" :label="$t('logConfig.space.table.utime')">
        <template slot-scope="scope">
          {{ $dateFormat(scope.row.utime, "yyyy/mm/dd HH:MM:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="description" :label="$t('logConfig.space.table.desc')" />
      <el-table-column fixed="right"
        :label="$t('logConfig.space.table.operation')"
        :width="isUser?130:220">
        <template slot-scope="scope">
          <el-button @click="toStore(scope.row)" type="text" size="medium"
            v-if="!isUser"
            >store列表</el-button
          >
          <el-button @click="impowerFun(scope.row)" type="text" size="medium"
            :disabled="scope.row.creator == 'system'"
            >{{ $t('logConfig.space.table.op1') }}</el-button
          >
          <el-button @click="edit(scope.row)" type="text" size="medium"
            >{{ $t('logConfig.space.table.edit') }}</el-button
          >
          <el-button @click="deleteItem(scope.row)" type="text" size="medium"
            >{{$t('logConfig.space.table.del')}}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <PaginationBox>
      <el-pagination
        background
        layout="total,prev, pager, next"
        @current-change="changePage"
        :page-size="formInline.pageSize"
        :total="total"
      >
      </el-pagination>
    </PaginationBox>
    <NewCreate ref="newCreateDialog" @getListFn="getList" />
    <Impower
    :visible="showImpower"
    @changeVisible="changeImpoverVisible"
    :propSpaceId="detailSpaceId"/>
  </div>
</template>
<script>
import { getSpaceList, deleteSpace } from '@/common/req/list/logConfig';
import PaginationBox from '@/components/PaginationBox.vue';
import Impower from '@/components/Impower.vue';
import NewCreate from './NewCreate.vue';

export default {
  components: {
    NewCreate,
    PaginationBox,
    Impower,
  },
  props: {
    isUser: { // 是否用于管理员页面
      type: Boolean,
    },
  },
  data() {
    return {
      showImpower: false,
      pageKey: 'space',
      loading: false,
      formInline: {
        spaceName: '',
        page: 1,
        pageSize: 20,
      },
      total: 0,
      tableData: [],
      detailSpaceId: null,
      tpcDomain: '',
    };
  },
  methods: {
    onSubmit(page) {
      this.formInline.page = page;
      this.getList();
    },
    impower(detail) {
      this.detailSpaceId = detail.id;
      this.showImpower = !this.showImpower;
    },
    impowerFun(detail) {
      window.open(`${this.tpcDomain}/node?nodeId=${detail.tpcNodeId}`);
    },
    changeImpoverVisible(propData) {
      this.showImpower = propData;
    },
    changePage(curPAge) {
      this.formInline.page = curPAge;
      this.getList();
    },
    edit(item) {
      this.$refs.newCreateDialog.getData(item.id);
    },
    toStore(item) {
      this.$router.push({ name: 'storeList', params: { spaceId: item.id } });
    },
    isShowFun() {
      this.$refs.newCreateDialog.newCreate();
    },
    deleteItem(item) {
      this.$confirm(this.$t('delTips'), this.$t('prompt'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancle'),
        type: 'warning',
      })
        .then(() => {
          deleteSpace({ id: item.id }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.getList();
          });
        })
        .catch(() => {});
    },
    getList() {
      this.loading = true;
      getSpaceList(this.formInline)
        .then((res) => {
          this.tpcDomain = res.tpcDomain;
          // eslint-disable-next-line no-mixed-operators
          this.tableData = (res && res.data.list) || [];
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
<style lang="scss" scoped>
.el-link--primary {
  color: #409EFF;
}
</style>
