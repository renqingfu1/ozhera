<template>
  <div class="analysis-box">
    <div class="top-form">
      <div>
        <el-button type="primary" size="medium"
          icon="iconfont icon-charts" @click="toCreatePage"
        >创建图表</el-button>
      </div>
      <div class="refresh-box">
        <div class="btn-box">
          <div class="tip-box" v-if="!saved">
            <p class="tip-text">有未保存的更改</p>
            <div class="tip-arrow"></div>
          </div>
          <el-button size="medium" class="save-btn" type="primary"
            :disabled="saved"
            @click="saveEdit">保存</el-button>
        </div>

        <MiDatePicker v-model="timer" @nearTimeText="nearTimeText"
        :showPicker="isNearText?true:false" @changeDate="getNewData"/>
        <el-button
        type="primary" size="medium"
        @click="refreshClick"
        class="refresh-btn"
        >刷新</el-button>
      </div>
    </div>
    <div class="charts-box">
      <Grider v-model="saved" ref="grider"/>
    </div>
  </div>
</template>
<script>
import MiDatePicker from '@/components/MiDatePicker.vue';
import Grider from '@/views/user/tree/analysis/components/grider.vue';
import {
  nearTimeText,
} from '@/common/fun/log-query';
import '@/views/user/tree/analysis/common.scss';
import { EventBus } from '@/views/user/tree/analysis/event-bus/refresh-chart';
import { updateGriders } from '@/common/req/list/user/charts';
import { mapActions } from 'vuex';
import toCreateChart from './common';

export default {
  components: {
    MiDatePicker,
    Grider,
  },
  data() {
    return {
      isAutoFresh: false,
      visible: false,
      saved: true,
      isNearText: false,
      timeoutId: null,
    };
  },
  computed: {
    timer: {
      get() {
        return this.$store.state.moduleChart.timer;
      },
      set(val) {
        this.CHANGETIME(val);
      },
    },
  },
  watch: {
    isNearText(val) {
      if (val) {
        this.setTimer();
      } else {
        this.clearTime();
      }
    },
  },
  beforeDestroy() {
    this.clearTime();
  },
  methods: {
    ...mapActions('moduleChart', ['CHANGETIME', 'CHANGEAUTOFRESH']),
    nearTimeText,
    clearTime() {
      clearTimeout(this.timeoutId);
    },
    setTimer() {
      this.timeoutId = setTimeout(() => {
        this.CHANGEAUTOFRESH(true);
        this.refreshCharts();
        this.clearTime();
        this.setTimer();
      }, 30 * 1000);
    },
    getNewData(val) {
      if (!val) {
        this.$message.warning('请选择时间！');
      }
      this.CHANGEAUTOFRESH(false);
      this.refreshCharts();
    },
    refreshClick() {
      if (!this.timer) {
        this.$message.warning('请选择时间！');
        return;
      }
      this.CHANGEAUTOFRESH(false);
      this.refreshCharts();
    },
    refreshCharts() { // 公共方法
      EventBus.$emit('refresh');
    },
    toCreatePage() {
      const { storeId, spaceId } = this.$route.query;
      const { dashboardId, layout } = this.$refs.grider;
      const params = {
        spaceId,
        storeId,
        dashboardId,
        layoutL: layout.length,
      };
      toCreateChart.call(this, params);
    },
    saveEdit() {
      const { dashboardId, layout } = this.$refs.grider;
      const graphList = this.transfromLayout(layout);
      const params = {
        graphList,
        dashboardId,
      };
      updateGriders(params).then(() => {
        this.saved = !this.saved;
        this.$message.success('保存成功');
      });
    },
    transfromLayout(layout) {
      const res = layout.map((item) => ({
        ...item,
        ...{
          point: JSON.stringify({
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
            i: item.i,
          }),
        },
      }));
      return res;
    },
  },
};
</script>
<style lang="scss" scoped>
.analysis-box{
  padding: 0 10px;
}
.refresh-box,.top-form{
  display: flex;
}
.refresh-box ::v-deep .picker{
  border-left: solid 1px #dcdfe6;
}
.top-form{
  justify-content: space-between;
}
.save-btn{
  margin-right: 10px;
}
.btn-box{
  position: relative;
}
.tip-box{
  position: absolute;
  transform: translate(-112px,0);
  padding:3px 5px;
  top: 5px;
  border:solid 1px #F56C6C;
  background :#F56C6C;
}
.tip-text{
  text-align: right;
  width: 84px;
  font-size: 12px;
  color:#fff;
}
.tip-arrow{
  position: absolute;
  right : -15px;
  top: 4px;
  border: solid 7px #fff;
  border-left-color:#F56C6C;
}
</style>
