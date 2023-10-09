<template>
  <div>
    <el-form-item
      class="tail__item"
      :label="`${$t('createTail.EnvGrouping')}`"
    >
      <el-input v-model="envName" :disabled="true"></el-input>
    </el-form-item>
  </div>
</template>
<script>
export default {
  props: {
    env: {},
    ips: {},
  },
  computed: {
    envName() {
      return this.env;
    },
    ipsList() {
      return this.ips;
    },
  },
};
</script>
<style lang="scss" scoped>
.tail__item {
  ::v-deep .el-input--mini, .el-input-number--mini{
    width: 400px;
  }
  ::v-deep .el-form-item__label {
    font-size: 14px;
  }
}
</style>
