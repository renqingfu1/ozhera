<template>
  <div class="footer-col" @click="$emit('click')">
    <i>{{text}}</i><i class="iconfont icon-lianjie_o"></i>
  </div>
</template>
<script>
export default {
  props:{
    label:{
      default:'文案'
    }
  },
  computed:{
    text(){
      return this.label;
    }
  }
}
</script>
<style lang="less" scoped>
.footer-col {
  cursor: pointer;
  flex:1;
  font-size: 12px;
  height: 32px;
  line-height: 32px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  &:after {
    position: absolute;
    content: '';
    right: 0;
    top:8px;
    width: 1px;
    height: 18px;
    background: #e9e9e9;
  }
  &:last-child:after {
    display: none;
  }
  &:hover i {
    color: #1890FF;
  }
  i{
    font-style: normal;
  }
}
</style>
