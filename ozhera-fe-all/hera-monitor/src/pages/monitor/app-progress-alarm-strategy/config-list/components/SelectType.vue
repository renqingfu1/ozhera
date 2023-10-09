<template>
  <el-select v-model="val" placeholder="请选择心跳类型" @change="change">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>
<script>
import typeList from '../js/common.js';

  export default {
    props:{
      value:{}
    },
    computed:{
      val:{
        get(){
          return this.value
        },
        set(val){
          this.$emit('input',val);
        }
      }
    },
    data() {
      return {
        options: typeList,
      }
    },
    methods:{
      change(val){
        this.$emit('change',val);
      }
    }
  }
</script>