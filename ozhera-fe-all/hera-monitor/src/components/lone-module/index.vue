<!--
  模块组件：内置slot、统一页面级组件样式
 -->
<template>
  <div :class='
        `module
        ${marginTop ? "margin-top" : ""}
        ${marginBottom ? "margin-bottom" : ""}`' >
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'lone-module',
  props: {
    marginTop: {
      type: Boolean,
      default: false
    },
    marginBottom: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang='less' scoped>
.module {
  background: #fff;
  padding: 17px;
  span{
    font-size: 15px;
    color: rgba(0,0,0,0.85);
    font-weight: 800;
  }
}

.margin-top {
  margin-top: 20px
}
.margin-bottom {
  margin-bottom: 10px
}
</style>
