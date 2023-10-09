<template>
  <div :class="['title_wrap', {'border': border}, size]">
    <span class="txt">
      <slot>{{title}}</slot>
    </span>
    <div class="button">
      <slot name="button"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'i-title',
  props: {
    title: String,
    border: {
      type: Boolean,
      default: false
    },
    size: String
  },

  data() {
    return {}
  }
}
</script>
<style scoped lang="less">
.title_wrap {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 10px 16px;
  height: 52px;
  line-height: 52px;
  align-items: center;
  background: #fff;
  &.border {
    border-bottom: 1px solid rgba(221, 221, 221, 1);
  }
  .txt {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: 0;
    line-height: 20px;
    font-weight: 650;
  }

  .button {
    margin-left: auto;
    cursor: pointer;
  }
  & + .el-form {
    margin-top: 0;
  }
  [class*=" el-icon-"], [class^=el-icon-] {
    font-size: 18px;
    vertical-align: -1px;
    cursor: pointer;
  }
  &.small {
    .txt {
      font-size: 14px;
      font-weight: 400;
    }
  }
  &.mini {
    .txt {
      font-size: 12px;
      font-weight: 400;
    }
  }
}
</style>
