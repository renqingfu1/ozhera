<template>
  <el-container style="height: 100%;" class="menu-contain">
    <el-aside width="236px" >
      <el-menu :default-active="activeIndex" class="menucomp">
        <el-menu-item v-for="item in menuList" :index="item.id" :key="item.id"
        class="trace-menu-item">
            <router-link :to="item.path" slot="title" class="menu-a">
              <i :class="[iconClass,item.icon]"></i>
              <span class="group-label" >{{ $t(`menuLayout.${item.label}`) }}</span>
            </router-link>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container >
      <el-main class="main-box">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      iconClass: 'iconfont-qiankun-config',
    };
  },
  computed: {
    ...mapState('moduleMenu', ['menuList', 'activeIndex']),
  },
  methods: {
    ...mapMutations('moduleMenu', ['setActive']),
  },
  mounted() {
    const pathArr = this.$route.path.split('/'); // 只把第一个地址传过去
    const routeActive = `/${pathArr[1]}`;
    this.setActive(routeActive);
  },
  watch: {
    $route(to, from) {
      console.log('route----->>>', to, from);
    },
  },
};
</script>
<style lang="less" scoped>
.el-header {
  background-color: #fff;
  color: #333;
  line-height: 60px;
}
.group-label{
  margin-left: 5px;
}
.menu-contain .el-aside{
  position: relative;
  /* height: 100%; */
  background: #fff;
  box-shadow: 0px 3px 5px rgba(170,170,170,0.27);
}
.el-aside .el-menu{
  border-right: none;
}
.menu-contain .main-box{
  height: 100%;
  overflow-y: auto;
}

.menucomp .el-menu-item:hover{
  background: #fff;
}
.el-menu-item:hover a,.el-menu-item:hover a>i{
  color:#1890ff;
}

.trace-menu-item{
  padding:0 !important;
  .menu-a{
    display:block;
    padding:0 20px;
  }
  .router-link-active{
    color:var(--ant-primary-color);
  }
  .router-link-active>i{
    color:#1890ff;
  }
}
</style>
