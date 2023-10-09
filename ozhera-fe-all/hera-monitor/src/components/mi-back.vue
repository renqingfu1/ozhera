<template>
  <ITitle>
    <span @click="clickFn" style="cursor: pointer;">
      <i class="el-icon-arrow-left" />{{text}}
    </span>
  </ITitle>
</template>
<script>
import ITitle from '@/components/i-title/index';
export default {
  name: 'mi-back',
  components: {
    ITitle,
  },
  props:{
    text:{
      type: String
    }
  },
  methods:{
    clickFn(){
      this.$emit('click')
    }
  }
}
</script>
<style scoped>
.el-icon-arrow-left{
  margin-right: 20px;
  color:var(--ant-primary-color);
}
</style>