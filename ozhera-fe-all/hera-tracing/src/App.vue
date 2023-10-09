<template>
  <div>
    <!-- <SwitchLanguage></SwitchLanguage> -->
    <div class="tracing-container">
      <Menu class="tracing-menu" />
      <div
        :class="[
          'tracing-content',
          isCollapse ? 'tracing-content-close' : 'tracing-content-open',
        ]"
      >
        <router-view :key="$route.fullPath" />
      </div>
    </div>
  </div>
</template>

<script>
// import SwitchLanguage from "./components/common/SwitchLanguage.vue";
import Menu from "./components/common/Menu.vue";

export default {
  components: {
    // SwitchLanguage,
    Menu,
  },
  data() {
    return {
      isCollapse: false,
    };
  },
  mounted() {
    const that = this;
    this.$emitter.on("changeView", function (data) {
      that.isCollapse = data;
    });
  },
  unmounted() {
    this.$emitter.off("changeView");
  },
};
</script>

<style>
@import "//at.alicdn.com/t/font_3079328_awenkh44ava.css";
</style>
<style lang="scss">
html,
body {
  height: 100%;
  background: #f2f2f2;
  font-size: 14px;
  min-width: 1200px;
}
#app {
  height: 100%;
  font-family: PingFangSC, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.tracing-container {
  display: flex;
  height: 100%;
}
.tracing-menu {
  background: #fff;
}
.tracing-content {
  transition: 500ms;
  &.tracing-content-close {
    width: calc(100% - 64px);
  }
  &.tracing-content-open {
    width: calc(100% - 236px);
  }
}
</style>
