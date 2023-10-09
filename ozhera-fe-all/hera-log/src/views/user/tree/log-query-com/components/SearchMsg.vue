<template>
  <div v-show="showMsg" class="quotation-inner">
    <p class="msg-p">
      搜索词含有中文引号或中文冒号，结果可能不符合预期
      <el-button type="text" class="change-btn"
      @click="changeEn">
        <i class="el-icon-refresh"></i>
        <span>转为英文符号</span>
      </el-button>
    </p>
    <div class="popper__arrow"></div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
    },
  },
  computed: {
    showMsg() {
      return this.value;
    },
  },
  methods: {
    changeEn() {
      this.$emit('changeEn');
    },
  },
};
</script>
<style lang="scss" scoped>
.quotation-inner{
  position: absolute;
  top: -32px;
  left: 50%;
  transform: translate(-50%,0);
}
.popper__arrow{
  width: 0;
  height: 0;
  border: 4px solid;
  border-color:  #F56C6C transparent transparent;
  margin:0 auto;
}
.msg-p{
  border: solid 1px #F56C6C;
  border-radius: 4px;
  padding: 3px 5px;
  font-size: 12px;
  color:#F56C6C;
  background: #fef0f0;
  white-space: nowrap;
}
.change-btn{
  padding:0;
  font-weight: normal;
}
.change-btn [class*=el-icon-]+span{
  margin-left: 1px;
}
</style>
