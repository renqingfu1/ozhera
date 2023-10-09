<template>
  <div class="footer-box">
    <el-button type="primary" @click="onSubmit('ruleForm')">提交</el-button>
    <el-button @click="cancle" v-if="hasCancle">{{ $t('cancle') }}</el-button>
  </div>
</template>
<script>
export default {
  props: {
    hasCancle: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    cancle() {
      this.$emit('switchShowDialog');
    },
    onSubmit(ruleForm) {
      this.$emit('submitCreate', ruleForm);
    },
  },
};
</script>
