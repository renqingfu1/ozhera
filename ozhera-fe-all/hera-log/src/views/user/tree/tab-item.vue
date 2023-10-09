<template>
  <div class="tab-item">
    <div v-if="type === 'storeDetail'" class="tab-item-contain ">
      <div class="tab-item-store">
        <TabStore :content= "content"/>
        <!-- content 需要spaceId storeId -->
      </div>
    </div>
    <div v-if="type === 'tailDetail'" class="tab-item-contain">
      <div class="tab-item-tail">
        <TabTail :content= "content"/>
        <!-- content 需要spaceId storeId tailId -->
      </div>
    </div>
    <div v-if="type === 'search'" class="user-log-query">
      <LogQuery page="spaceTree" :storeId ="parseInt(content.storeId)"/>
    </div>
    <div v-if="type === 'progress'" class="log-progress">
        <!-- content 需要storeId -->
      <LogProgress :store="content"/>
    </div>
    <div v-if="type === 'analysis'" class="log-progress">
      <AnalysisIndex/>
    </div>
  </div>
</template>
<script>
import LogQuery from '@/views/user/tree/log-query.vue';

import LogProgress from '@/views/user/tree/LogProgress.vue';
import TabStore from '@/views/user/tree/TabStore.vue';
import TabTail from '@/views/user/tree/TabTail.vue';
import AnalysisIndex from '@/views/user/tree/analysis/analysis-index.vue';

export default {
  components: {
    LogQuery,
    LogProgress,
    TabStore,
    TabTail,
    AnalysisIndex,
  },
  props: {
    content: {
      require: true,
      type: Object,
    },
    type: {
      require: true,
      type: String,
    },
  },
  data() {
    return {
      cannotEditStore: true,
    };
  },
  methods: {
    returnLabel(val) {
      const filter = this.$store.state.moduleLogconfig.logTypeOptions.filter(
        (item) => item.type === val,
      );
      return (filter[0] && filter[0].label) || '';
    },

  },
};
</script>
<style  scoped>
.tab-item{
  height: 100%;
}
.tab-item-contain{
  padding:0 0 0 20px;
  height: 100%;
  overflow-y: scroll;
}
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand >>> .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
  height: 40px;
}
.demo-table-expand >>> label {
  width: 120px;
  height: 39px;
  line-height: 39px;
  color: #99a9bf;
}

.tab-item-form-description{
  width: 990px;
}
.tab-item-form-description >>> .demo-table-expand{
  border-right: solid 1px #ebeef5;
  border-bottom:  solid 1px #ebeef5;
}
.tab-item-form-description >>> .el-form-item{
  border: solid 1px #ebeef5;
  border-bottom:none ;
  border-right:none ;
  /* padding-left: 5px; */
}
.tab-item-form-description >>> .el-form-item__content{
  padding-left: 5px;
  height: 40px;
  line-height: 40px;
}
.tab-item-form-description >>>  .el-form-item__label{
  border-right: solid 1px #ebeef5;
  padding-left: 5px;
  color:#909399;
  background-color: #fafafa;
  font-weight: 400;
}
.title{
  margin-bottom: 10px;
}
.tab-item-tail{
  width: 800px;
  padding-bottom: 20px;
}
.tab-item-store{
  width: 550px;
}
.user-log-query{
  height: 100%;
}
.log-progress{
  height: 100%;
  overflow-y: scroll;
}

</style>
