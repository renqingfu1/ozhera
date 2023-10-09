<template>
  <el-select v-model="val" placeholder="请选择域名" class="contain-domain" multiple>
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import server from "@/api/service/alarm-srategy.js"
export default {
  props:{
    value:{},
    app:{}
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
  watch:{
    app(val,oldVal){
      if(oldVal.projectId !== val.projectId){
        this.getOptions();
      }
    }
  },
  data() {
    return {
      options: [],
    }
  },
  mounted(){
    if(this.app.projectId) this.getOptions();
  },
  methods:{
    getOptions(){
      console.log('this.app', this.app);
      let {projectId,projectName} = this.app;
      server.getAppDomain( {projectId,projectName}).then((res)=>{
        let resData = (res|| []).map(item=>{
          return {
            label:item,
            value:item
          }
        });
        this.options = resData;
      })
    }
  }
}
</script>
<style lang="less" scoped>
.contain-domain{
  vertical-align: top;
  width: 385px;
}
</style>
