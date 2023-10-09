<template>
  <div class="main">
    <Home/>
  </div>
</template>
<script>
import Home from '../../views/Home.vue';

export default {
  components: { Home },
};

</script>
<style lang="scss" scoped>
.main{
  height: 100%;
}
header{
  background-image: linear-gradient(270deg,#4b88e5,#03abf3 0,#4474f1);
}
.contian-box{
  justify-content: center;
  padding: 20px 0;
  height: calc(100% - 60px);
}
.contianer{
  display: flex;
  width:100%;
  padding: 0 20px;
}
.el-aside{
  height: 100%;
}

</style>
