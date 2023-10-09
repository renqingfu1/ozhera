<template>
  <el-select v-model="val" remote 
  filterable placeholder="请输入通知组名称"   :remote-method="searchGroup" 
  class="select-group">
    <el-option
      v-for="item in alarmGroupOptions"
      :key="item.id"
      :label="item.name"
      :value="item.name">
    </el-option>
  </el-select>
</template>
<script>
import server from "@/api/service/heart-beat";
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
        this.$emit('input',val)
      }
    }
  },
  data(){
    return {
      alarmGroupOptions:[]
    }
  },
  mounted(){
    this.searchGroup();
  },
  methods:{
    searchGroup(name){
      server.searchGroupApi({name}).then(res=>{
        this.alarmGroupOptions = res.list;
      }).catch(err=>{
        console.log('err', err);
      })
    }
  },
}
</script>