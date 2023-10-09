<template lang="">
  <div class="top__item__icon" :class="index < 3 ? 'top__item__icon--high' : ''">
    <img v-if="index<3" :src="require('../images/'+index+'.png')" class="img-first-3"/>
    <template v-else>
      {{ index + 1 }}
    </template>
  </div>
</template>
<script>
export default {
  props: {
    index: {
      type: Number,
    },
  },
};
</script>
<style lang="scss" scoped>
.img-first-3{
  width: 28px;
}
.top__item__icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #fddd9a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  &--high {
    background-color: transparent;
  }
}

</style>
