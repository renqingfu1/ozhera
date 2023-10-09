<template>
  <div :class="['home',this.$route.name==='log'?'log-query':'']">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'Home',
};
</script>
<style scoped>
.home{
  width: 100%;
  height: 100%;
  overflow: auto;
}
.log-query{
  overflow-y: initial;
  overflow-x: hidden;
}

</style>
