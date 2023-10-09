<template>
  <div class="hera-title">
    {{text}}
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
    },
  },
};
</script>
<style scoped>
.hera-title{
  height: 52px;
  background: #fff;
  padding: 17px  2px  0px 20px;
  font-weight: 650;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.847058823529412);
}
</style>
