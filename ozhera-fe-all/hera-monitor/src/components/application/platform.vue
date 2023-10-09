<template>
  <el-tag class="platform-tag" type="info" effect="plain" 
    v-if="platFormOptions.filter(item=>item.value===platformType) &&
    platFormOptions.filter(item=>item.value===platformType)[0] &&  
    platFormOptions.filter(item=>item.value===platformType)[0].label">
    {{platFormOptions.filter(item=>item.value===platformType)[0].label}}</el-tag>
</template>
<script>
import {mapState} from 'vuex';
export default {
  props:{
    platformType:{
      require: true,
      type: Number
    }
  },
  computed:{
    ...mapState({
      platFormOptions: (state) => state.modulePlatForm.platFormOptions,
    }),
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
