<template>
  <div class="admin-box">
    <div class="admin-header-inner">
      <Header />
    </div>
    <el-container class="app-box">
      <el-container class="contian-box contain-box-layout">
        <div class="contianer">
          <el-aside width="236px" class="back-fff">
            <Menu />
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
import Menu from '@/components/Menu/index.vue';
import Home from '@/views/Home.vue';
import Header from '@/components/Header.vue';

export default {
  components: { Menu, Header, Home },
};
</script>
<style lang="scss" scoped>
header {
  background-image: linear-gradient(270deg, #4b88e5, #03abf3 0, #4474f1);
}
.admin-header-inner{
  margin: 0 auto;
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
.admin-box{
  height: 100%;
}
.home-box{
  width: calc(100% - 237px);
  padding:0 0 20px 0;
}
</style>
