<template>
   <el-checkbox v-model="checked" v-bind="$attrs"></el-checkbox>
</template>

<script>
export default {
  props: {
    value: {},
  },
  computed: {
    checked: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>
