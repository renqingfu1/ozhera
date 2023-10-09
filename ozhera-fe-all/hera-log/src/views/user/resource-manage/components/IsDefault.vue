<template lang="">
  <div class="is-default">
    <el-tag type="success" v-if="isDefault === 1">是</el-tag>
    <el-tag type="warning" v-else>否</el-tag>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      required: true,
    },
  },
  computed: {
    isDefault() {
      return this.value;
    },
  },
};
</script>
