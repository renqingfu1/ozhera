<template>
  <el-tooltip effect="dark"
  :content="`隐藏字段:${keyName}`" placement="top-start">
    <el-button type="text" style="margin-left:3px;"
      @click="changeSelKey()" icon="el-icon-remove-outline"></el-button>
  </el-tooltip>
</template>
<script>
export default {
  props: {
    keyName: {},
  },
  methods: {
    changeSelKey() {
      this.$emit('changeSelKey', {
        type: 'del',
        val: this.keyName,
      });
    },
  },
};
</script>
