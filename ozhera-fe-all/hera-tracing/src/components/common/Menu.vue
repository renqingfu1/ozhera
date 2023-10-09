<!--
 * @Description: 
 * @Date: 2021-11-09 17:44:02
 * @LastEditTime: 2023-09-06 16:59:30
-->
<template>
  <div :class="['menu-container', isCollapse ? 'menu-close' : 'menu-open']">
    <div class="menu-fixed">
      <el-menu
        :default-active="activeIndex"
        class="menu-content"
        :collapse="isCollapse"
      >
        <el-menu-item
          :index="item.id"
          v-for="(item, index) in menuData"
          :key="item.id + index"
          @click="
            () => {
              menuClick(item);
            }
          "
        >
          <el-icon><i :class="['iconfont', item.iconClass]"></i></el-icon>
          <template #title>{{ $t(`${item.label}`) }}</template>
        </el-menu-item>
      </el-menu>
      <div class="menu-collapse" @click="collapseClick">
        <el-icon :size="20">
          <Expand v-show="isCollapse" />
          <Fold v-show="!isCollapse" />
        </el-icon>
      </div>
    </div>
  </div>
</template>
<script>
import { Fold, Expand } from "@element-plus/icons-vue";
export default {
  name: "Menu",
  components: {
    Fold,
    Expand,
  },
  data() {
    return {
      isCollapse: false,
      activeIndex: "1",
      menuData: [
        {
          id: "2",
          label: "traceIDQuery",
          path: "/traceid",
          iconClass: "icon-menu-traceid",
        },
        {
          id: "1",
          label: "applicationLinkQuery",
          path: "/",
          iconClass: "icon-menu-application-link",
        },
        // {
        //   id: "3",
        //   label: "拓扑图查询",
        //   path: "/topology",
        //   iconClass: "icon-menu-topology",
        // },
      ],
    };
  },
  watch: {
    $route: function () {
      const { name } = this.$route;
      if (name === "ApplicationLink") {
        this.activeIndex = "1";
        this.isCollapse = false;
      } else if (name === "TraceIdChild" || name === "TraceId") {
        this.activeIndex = "2";
        this.isCollapse = true; //收起左侧菜单
      } else if (name === "Topology") {
        this.activeIndex = "3";
        this.isCollapse = true; //收起左侧菜单
      }
      this.changeView();
    },
  },
  methods: {
    //菜单点击
    menuClick(item) {
      this.$router.push({
        path: item.path,
      });
    },
    //收缩点击
    collapseClick() {
      this.isCollapse = !this.isCollapse;
      this.$emitter.emit("isCollapse", this.isCollapse);
      this.changeView();
    },
    changeView() {
      this.$emitter.emit("changeView", this.isCollapse);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/theme.scss";
.menu-container {
  height: 100%;
  transition: 500ms;
  &.menu-close {
    width: 64px;
  }
  &.menu-open {
    width: 236px;
  }
  .menu-fixed {
    position: fixed;
    height: 100%;
    border-right: 1px solid #e6e6e6;
    z-index: 1;
  }
  .menu-content {
    height: 100%;
    padding-bottom: 60px;
    overflow: auto;
    border: none;
    .el-menu-item {
      color: $deeper-black-color;
      display: flex;
      align-items: center;
      .el-icon {
        width: 30px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .iconfont {
        width: 30px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .is-active {
      color: var(--themeColor);
    }
    &:not(.el-menu--collapse) {
      width: 236px;
    }
  }
  .menu-collapse {
    height: 60px;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-left: 20px;
    color: $lighter-black-color;
    position: absolute;
    bottom: 0px;
    &:hover {
      color: var(--themeColor);
    }
  }
}
</style>
