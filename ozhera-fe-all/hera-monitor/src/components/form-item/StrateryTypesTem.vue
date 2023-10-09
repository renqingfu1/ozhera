<template>
  <div class="btn-box">
    <el-button  v-for="item in strategyOptions" :key="item.value" 
      :class="item.value==btnValue?'active':'not-active'"
      :type="item.value==btnValue?'primary':''"
      plain
      @click="clickBnt(item.value)"
      :disabled="disabled"
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
      strategyOptions: (state) => state.moduleStrategyList.strategyOptionsTem, 
    }),
    btnValue(){
      return this.value;
    },
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
.btn-box >>> .el-button:nth-child(2).not-active{
  border-left: none;
}
.btn-box >>> .el-button:nth-child(1).not-active{
  border-right: none;
}
</style>