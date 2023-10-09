<template>
  <el-form-item :prop="'rules.' + index + '.alert'" v-if="strategyType==2" 
  class="promql-title"
  :rules="titleRule"
  label='标题' style="margin-bottom:20px;">
    <el-input v-model="val" placeholder="请输入标题" class="title-input" :maxlength="30"
    :disabled="disabled"></el-input>
  </el-form-item>
</template>
<script>
export default {
  props:{
    index:{
      required: true
    },
    strategyType:{
      required: true
    },
    value:{},
    disabled:{

    }
  },
  data(){
    var validateTitle=(rule,value,cb)=>{
      if(!value){
        cb(new Error('请输入标题！'));
      }else{
        const regex = /[\s，,]+/;
        const isReg = regex.test(value);
        if(isReg) cb(new Error('标题中不能包含空格、中文逗号、英文逗号！'))
      }
      cb();
    }
    return{
      titleRule:{
        validator:validateTitle, trigger: 'change'
      }
    }
  },
  computed:{
    val:{
      get(){
        return this.value
      },
      set(value){
        this.$emit('input', value)
      }
    }
  }
}
</script>
<style scoped>
.title-input{
  width: 400px;
}
</style>