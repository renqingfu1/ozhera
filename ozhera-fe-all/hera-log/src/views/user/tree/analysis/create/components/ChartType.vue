<template>
  <el-select v-model="selected" placeholder="请选择图标类型" >
    <el-option
      v-for="item in chartTypes"
      :key="item.typeCode"
      :label="item.name"
      :value="item.typeCode">
    </el-option>
  </el-select>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  props: {
    value: {},
  },
  computed: {
    ...mapState({
      chartTypes: (state) => state.moduleChart.chartTypes,
    }),
    selected: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  data() {
    return {
    };
  },
  methods: {
    ...mapActions('moduleChart', ['GETCHARTTYPEOPTIONS']),
  },
  mounted() {
    this.GETCHARTTYPEOPTIONS();
  },
};
</script>
