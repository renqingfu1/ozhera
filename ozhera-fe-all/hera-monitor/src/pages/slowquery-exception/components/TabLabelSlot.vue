<template>
  <span class="slow-tab-label" :class="showRedPoint?'red-pointe':''">{{text}}</span>
</template>
<script>
export default {
  props:{
    label:{
      default:'tab 标题'
    },
    num:{}
  },
  computed:{
    text(){
      return this.label
    },
    showRedPoint(){
      return this.num>0?true:false
    },
    cutNum(){
      return this.num;
    }
  }
}
</script>
<style lang="less" scoped>
.slow-tab-label{
  position: relative;
}
.red-pointe::after{
  position: absolute;
  right: -7px;
  top: -3px;
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #F56C6C;
}
</style>