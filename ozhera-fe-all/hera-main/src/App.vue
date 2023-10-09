<template>
  <div id="main-root">
    <div>
      <MainMenu />
    </div>
    <div id="root-view" class="app-view-box" v-html="content"></div>
  </div>
</template>
<script>
import MainMenu from '@/components/main-menu.vue';

export default {
  name: 'App',
  components: { MainMenu },
  props: {
    loading: Boolean,
    content: String,
  },
};
</script>

<style lang="less">

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
