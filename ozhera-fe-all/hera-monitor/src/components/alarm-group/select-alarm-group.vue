<template>
  <el-form ref="form" :model="form" label-width="70px" class="new-create-form">
    <div class="form-item-box">
      <el-form-item label="通知组">
        <el-select v-model="form.memberIds" remote filterable placeholder="请输入通知组名称"  value-key="id" :remote-method="searchGroup" multiple class="select-group">
          <el-option
            v-for="item in alarmGroupOptions"
            :key="item.id"
            :label="item.name"
            :disabled="tableData.some(tableItem=>{return tableItem.id ===item.id })"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    </div>
    <div class="bottom-box">
      <el-button @click="closeDialog">{{ this.$t('cancle'), }}</el-button>
      <el-button @click="submit" type="primary">{{ $t('confirm') }}</el-button>
    </div>
  </el-form>
</template>
<script>
import service from '@/api/http/index';
const server = {
  searchGroupApi(params){
    return service({
        url: '/alertGroup/search',
        method: 'post',
        params,
    });
  }
}

export default {
  props:{
    preData:{
      type:Array
    }
  },
  computed:{
    tableData() {
      return this.preData;
    },
  },
  mounted(){
    this.searchGroup();
  },
  data(){
    return {
      alarmGroupOptions:[],
      form:{
        memberIds:[]
      }
    }
  },
  methods:{
    closeDialog(){
      this.$emit('switchShowSelect');
    },
    submit(){
      if(!this.form.memberIds){
        this.$message({
          type:'error',
          message:'请选择告警组'
        })
        return;
      }
      this.$emit('addGroups',this.form.memberIds);
      this.closeDialog();
    },
    searchGroup(name){
      server.searchGroupApi({name}).then(res=>{
        this.alarmGroupOptions = res.list;
      }).catch(err=>{
        console.log('err', err);
      })
    }
  }
}
</script>
<style scoped>
/* .tip{
  line-height: 24px;
  font-size:12px;
} */
.new-create-form >>> .el-form-item{
  width: 525px;
}
.new-create-form >>> .el-select{
  width: 425px;
}
.bottom-box{
  text-align: right;
  padding:20px;
  border-top: solid 1px #eee ;
}
.form-item-box{
  padding:20px 0 0 20px;
}
.warn-box{
  background-color: #fffbe6;
  border:solid 1px #ffe58f;
  padding-left: 10px;
}
</style>