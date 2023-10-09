<template>
  <div class="select-app-tail">
    <div class="select-box">
      <div>
        <span class="title">{{ $t('storeSelect.label1') }}: </span>
        <el-select
          v-model="milogAppId"
          :placeholder="$t('indexPage.selApp')"
          filterable
          clearable
          remote
          :remote-method="remoteMethod"
          @change="changeApp"
        >
          <el-option
            v-for="item in appList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div v-if="milogAppId" class="top10">
        <span class="title">{{ $t('storeSelect.label1') }}: </span>
        <el-select v-model="tail" placeholder="选择应用别名" value-key="tailId" >
          <el-option
            v-for="item in tailList"
            :key="item.tailId"
            :label="item.tailName"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="btn-box top10">
      <el-button  @click="saveTail" :disabled="!tail">{{ $t('indexPage.bookmark') }}</el-button>
      <el-button type="primary" @click="confirmSel" :disabled="!tail">{{$t('confirm')}}</el-button>
    </div>
  </div>
</template>
<script>
import { getAppDic, getTailsFromApp } from '@/common/req/list/logConfig';
import { mapActions } from 'vuex';
// import

export default {
  data() {
    return {
      milogAppId: '',
      tail: null,
      appList: [],
      tailList: [],
    };
  },
  methods: {
    ...mapActions('moduleSaved', ['AddSaveItem']),
    remoteMethod(val) {
      this.getAppList(val);
    },
    getAppList(appName) {
      getAppDic({ appName }).then(({ data }) => {
        this.appList = data.slice(0, 10);
      });
    },
    getTailList() {
      const { milogAppId } = this;
      if (milogAppId) {
        getTailsFromApp({ milogAppId }).then(({ data }) => {
          this.tailList = data;
        });
      }
    },
    changeApp() {
      this.tail = null;
      this.getTailList();
    },
    confirmSel() {
      if (!this.tail) {
        this.$message.warning('请选择应用');
        return;
      }
      const appDetail = this.getAppDetail();
      this.$emit('selectSpaceStore', { ...this.tail, ...appDetail });
    },
    saveTail() {
      const app = this.getAppDetail();
      // spaceId、spaceName,storeId,storeName,tailId,tailName,appId,appName
      const params = {
        ...this.tail,
        ...app,
        sort: 2, // tail类型
      };
      this.AddSaveItem({
        params,
        type: 'app',
        callback: () => {
          this.$message.success('收藏成功!');
        },
      });
    },
    getAppDetail() {
      const appData = this.appList.filter((item) => item.value === this.milogAppId);
      const appDetail = {
        appName: appData[0].label,
        appId: appData[0].value,
      };
      return appDetail;
    },
  },
  mounted() {
    this.getAppList('');
  },
};
</script>
<style lang="scss" scoped>
.title{
  display: inline-block;
  width: 80px;
  text-align: right;
  padding-right: 10px;
}
.top10{
  margin-top: 10px;
}
.btn-box{
  text-align: right;
  padding: 0 14px;
}
</style>
