<template>
  <el-select v-model="val" placeholder="请选择连接类型" @change="change">
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
    value: {

    },
  },
  computed: {
    val: {
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
      options: [{
        value: 'pwd',
        label: this.$t('usernamePassword'),
      }, {
        value: 'token',
        label: 'Token',
      }],
    };
  },
  methods: {
    change(val) {
      this.$emit('change', val);
    },
  },
};
</script>
