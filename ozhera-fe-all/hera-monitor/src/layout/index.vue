<template>
  <div class='layout-container'>
    <!-- 头部 -->
    <!-- <header class='layout-container-header'>
      <layHeader/>
    </header> -->

    <!-- 中部 内容区 -->
    <section class='layout-container-main'>
      <aside class='left'>
        <aside-menu/>
      </aside>
      <aside class='right' :class="expandAside ? '': 'fixWidth'" id="rightBox">
        <keep-alive>
          <router-view v-if="$route.meta && $route.meta.keepAlive" />
        </keep-alive>
        <router-view v-if="!$route.meta || !$route.meta.keepAlive" />
      </aside>
    </section>
  </div>
</template>

<script>
// import layHeader from './components/header' 
import asideMenu from './components/aside-menu'
import { mapState } from 'vuex'

export default {
  data() {
    return {}
  },
  components: {
    // layHeader,
    asideMenu
  },
  computed: {
    ...mapState('menu',['expandAside'])
  }
}
</script>

<style lang="less">
.layout-container {
  height: 100%;
  background: #f2f2f2;
  &-header {
    width: 100%;
    height: 58px;
    box-shadow:0px 3px 6px 0px rgba(0,0,0,0.06);
    // position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
  }
  &-main {
    height: calc(100vh - 50px);
    display: flex;
    overflow: hidden;
    .left {
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
      box-shadow: 0px 3px 5px rgba(170,170,170,0.27);
      position: relative;
      background: #fff;;
      z-index: 9;
    }
    .right {
      width: calc(100% - 235px);
      box-sizing: border-box;
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
    }
    .right.fixWidth {
      width: calc(100% - 58px)
    }
  }
}
</style>
