<template>
    <div class="user-box-main">
      <Header/>
      <div class="user-box-contian">
        <router-view></router-view>
      </div>
    </div>
</template>
<script>
import Header from '@/components/Header.vue';

export default {
  components: {
    Header,
  },
};
</script>
<style scoped>
.user-box-main{
  height: 100%;
  overflow-y: scroll;
  font-size: 0;
  min-width: 1024px;
}
.user-box-contian{
  height: 100%;
  overflow-y: scroll;
  font-size: 12px;
}
</style>
