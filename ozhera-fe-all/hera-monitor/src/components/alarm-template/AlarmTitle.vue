<template>
  <div>
    <p>
      <span class="title">{{strategyOptions.filter(item=>item.value==propStrategy)[0].label}}</span>
      <el-popover v-if="propStrategy==2"
        placement="top-start"
        title=""
        width="230"
        trigger="hover"
        :content="$t('metixPage.tips')">
        <span slot="reference" class="tips"><i class="iconfont icon-question" style="font-size:18px"></i></span>
      </el-popover>
    </p>
  </div>
</template>
<script>
export default {
  props:{
    strategyType:{
      require:true
    }
  },
  computed:{
    propStrategy(){
      return this.strategyType
    }
  },
  data(){
    return{
      strategyOptions:[ 
        {value: 0, label: this.$t('policyPage.basicMonitor')},
        {value: 1, label: "接口类监控"},
        {value: 2, label: "自定义PromQL"},
        {value: 3, label: "接口类监控"},
      ]
    }
  }
}
</script>
<style scoped>
.title {
  font-size: 14px;
  font-weight: 650;
  color: rgba(0, 0, 0, 0.847058823529412);
  margin-right: 5px;
}
</style>