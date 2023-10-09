<template>
  <el-tooltip effect="dark" :content="tipText" placement="top">
    <i class="el-icon-question" style="margin-left: 5px;"></i>
  </el-tooltip>
</template>
<script>
export default {
  props: {
    tipText: {},
  },
};
</script>
