<template lang="">
  <div class="title-tips">
    <h4>{{title}}</h4>
    <el-tooltip effect="dark" placement="right">
      <div slot="content" style="width:265px"
      v-bind:style="tipsWidthObj?tipsWidthObj:baseStyle">{{tips}}</div>
      <i class='el-icon-question'></i>
    </el-tooltip>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      require: true,
    },
    tips: {
      require: true,
    },
    tipsWidthObj: {},
  },
  data() {
    return {
      baseStyle: {
        width: 'auto',
      },
    };
  },
};
</script>
<style lang="less" scoped>
.title-tips{
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  color: rgba(0,0,0,0.85)
}
h4{
  font-size: 18px;
}
.el-icon-question{
  margin-left: 5px;
}
</style>
