<template>
  <el-select v-model="selected" :placeholder="$t('pleaseSel')" @change="changeSel" size="mini"
    style="width:95px;line-height:28px;vertical-align:top;"
  >
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
    value:{
      default:true,
      type: Boolean
    }
  },
  computed:{
    selected:{
      get(){
        return this.value
      },
      set(val){
        return val
      }
    }
  },
  data(){
    return {
      options:[{
        label:'=',
        value:true
      },{
        label:'!=',
        value:false
      }]
    }
  },
  methods:{
    changeSel(val){
      this.$emit('input',val);
    }
  }
}
</script>