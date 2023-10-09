<template>
  <div class="user-box">
    <div class="user-header-inner" v-if="!powerByQiankun">
      <Header />
    </div>
    <el-container class="app-box">
      <el-container class="contian-box contain-box-layout">
        <div class="contianer">
          <el-aside  class="back-fff user-menu-box" width="auto">
            <UserMenu />
          </el-aside>
          <div class="home-box">
            <Home />
          </div>
        </div>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import UserMenu from '@/components/Menu/UserMenu.vue';
import Home from '@/views/Home.vue';
import Header from '@/components/Header.vue';

export default {
  components: { UserMenu, Header, Home },
  computed: {
    powerByQiankun() {
      // eslint-disable-next-line no-underscore-dangle
      return !!window.__POWERED_BY_QIANKUN__;
    },
  },
};
</script>
<style lang="scss" scoped>
header {
  background-image: linear-gradient(270deg, #4b88e5, #03abf3 0, #4474f1);
}
.user-header-inner {
  position: relative;
  margin: 0 auto;
  box-shadow: 2px 1px 7px rgba(0 ,0, 0,.2);
  z-index: 4;
}
.contian-box {
  justify-content: center;
  height: 100%;
}
.contianer {
  display: flex;
  width: 100%;
}
.el-aside {
  height: 100%;
}

.back-fff {
  background: #fff;
}
.user-box{
  height: 100%;
}
.home-box{
  float: left;
  width: 100%;
  // padding:0 0 20px 0;
  overflow: hidden;
}
.user-menu-box{
  float: left;
  position: relative;
  box-shadow: 0 3px 5px hsl(0deg 0% 67% / 27%);
}
</style>
