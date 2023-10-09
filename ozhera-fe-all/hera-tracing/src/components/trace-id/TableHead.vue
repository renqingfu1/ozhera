<!--
 * @Description: 
 * @Date: 2022-02-09 11:55:36
 * @LastEditTime: 2023-09-06 16:44:29
-->
<template>
  <div class="c-table-head">
    <div class="c-table-th" style="width: 260px">
      {{ $t("applicationName") }}
    </div>
    <div class="c-table-th" style="width: 50px">
      {{ $t("state") }}
    </div>
    <div class="c-table-th" style="width: 240px">
      {{ $t("method") }}
    </div>
    <div class="c-table-th flex-th">
      <div class="timeline">
        <span>0</span>
        <span>{{ durationMs ? (durationMs / 1000).toFixed(2) : 1000 }}ms</span>
      </div>
    </div>
    <div class="c-table-th" style="width: 150px">
      {{ $t("timeConsuming") }}
    </div>
    <div class="c-table-th" style="width: 120px">
      {{ $t("example") }}
    </div>
    <div class="c-table-th" style="width: 70px">
      {{ $t("operate") }}
    </div>
  </div>
</template>

<script>
export default {
  name: "TableHead",
  props: {
    durationMs: {},
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/theme.scss";
@import "../../style/common.scss";
.c-table-head {
  display: flex;
  .c-table-th {
    border-top: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
    padding: 14px 10px 14px;
    background-color: #fafafa;
    color: $deeper-black-color;
    line-height: 20px;
    font-size: 14px;
    font-weight: bold;
    &:first-child {
    }
    &:last-child {
      border-right: 1px solid #ebeef5;
    }
  }
}
.flex-th {
  flex: 1;
}
//时间
.timeline {
  display: flex;
  justify-content: space-between;
}
</style>
