<template>
  <el-tooltip effect="dark" :content="$t('policyPage.toPersonelTips')" placement="top">
    <el-button :type="btnType||''" size="small" @click="clickAdd">
      {{ $t('policyPage.addToPersonnel') }}
    </el-button>
  </el-tooltip>
</template>
<script>
export default {
  props:{
    type:{}
  },
  computed:{
    btnType(){
      return this.type;
    }
  },
  methods:{
    clickAdd(){
      this.$emit('click');
    }
  }
}
</script>