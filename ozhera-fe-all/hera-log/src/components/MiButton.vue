<template>
  <div class="mi-btn" @click.stop="$emit('click')">
    <i :class="[icon]"></i>
    <span class="text"><slot></slot></span>
  </div>
</template>
<script>
export default {
  props: {
    icon: {},
  },
};
</script>
<style scoped>
.mi-btn{
  color:rgba(0,0,0,0.64);
  cursor: pointer;
  font-size: 12px;
}
.mi-btn .iconfont{
  font-size: 12px;
}

.text{
  margin-left:2px;
}
</style>
