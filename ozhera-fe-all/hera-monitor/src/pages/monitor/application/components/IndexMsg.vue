<template>
  <div class="tab-right">
    <el-tooltip effect="dark" placement="top-start">
      <div slot="content">
        {{ $t('dangerExplain') }}<br />
        {{ $t('warningExplain') }}<br />
        {{ $t('healthExplain') }}<br />
      </div>
      <div class="tooltip-inner">
        <ul class="tab-right-list">
          <li><i class="danger" /> {{ $t('danger') }}</li>
          <li><i class="warning" /> {{ $t('warning') }}</li>
          <li><i class="fit" /> {{ $t('health') }}</li>
        </ul>
        <i class="tab-right-tip el-icon-question"></i>
      </div>
    </el-tooltip>
  </div>
</template>
<style lang="less" scoped>
.tab-right {
  display: flex;
  align-items: center;
  color: #555;
  font-size: 14px;
  line-height: 38px;
  &-list {
    display: flex;
    align-items: center;
  }
  li {
    margin-left: 16px;
    i {
      display: inline-block;
      width: 15px;
      height: 15px;
      background-color: #52c41a;
      border-radius: 2px;
      vertical-align: -2px;
      margin-right: 5px;
      &.danger {
        background-color: #e14819;
      }
      &.warning {
        background-color: #ffaa02;
      }
    }
  }
  &-tip {
    padding: 6px;
    cursor: pointer;
    color: #7f7f7f;
  }
}
.tooltip-inner {
  display: flex;
  align-items: center;
}
</style>
