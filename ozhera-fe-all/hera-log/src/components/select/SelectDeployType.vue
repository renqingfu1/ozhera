<template>
  <el-select v-model="val" placeholder="请选择部署方式" >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>
<script>
import { getMQConfigOptionsApi } from '@/common/req/list/logConfig';

export default {
  props: {
    value: {
      default() {
        return '';
      },
    },
  },
  data() {
    return {
      options: [],
    };
  },
  computed: {
    val: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
        this.$emit('change', value);
      },
    },
  },
  mounted() {
    this.getOptions();
  },
  methods: {
    async getOptions() {
      const res = await getMQConfigOptionsApi({ codes: ['1007'] });
      this.options = res.data['1007'];
    },
    // changeVal(val) {
    //   this.$emit('input', val);
    // },
  },
};
</script>
