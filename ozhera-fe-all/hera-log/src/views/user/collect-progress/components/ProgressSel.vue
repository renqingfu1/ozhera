<template>
  <el-select v-model="curVal" placeholder="请选择" >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>
<script>
export default {
  props: {
    value: {},
  },
  computed: {
    curVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
        this.$emit('change', val);
      },
    },
  },
  data() {
    return {
      options: [{
        value: 25,
        label: '25%',
      }, {
        value: 50,
        label: '50%',
      }, {
        value: 75,
        label: '75%',
      }, {
        value: 100,
        label: '100%',
      }],
    };
  },
};
</script>
