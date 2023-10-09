<template lang="">
  <el-popover
    placement="top"
    width="360"
    trigger="hover">
    <div>
      <p>1、配置uri为API的/mtop/{groupName}/之后的部分，如a/b/c；</p>
      <p>2、通配符使用.*，如a/b.*代表以a/b开头的所有uri；</p>
    </div>
    <i slot="reference" class="iconfont icon-ask" ></i>
  </el-popover>
</template>
<script>
export default {}
</script>
<style lang="less" scope>
.icon-ask{
  color:#b1b1b1;
  margin-left: 10px;
}
</style>