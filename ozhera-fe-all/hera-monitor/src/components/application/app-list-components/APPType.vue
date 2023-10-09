<template>
  <el-tag class="platform-tag" type="info" effect="plain">{{ ownerText }}</el-tag>
</template>
<script>
export default {
  props:{
    owner:{
      require: true,
    }
  },
  computed:{
    ownerText(){
      return this.owner?this.$t('participation'):this.$t('attention')
    }
  },
}
</script>
<style scoped>
.platform-tag{
  vertical-align: middle;
  padding:0 5px;
  height: 18px;
  line-height: 18px;
  border-radius: 0;
  vertical-align: baseline;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>
