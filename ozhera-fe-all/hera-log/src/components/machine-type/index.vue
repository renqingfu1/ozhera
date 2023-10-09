<template>
  <el-select
    v-model="machineType"
    placeholder="请选择机器类型"
    @change="changeMechineType"
    :disabled="disabled"
    :size="size"
  >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
    </el-option>
  </el-select>
</template>
<script>
export default {
  props: {
    value: {
      default() {
        return null;
      },
    },
    disabled: {
      type: Boolean,
    },
    size: {
      type: String,
      default: 'mini',
    },
  },
  computed: {
    machineType: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  data() {
    return {
      options: [
        {
          value: 0,
          label: '容器',
        },
        {
          value: 1,
          label: '物理机',
        },
      ],
    };
  },
  methods: {
    changeMechineType(value) {
      this.$emit('changeMachineType', value);
    },
  },
};
</script>
