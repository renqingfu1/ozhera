<template>
  <div class="scroll-box" ref="ScrollBox">
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
      let _this = this;
      scrollBox.addEventListener('scroll',_this.scrollCB);
    },
    scrollCB(){
      const scrollBox = this.$refs.ScrollBox;
      const realH = scrollBox.offsetHeight;
      const contentH = scrollBox.scrollHeight;
      const domScrollTop = scrollBox.scrollTop;
      if (contentH - domScrollTop <= realH + 100) {
        this.$emit('reqMore');
      }
    },
    scrollToTop(){
      const scrollBox = this.$refs.ScrollBox;
      scrollBox.scrollTop = 0;
    }
  },
  beforeDestroy(){
    let _this = this;
    const scrollBox = this.$refs.ScrollBox;
    scrollBox.removeEventListener("mousemove", _this.scrollCB);
  }
};
</script>
<style scoped>
.scroll-box{
  height: 100%;
  overflow-y:scroll;
}
</style>
