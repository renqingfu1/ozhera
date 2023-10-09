<template>
  <el-select v-model="val" :placeholder="$t('pleaseSel')" value-key="id">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.pipelineName"
      :value="item">
    </el-option>
  </el-select>
</template>
<script>
import HeartBeatServer from '@/api/service/heart-beat.js';
export default {
  props:{
    value:{},
    configedPipeLineId:{
      required: true,
      type: Array
    }
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
      options:[]
    }
  },
  mounted(){
    this.getOptions();
  },
  methods:{
    getOptions(){
      let self = this;
      let appId = this.$route.params.projectId;
      HeartBeatServer.getEnvOptions({appId}).then(({list})=>{
        let unConfig = list.filter((item)=>{
          return self.configedPipeLineId.indexOf(item.id+'')<0
        })
        this.options =unConfig||[];
      })
    }
  }
}
</script>