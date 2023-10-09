<template>
  <el-cascader
    :options="mqOptions"
    :size="size"
    clearable
    :props="{ checkStrictly: true }"
    v-model="mqVal"
    @change="changeVal"
    filterable
  ></el-cascader>
</template>
<script>
import { getMQConfigOptionsApi } from '@/common/req/list/logConfig';

export default {
  props: {
    machineRoom: {},
    appType: {
      required: true,
    },
    value: {},
    size: {
      type: String,
      default: 'mini',
    },
  },
  data() {
    return {
      mqOptions: [],
      mqVal: this.value,
    };
  },
  mounted() {
    this.getOptions();
  },
  methods: {
    getOptions() {
      const code = '1001';
      getMQConfigOptionsApi({ codes: [code], nameEn: this.machineRoom }).then((res) => {
        this.mqOptions = res.data[code];
      });
    },
    changeVal(val) {
      this.$emit('input', val);
    },
  },
};
</script>
