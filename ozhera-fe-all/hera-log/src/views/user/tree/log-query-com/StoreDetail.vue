<template>
  <div class="store-detail">
    <span class="store-name">{{store.logstoreName}}</span>
    <el-popover
      placement="bottom-start"
      popper-class="store-detail-pop"
      trigger="hover">
     <div class="info">
      <h3 class="title">基础信息</h3>
      <div class="store-ul">
        <div class="store">
          <p class="item"><span>{{ $t('serverRoom') }}：</span>
          <span>{{store.machineRoomName}}</span></p>
          <p class="item"><span>{{ $t('logType') }}：</span><span>{{store.logTypeName}}</span></p>
        </div>
        <div class="store">
          <p class="item"><span>存储分片数：</span><span>{{store.storePeriod}}</span></p>
          <p class="item"><span>数据存储时间：</span><span>{{store.shardCnt}}</span></p>
        </div>
      </div>
     </div>
      <i class="iconfont icon-ask" slot="reference"></i>
    </el-popover>
  </div>
</template>
<script>

export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  computed: {
    store() {
      return this.value;
    },
  },
};
</script>
<style scoped>
.store-detail{
  height: 25px;
  margin-bottom: 10px;
}
.store-name{
  margin-right: 3px;
  font-size: 18px;
  font-weight: 650;
  color: rgba(0,0,0,0.85);
}
</style>
<style lang="scss">
.el-popover.store-detail-pop{
  padding: 0;
  border-radius: 0;
  .title{
    border-bottom: solid 1px #d9d9d9;
    padding:0 16px ;
    height: 32px;
    line-height: 32px;
    color:rgba(0, 0, 0, 0.64);
    font-size: 12px;
    font-weight: 400;
  }
  .store-ul{
    padding:16px;
    span{
      font-size: 12px;
    }
    .item{
      display: inline-block;
    }
  }
  .store > .item:nth-child(1){
    width: 110px;
  }
}
</style>
