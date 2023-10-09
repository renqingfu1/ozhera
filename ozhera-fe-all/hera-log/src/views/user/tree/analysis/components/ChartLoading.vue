<template>
  <div class="loading-box">
    <div class="loading-inner"></div>
  </div>
</template>
<style scoped>
.loading-box{
  position: absolute;
  width: 100%;
  height: 2px;
  overflow: hidden;
}
.loading-inner{
  position: absolute;
  background: #f662b4;
  width: 100%;
  height: 100%;
  left: -100%;
  border-radius: 8px;
  animation: mytransform 1.5s;
  animation-iteration-count:infinite;
}
@keyframes mytransform
{
  from {transform: translate(0,0);}
  to {transform: translate(200%,0);}
}

</style>
