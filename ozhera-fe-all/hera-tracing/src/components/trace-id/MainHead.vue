<!--
 * @Description: 
 * @Date: 2022-02-08 19:34:21
 * @LastEditTime: 2023-09-06 16:30:34
-->
<template>
  <!-- 头部 -->
  <div class="main-head">
    <div class="main-title">{{ $t("callLink") }}</div>
    <div class="head-status-tip">
      <div class="status-container">
        <span class="status-circle status-circle-success"></span
        >{{ $t("normal") }}
      </div>
      <div class="status-container">
        <span class="status-circle status-circle-error"></span
        >{{ $t("abnormal") }}
      </div>
      <!-- <div class="status-container">
          <span class="status-circle status-circle-warn"></span>警告
        </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "MainHead",
};
</script>

<style lang="scss" scoped>
@import "../../style/theme.scss";
// 头部
.main-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 5px 10px 20px;
  line-height: 28px;
  border-top: 1px solid #e9e9e9;
  border-bottom: 1px solid #e9e9e9;
  font-size: 14px;
  .main-title {
    font-family: PingFangSC-Medium;
    font-weight: 650;
    color: $deep-black-color;
  }
  .head-status-tip {
    display: flex;
    align-items: center;
    color: $deeper-black-color;
    .status-container {
      padding-right: 15px;
      display: flex;
      align-items: center;
    }
    .status-circle {
      margin-right: 5px;
    }
  }
}
</style>
