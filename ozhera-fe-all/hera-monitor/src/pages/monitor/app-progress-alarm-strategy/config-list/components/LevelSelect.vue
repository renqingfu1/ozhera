<template>
  <el-select v-model="val" placeholder="请选择报警级别">
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
        return this.value
      },
      set(val){
        this.$emit('input',val);
      }
    }
  },
  data(){
    return {
      options:[{
        label:'P0',
        value:'P0'
      },{
        label:'P1',
        value:'P1'
      },{
        label:'P2',
        value:'P2'
      }]
    }
  },
}
</script>