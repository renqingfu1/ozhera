<template>
  <div class="progress-inner">
    <el-form ref="form" :model="form"  inline>
      <el-form-item
      :label="$t('createTail.ServiceAlias')"
      >
        <!-- {{store.children}} -->
        <el-select v-model="form.tailId" :placeholder="$t('createTail.SelServiceAlias')"
        @change="changeTail" clearable filterable>
          <el-option
            :label="tail.label"
            :value="tail.value"
            v-for="tail in tailList"
            :key="tail.value"
          >{{tail.label}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="IP:">
        <el-select v-model="form.ip" placeholder="请选择IP" clearable filterable>
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="(item,index) in ipOptions"
            :key="`${item.value}-${index}`"
          >{{item.label}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="getList">{{ $t('search') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="isInterval" @change="changeSwitch" class="interval">
          自动刷新（10秒/次）
        </el-checkbox>
      </el-form-item>
    </el-form>
    <el-table :data="expandsData" style="width: 100%"
      v-loading="loading">
      <el-table-column
      type="index"
      width="50">
    </el-table-column>
      <el-table-column prop="tailName"
      :label="$t('createTail.ServiceAlias')"
      min-width="11%"></el-table-column>
      <el-table-column prop="path" label="日志路径"  min-width="40%"></el-table-column>
      <el-table-column prop="collectTime"  label="采集时间"  min-width="11%">
        <template slot-scope="scope">
          {{$dateFormat(scope.row.collectTime, 'yyyy/mm/dd HH:MM:ss')}}
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="IP"  min-width="8%"></el-table-column>
      <el-table-column prop="fileRowNumber"  label="行号" min-width="5%"></el-table-column>
      <el-table-column prop="collectPercentage" label="进度" min-width="5%"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getStoreIpsApi, logProcessApi } from '@/common/req/list/process';
import { getTailByIdReq } from '@/common/req/list/logConfig';
import { mapState } from 'vuex';

export default {
  props: {
    store: {
      require: true,
      type: Object,
    },
  },
  data() {
    return {
      form: {
        tailId: '',
        ip: '',
      },
      expandsData: [],
      hasFinish: false,
      startIndex: undefined,
      ipOptions: [],
      allIpsOptions: [],
      isInterval: false,
      intevalTimer: null,
      loading: false,
    };
  },
  computed: {
    ...mapState({
      spaceTree: (state) => state.moduleSpaceTree.spaceTree,
    }),
    tailList() {
      const storeId = `${this.store.storeId || this.store.value}`;
      const storeArr = this.spaceTree.filter(
        (item) => `${item.value}` === storeId,
      );
      return storeArr.length > 0 ? storeArr[0].children : [];
    },
  },
  mounted() {
    this.getIpOptions();
    this.getList();
  },
  methods: {
    getIpOptions() {
      const params = { storeId: this.store.storeId };
      getStoreIpsApi(params).then(({ data }) => {
        this.allIpsOptions = data;
        this.ipOptions = data;
      });
    },
    getList() {
      this.loading = true;
      const params = { ...this.form, ...{ storeId: this.store.storeId } };
      const sendParams = {
        type: '', // "store/tail/ip",
        value: '', // "storeId/tailId/storeId,ip"
      };
      if (params.ip) { // 有IP
        sendParams.type = 'ip';
        if (params.tailId) { // 有tail
          sendParams.value = `${params.tailId},${params.ip}`;
          sendParams.type = 'tail&ip';
        } else { // 没有tail
          sendParams.value = `${params.storeId},${params.ip}`;
          sendParams.type = 'ip';
        }
      } else if (params.tailId) { // 没有ip
        sendParams.type = 'tail';
        sendParams.value = `${params.tailId}`;
      } else {
        sendParams.type = 'store';
        sendParams.value = `${params.storeId}`;
      }
      logProcessApi(sendParams).then(({ data }) => {
        this.loading = false;
        this.expandsData = [];
        this.totalList = data || [];
        this.total = this.totalList.length;
        this.hasFinish = false;
        this.step();
      });
    },
    step() {
      const stepLen = 50;// 每一步往list中塞入几个
      if (this.startIndex === undefined) {
        this.startIndex = 0;
      } else {
        this.startIndex += stepLen;
      }
      let endIndex;
      if (this.startIndex + stepLen >= this.total) { // 结尾
        this.hasFinish = true;
        endIndex = this.total;
      } else {
        endIndex = this.startIndex + stepLen;
      }
      const sliceArr = this.totalList.slice(this.startIndex, endIndex);
      this.expandsData = [...this.expandsData, ...sliceArr];
      if (!this.hasFinish) {
        window.requestAnimationFrame(this.step);
      } else {
        this.startIndex = undefined;
      }
      // this.expandsData = data;
    },
    changeSwitch(openInterval) {
      if (openInterval) { // 打开定时
        this.setIntervalFn();
      } else { // 关闭定时
        this.clearTimerFn();
      }
    },
    changeTail(val) {
      console.log('-changeTail');
      if (!val) { // 清空
        this.ipOptions = this.allIpsOptions;
        return;
      }
      this.form = { ...this.form, ...{ ip: '' } };
      getTailByIdReq({ id: val }).then(({ data }) => {
        const ipsOptions = data.ips.map((item) => ({
          label: item,
          value: item,
        }));
        this.ipOptions = ipsOptions;
      });
    },
    setIntervalFn() {
      this.getList();
      clearTimeout(this.intevalTimer);
      this.intevalTimer = setTimeout(() => {
        this.setIntervalFn();
      }, 10 * 1000);
    },
    clearTimerFn() {
      clearTimeout(this.intevalTimer);
    },
  },
  beforeDestroy() {
    this.clearTimerFn();
  },
};
</script>
<style scoped>
.progress-inner {
  height: 100%;
  overflow: scroll;
  padding: 20px;
}
.interval .el-checkbox{
  font-weight: 400;
}
</style>
