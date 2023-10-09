<template>
  <div class="container-box">
    <lone-module class="title">
      <span class="title-text">{{title}}</span>
    </lone-module>
    <div class="page-detail">
      <div class="detail-box">
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    title:{}
  },
}
</script>
<style scoped lang="less">
.page-detail {
  padding: 20px;
  .detail-box {
    background: #fff;
  }
}
</style>