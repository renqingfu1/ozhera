<template>
  <div class="btn-box">
    <el-button  v-for="item in strategyOptions" :key="item.value"
      :disabled="disabled" 
      :type="item.value==btnValue?'primary':''"
      :plain="item.value==btnValue?true:false"
      @click="clickBnt(item.value)"
    >{{item.label}}</el-button>
  </div>
</template>
<script>
import {mapState} from 'vuex';
export default {
  props:{
    value:{},
    disabled:{
      type:Boolean
    }
  },
  computed:{
    ...mapState({
      strategyOptions: (state) => state.moduleStrategyList.strategyOptions, 
    }),
    btnValue(){
      return this.value;
    }
  },
  data(){
    return {
      options:[],
    }
  },
  methods:{
    clickBnt(val){
      this.$emit('input',val);
      this.$emit('changeType',val);
    }
  }
}
</script>
<style scoped>
.btn-box{
  display: flex;
}
.btn-box >>> .el-button+.el-button{
  margin-left: 0;
}
.btn-box >>> .el-button:nth-child(1){
  border-right: none;
}
.btn-box >>> .el-button:nth-child(3){
  border-left: none;
}
</style>