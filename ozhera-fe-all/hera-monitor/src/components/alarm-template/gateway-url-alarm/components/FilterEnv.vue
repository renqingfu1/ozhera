<template>
  <el-select v-model="val" placeholder="请选择环境" size="mini" clearable>
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>
<script>
  export default {
    props:{
      value:{}
    },
    computed:{
      val:{
        get(){
          return this.value;
        },
        set(val){
          this.$emit('input',val);
        }
      }
    },
    data() {
      return {
        options: [{
          value: true,
          label: '预发环境',
        }, {
          value: false,
          label: '非预发环境'
        }],
      }
    }
  }
</script>