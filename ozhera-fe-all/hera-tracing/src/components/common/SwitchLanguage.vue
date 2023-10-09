<!--
 * @Description: 
 * @Date: 2023-09-06 15:37:26
 * @LastEditTime: 2023-09-06 16:56:48
-->
<template>
  <el-dropdown @command="switchLanguage">
    <span class="change-canguage-link">
      {{ $t("tracingLanguage") }}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh">中文</el-dropdown-item>
        <el-dropdown-item command="en">English</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
export default {
  name: "switchLanguage",

  mounted() {},
  methods: {
    // 切换中英文
    switchLanguage(val) {
      localStorage.setItem("tracingLanguage", val);
      this.i18n.locale.value = val;
    },
  },
};
</script>

<style scoped lang="scss">
.change-canguage-link {
  cursor: pointer;
  &:hover {
    color: #1890ff;
  }
}
</style>
