<template>
  <el-select v-model="logType" :placeholder="$t('setLogType')" v-bind="$attrs">
    <el-option
      v-for="item in typeOptions"
      :key="item.value"
      :label="item.label"
      :value="item.type">
    </el-option>
  </el-select>
</template>
<script>
export default {
  props: {
    value: {},
    options: {
      required: true,
    },
  },
  computed: {
    logType: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    typeOptions: {
      get() {
        return this.options;
      },
    },
  },
};
</script>
