<template lang="">
  <div class="mi-desciption">
    <span class="desciption-key">{{label}}</span>
    <div class="desciption-value">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    label: {},
  },
};
</script>
<style lang="scss" scoped>
.mi-desciption{
  display: flex;
  font-size: 14px;
  line-height: 20px;
}
.desciption-key{
  margin-right:10px;
  display: inline-block;
  width:80px;
}
</style>
