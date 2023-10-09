<template>
  <div class="grider-box">
    <div v-if="layout.length>0">
      <grid-layout
      :layout.sync="layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
      @layout-updated="layoutUpdatedEvent"
    >
      <grid-item v-for="item in layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i">
        <GriderCharts :id="item.graphId" @setSaveStatus="setSaveStatus" :dashboardId="dashboardId"
          @freshGrider="freshGrider" :title="item.graphPrivateName" :graphType="item.graphType"
          @changeTitle="changeTitle"/>
      </grid-item>
    </grid-layout>
    </div>
    <div v-else class="empty-grider">
      <div class="grider-item" @click="toCreatePage">
        <h3><i class="iconfont icon-charts"></i></h3>
        <h3>创建您的首个图表吧</h3>
        <p class="desc">创建用于描述您的数据的内容</p>
      </div>
    </div>
  </div>
</template>
<script>
import VueGridLayout from 'vue-grid-layout';
import { getGridersData } from '@/common/req/list/user/charts';
import { mapState } from 'vuex';
import GriderCharts from './GriderCharts.vue';
import toCreateChart from '../common';

export default {
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    GriderCharts,
  },
  data() {
    return {
      updateTimes: 0,
      layout: [],
      dashboardId: null,
    };
  },
  computed: {
    ...mapState({
      colNum: (state) => state.moduleChart.colNum,
    }),
    saved: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  props: {
    value: {
      type: Boolean,
    },
  },
  methods: {
    toCreatePage() {
      const { storeId, spaceId } = this.$route.query;
      const params = {
        spaceId,
        storeId,
        dashboardId: this.dashboardId,
        layoutL: this.layout.length,
      };
      toCreateChart.call(this, params);
    },
    layoutUpdatedEvent() {
      // newLayout
      this.updateTimes += 1;
      if (this.updateTimes > 1) {
      //   console.log('首次加载不算: ', this.updateTimes, newLayout);
        this.saved = false;
      }
    },
    setSaveStatus(val) {
      this.saved = val;
    },
    freshGrider() {
      const { query } = this.$route;
      const params = {
        spaceId: Number(query.spaceId),
        storeId: Number(query.storeId),
      };
      getGridersData(params).then(({ data }) => {
        this.dashboardId = data.dashboardId || null;
        this.layout = data.graphList.map((item) => {
          const point = JSON.parse(item.point);
          return ({
            ...item,
            ...{
              ...point,
            },
          });
        }) || [];
        console.log('this.layout', this.layout);
      });
    },
    changeTitle(params) {
      console.log('params', params);
      this.layout = this.layout.map((item) => ({
        ...item,
        graphPrivateName: item.graphId === params.graphId ? params.name : item.graphPrivateName,
      }));
    },
  },
  mounted() {
    this.freshGrider();
  },
};
</script>
<style scoped lang="scss">
.grider-box {
  ::v-deep .vue-grid-item{
    background: #fff;
    box-shadow: 0 0.9px 4px -1px rgb(0, 0 ,0 , 8%),
                0 2.6px 8px -1px rgb(0, 0, 0 , 6%),
                0 5.7px 12px -1px rgb(0, 0, 0 , 5%),
                0 15px 15px -1px rgb(0 ,0 ,0 , 4%);
    border:dashed 1px #98A2B3;
    border-radius: 8px;
  }
}
.empty-grider{
  padding: 10px;
}
.grider-item{
  background-color: #F5F7FA;
  border: 1px solid #D3DAE6;
  border-style: dashed;
  border-radius: 6px;
  padding: 80px;
  max-width: 400px;
  text-align: center;
  cursor: pointer;
  .icon-charts{
    font-size: 30px;
    color:#69707d;
  }
  h3{
    font-size: 16px;
    font-weight: 700;
    margin: 8px 0;
  }
  .desc{
    color: #69707d;
    font-size: 14px;
  }
}
</style>
