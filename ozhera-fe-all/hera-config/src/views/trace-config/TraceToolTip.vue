<template>
  <el-tooltip class="item" effect="dark" :content="tips" placement="top">
    <i class="el-icon-question"></i>
  </el-tooltip>
</template>
<script>
export default {
  props: {
    value: {},
  },
  computed: {
    tips() {
      return this.value;
    },
  },
};
</script>
<style lang="less" scoped>
.el-icon-question{
  font-size: 13px;
  line-height: 40px;
  margin-right: 2px;
}
</style>
