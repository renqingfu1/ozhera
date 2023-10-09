<template>
  <div class="empty-box">
    <p class="empty-tip">点击左侧字段以开始</p>
    <img :src="charImg" alt="empty-img" class="empty-img">
  </div>
</template>
<script>
import charImg from '@/assets/chart.png';

export default {
  data() {
    return {
      charImg,
    };
  },
};
</script>
<style scoped>
.empty-tip{
  font-weight: 700;
  color:rgb(105, 112, 125);
  font-size: 24px;
}
.empty-box{
  position: absolute;
  width: 230px;
  height: 230px;
  top: 50%;
  left:50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.empty-img{
  width: 176px;
  height: auto;
  margin-top: 30px;
}
</style>
