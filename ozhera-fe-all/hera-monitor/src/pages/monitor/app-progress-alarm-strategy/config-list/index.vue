<template>
  <div>
    <MiBack text="应用进程报警策略-配置" @click="goBack"/>
    <div class="inner">
      <div class="table-box">
        <el-row style="padding-bottom: 20px;">
          <el-button type="primary" @click="clickCreate">{{$t('create')}}</el-button>
          <el-button type="primary" @click="goBack">返回应用列表</el-button>
        </el-row>
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
          <el-table-column prop="projectName" label="应用"> </el-table-column>
          <el-table-column prop="projectEnvName" label="流水线" width="200px"></el-table-column>
          <el-table-column prop="projectEnvName" label="心跳类型">
            <template slot-scope="scope">
              <span v-if="typeList.filter(item=>item.value == scope.row.ivo.type).length>0">
                {{typeList.filter(item=>item.value == scope.row.ivo.type)[0].label}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="ivo.alertLevel" label="报警级别"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span :class="scope.row.status==0?'success':'danger'">{{scope.row.status==0?'有效':'失效'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updaterAcc" :label="$t('updater')"></el-table-column>
          <el-table-column prop="updaterAcc" :label="$t('updateTime')" width="170px">
            <template slot-scope="scope">
              {{$dateFormat(scope.row.updateTime, 'yyyy-mm-dd HH:MM:ss')}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('action')">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="deleteItem(scope)">{{ $t('remove') }}</el-button>
              <el-button size="mini" type="text" @click="editItem(scope)">{{ $t('edit') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      :title="(detailInfo.id?$t('edit'):$t('create'))+'报警配置'"
      :visible.sync="dialogVisible"
      @closed="emptyDetail"
      width="900px"
      >
      <Create 
        @closeDialog="closeDialog" 
        :detailInfo="detailInfo" 
        v-if="dialogVisible"
        @refresh="getList"
        :configedPipeLineId="configedPipeLineId"
        />
    </el-dialog>

  </div>
</template>
<script>
import HeartBeatServer from '@/api/service/heart-beat.js';
import Create from './create.vue';
import typeList from "./js/common.js";
  import MiBack from '@/components/mi-back.vue'

export default {
  components: {
    Create,
    MiBack
  },
  data() {
    return {
      typeList,
      loading: false,
      dialogVisible:false,
      detailInfo:{},
      tableData: [],
      configedPipeLineId:[] // 所有已配置的pipelineId
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true;
      HeartBeatServer
        .configList({
          appId: this.$route.params.projectId
        })
        .then((res) => {
          this.tableData = res;
          this.getPipelineId();
          this.loading = false;
        }).catch(()=>{
          this.loading = false;
        })
    },
    getPipelineId(){
      let arr = this.tableData.map((item)=>{
        return item.projectEnvId
      });
      this.configedPipeLineId = arr;
    },
    toConfigList(scope){
      this.$router.push({
        params:{
          appId: scope.row.projectId
        },
        name:'AppProgressConfig'
      })
    },
    clickCreate(){
      this.detailId = {};
      this.dialogVisible = true;
    },
    editItem(scope){
      this.detailInfo = scope.row;
      this.dialogVisible = true;
    },
    emptyDetail(){
      this.detailInfo = {};
    },
    closeDialog(){
      this.emptyDetail();
      this.dialogVisible = false;
    },
    deleteItem(scope){
      this.$confirm(this.$t('isConfirmDel'),  this.$t('prompt'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText:  this.$t('cancle'),
        type: 'warning'
      }).then(() => {
        HeartBeatServer.deleteConfig({
          id: scope.row.id
        }).then(()=>{
          this.$message.success('删除成功！');
          this.getList()
        })
      });
    },
    goBack(){
      this.$router.go(-1);
    }
  },
}
</script>
<style lang="less" scoped>
.inner {
  padding: 20px;
}
.table-box {
  padding: 20px;
  background: #fff;
}
.danger{
  color: #F56C6C;
}
.success{
  color: #67C23A;
}
</style>