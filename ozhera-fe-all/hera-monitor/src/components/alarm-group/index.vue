<template>
  <div class="alarm-group-box">
    <div class="top-btn">
      <el-button @click="switchShowSelect">选择通知组</el-button>
      <el-button @click="clickNewCreate">新建通知组</el-button>
    </div>
    <div class="table-box">
      <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="通知组名称">
      </el-table-column>
      <el-table-column
        prop="memeberIds"
        label="通知对象">
        <template slot-scope="scope">
          {{scope.row.members && scope.row.members.map(item=>item.name).join('、')}}
        </template>
      </el-table-column>
      <el-table-column
      fixed="right"
      :label="$t('action')" width="200px">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="remove(scope.$index)">移除</el-button>
      </template>
    </el-table-column>
    </el-table>
    </div>
    <el-dialog
      title="新增报警通知组"
      :visible.sync="showNew"
      width="650px" class="new-create-dialog">
      <NewCreate 
        :appDetail="appDetail"
        v-if="showNew" @switchShowCreate="switchShowNew" @addGroups="addGroups" dialogType="newCreate"/>
    </el-dialog>
    <el-dialog
      title="选择通知组"
      :visible.sync="showSelect"
      width="620px" class="select-dialog">
      <selectAlarmGroup v-if="showSelect"  @switchShowSelect="switchShowSelect" @addGroups="addGroups" :preData="tableData"/>
    </el-dialog>
  </div>
</template>
<script>
import NewCreate from './new-create'
import selectAlarmGroup from './select-alarm-group'

import service from '@/api/http/index';

const server = {
  // 获取告警组详情
  getGroupsDetail(params) {
    return service({
      url: '/alertGroup/searchByIds',
      method: 'post',
      params,
    });
  },
};

export default {
  components:{NewCreate,selectAlarmGroup},
  props:{
    value:{
      // type:Array
    },
    appDetail:{
      type:Object,
      required: true
    }
  },
  data(){
    return {
      showNew: false,
      showSelect:false,
      tableData: []
    }
  },
  watch:{
    value(newV){
      let filter = newV.filter(item=>item.type !=='oncall'); // 过滤掉oncall报警组
      this.tableData = filter.map(item=>{
        return {
          ...item,
          members:item.members ||[]
        }
      });
      if(this.$route.query.id){ // 编辑回显
        this.getMembers();
      }
    }
  },
  methods:{
    remove(index){
      this.$confirm(`确定删除该通知组吗?`,  this.$t('prompt'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancle'),
        type: 'warning',
      }).then(() => {
        this.tableData.splice(index,1);
        this.$emit('input', this.tableData);
      }).catch(() => {});
    },
    switchShowNew(){
      this.showNew = !this.showNew;
    },
    switchShowSelect(){
      this.showSelect = !this.showSelect;
    },
    clickNewCreate(){
      this.switchShowNew();
    },
    addGroups(groups){
      let newArr = groups.map(item=>{
        return {
          id:item.relId,
          type:item.type,
          name:item.name,
          members:item.members
        };
      })
      this.tableData=  this.tableData.concat(newArr);
      this.$emit('input', this.tableData);
    },
    getMembers(){
      let  toGetMembers= this.tableData.filter((item)=>{return item.members.length===0});
      let  relIds= toGetMembers.map((item)=>{return item.id});
      let  type= toGetMembers.length>0?toGetMembers[0].type:'';
      if(relIds.length ==0) return;
      server.getGroupsDetail({relIds,type}).then((res)=>{
        this.tableData = this.tableData.map(item=>{
          item.members = (res[item.id]).members
          return item;
        })
      })
    }
  }
}
</script>
<style scoped>
.table-box {
  margin-top: 20px;
}
.table-box >>> .el-table th{
  background-color: #fafafa;
}
.table-box >>> .el-table__header {
  border-radius: 5px 5px 0 0 ;
  border: solid 1px #ebebeb;
}
.table-box >>>  .el-table th.is-leaf{
  border-bottom: none;
}
.new-create-dialog >>> .el-dialog__body{
  padding:0;
}

</style>