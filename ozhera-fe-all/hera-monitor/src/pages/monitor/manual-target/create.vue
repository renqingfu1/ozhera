<template>
  <div>
    <el-form  label-width="80px" :model="formData" label-position="left" class="create-form" ref="createForm">
      <el-form-item :label="$t('metricPage.metricName')" prop="name" 
        :rules="[{ required: true, message: '请输入指标名称', trigger: 'blur' }]">
        <el-input v-model="formData.name"
        :placeholder="$t('policyPage.enterNotifyTemName')"
        style="width:200px" maxlength="12"></el-input>
      </el-form-item>
      <el-form-item label="PromQL" 
        prop="promql"
        :rules="[{ required: true, message: '请输入PromQL', trigger: 'blur' }]">
        <el-input v-model="formData.promql" placeholder="请输入PromQL" type="textarea" :rows="4"></el-input>
      </el-form-item>
      <div style="padding-left:80px" v-if="formData.promql.length>0">
        <el-button type="text" style="font-weight:normal;" @click="testPromQL(formData.promql)">{{ $t('metricPage.testPromQL') }}</el-button>
      </div>
    </el-form>
    <div class="btn-box">
      <el-button  size="small" @click="$emit('closeDialog')">{{ this.$t('cancle'), }}</el-button>
      <el-button type="primary" size="small"  @click="submitFn('createForm')">{{formData.id? $t('edit') :$t('create')}}</el-button>
    </div>
  </div>
</template>
<script>
import server from "@/api/service/manual-target"
import {testPromQL} from './test-proql';
export default {
  props:{
    itemData:{
      type: Object
    }
  },
  data(){
    return {
      formData:{
        name:'',
        promql:'',
        id:''
      }
    }
  },
  computed:{
    'formData.id'(){
      return this.itemId;
    }
  },
  mounted(){
    this.formData = {...this.formData,...this.itemData};
  },
  methods:{
    submitFn(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.reqFn();
        } else {
          return false;
        }
      });
    },
    reqFn(){
      let serverName = this.formData.id?'manualTargetEditApi':'manualTargetCreateApi'
      server[serverName](this.formData).then(()=>{
        this.$message({
          type:'success',
          message: '创建成功'
        })
        this.$emit('closeDialog');
        this.$emit('getList');
      }).catch((err)=>{
        this.$message({
          type:'error',
          message: err.mssage || '失败'
        })
      })
    },
    testPromQL,
  }
}
</script>
<style scoped>
.create-form{
  padding:20px;
}
.btn-box{
  text-align:right;
  border-top:solid 1px #e4e4e4;
  padding:20px 20px 0 0 ; 
}
</style>