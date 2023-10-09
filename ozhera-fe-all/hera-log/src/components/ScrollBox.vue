<template>
  <div class="scroll-box" ref="ScrollBox">
    <el-backtop target=".scroll-box" :bottom="100">
    <div
      style="{
        height: 100%;
        width: 100%;
        border-radius:20px;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
    >
      <i class="el-icon-arrow-up"></i>
    </div>
  </el-backtop>
    <slot/>
  </div>
</template>
<script>
export default {
  mounted() {
    this.bindScrollEvent();
  },
  methods: {
    bindScrollEvent() {
      const scrollBox = this.$refs.ScrollBox;
      scrollBox.addEventListener('scroll', () => {
        const realH = scrollBox.offsetHeight;
        const contentH = scrollBox.scrollHeight;
        const domScrollTop = scrollBox.scrollTop;
        if (contentH - domScrollTop <= realH + 100) {
          this.$emit('reqMore');
        }
      });
    },
  },
};
</script>
<style scoped>
.scroll-box{
  height: 100%;
  overflow-y:scroll;
}
</style>
