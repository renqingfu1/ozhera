<template>
  <el-select v-model="selVal"  v-bind="$attrs" size="mini" 
    @change="changeSelect"
  >
    <el-option
      v-for="item in listOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>
<script>
export default {
  props:{
    value:{},
    options:{
      require:true
    }
  },
  computed:{
    selVal:{
      get(){
        return this.value
      },
      set(newV){
        return newV
      }
    },
    listOptions(){
      return this.options;
    }
  },
  methods:{
    changeSelect(val){
      this.$emit('input',val);
    }
  }
}
</script>