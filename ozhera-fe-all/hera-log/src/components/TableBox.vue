<template>
    <div class="table-box">
        <header class="table-box-header" v-if="showHeader">
            <slot name="header"></slot>
        </header>
        <el-main>
          <div class="table-box-main-inner" :class="innerClass" >
            <slot></slot>
          </div>
        </el-main>
    </div>
</template>
<script>
export default {
  props: {
    showHeader: {
      type: Boolean,
      default: true,
    },
    innerClass: String,
  },
};
</script>
<style scoped >
.table-box-header {
  display: flex;
  padding-left: 20px;
  height: 50px;
  align-items: center;
  background: #fff;

}
.table-box-header  >>>.el-breadcrumb__item .el-breadcrumb__inner{
  font-size: 16px;
  color: rgba(0,0, 0, 0.85);
  font-weight: 500;
}
.table-box-main-inner{
  padding:20px;
  background: #fff;
}
</style>
