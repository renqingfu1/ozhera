<!--
  弹窗组件：基于el-pagination、内置slot
 -->
<template>
  <el-dialog
    :title='title'
    :visible.sync="dialogVisible" 
    :modal='modal' 
    :show-close='showClose'
    :width='width' 
    :top='marginTop'>
    <slot/>
  </el-dialog>
</template>

<script>
export default {
  name: 'lone-dialog',
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      required: true
    },
    // 全局遮罩层
    modal: {
      type: Boolean,
      required: false,
      default: false
    },
    // 关闭按钮
    showClose: {
      type: Boolean,
      required: false,
      default: false
    },
    width: {
      type: String,
      required: false,
      default: '420px'
    },
    marginTop: {
      type: String,
      required: false,
      default: '30vh'
    }
  }
}
</script>

<style lang='less' scoped>

</style>