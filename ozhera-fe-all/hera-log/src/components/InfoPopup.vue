<template>
  <el-popover
    placement="bottom-start"
    trigger="hover">
    <div class="container">
      {{message}}
      <slot></slot>
    </div>
    <i class="iconfont icon-ask ask-icon" slot="reference"></i>
  </el-popover>
</template>

<script>
export default {
  props: {
    message: {},
  },
};

</script>
<style lang="scss" scoped>
.container {
  max-width: 400px;
}
.container > div {
  line-height: 11.8;
}
.ask-icon {
  margin: 0 5px;
  vertical-align: middle;
}
</style>
