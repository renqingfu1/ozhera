<template>
  <el-select v-model="selectedVal" :placeholder="$t('selectApplicationPlaceholder')"
    @change="changeApp"
    size="small" 
    clearable
    value-key="projectName"
    filterable >
    <el-option
      v-for="item in appOptions"
      :key="item.projectId +'_'+ item.projectName"
      :label="item.projectName"
      :value="item">
    </el-option>
  </el-select>
</template>
<script>
import server from "@/api/service/alarm-srategy";
export default {
  props:{
    value:{

    }
  },
  data(){
    return {
      appOptions:[],
      searchAppParams:{
        needPage:false,
        appName:''
      },
    }
  },
  computed:{
    selectedVal:{
      get(){
        return this.value
      },
      set(newV){
        return newV
      }
    }
  },
  methods:{
    getAllApp(param){
      let params = {...this.searchAppParams,...{appName:param ||''}};
      server.getMyApp(params).then(res => {
        this.appOptions = res.list;
      });
    },
    changeApp(val){
      this.$emit('input',val);
    }
  },
  mounted(){
    this.getAllApp();
  }
}
</script>