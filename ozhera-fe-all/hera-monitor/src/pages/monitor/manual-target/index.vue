<template>
  <div class="manual-target">
    <lone-module class="title">
      <span class="title-text">{{$t('metricPage.title')}}</span>
    </lone-module>
    <div class="contain-box">
      <el-button type="primary" @click="create" size="small" >{{ $t('create') }}</el-button>
      <div class="table-box">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" :label="$t('metricPage.metricName')"> </el-table-column>
          <el-table-column prop="promql" :label="$t('metricPage.metricPromQl')"> </el-table-column>
          <el-table-column prop="creater" :label="$t('creator')"></el-table-column>
          <el-table-column prop="createTime" :label="$t('createTime')">
            <template slot-scope="scope">
              {{scope.row.createTime && $dateFormat(scope.row.createTime, 'yyyy-mm-dd HH:MM:ss')}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" :label="$t('action')" width="120">
            <template slot-scope="scope">
              <el-button @click="editItem(scope.row)" type="text" size="small" >{{ $t('edit') }}</el-button>
              <el-button @click="deleteItem(scope.row)" type="text" size="small">{{ $t('remove') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box">
          <el-pagination background layout="total,prev, pager, next, jumper" :total="total" :page-size="params.pageSize" @current-change="changePage" >
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog :title="新建自定义指标" :visible.sync="showDialog" width="700px" class="create-dialog">
      <Create @closeDialog="swtichShowDialog" @getList="getList" :itemData="itemData" v-if="showDialog"/>
    </el-dialog>
  </div>
</template>
 <script>
import server from "@/api/service/manual-target"
import Create from './create.vue';
export default {
  components:{Create},
  data() {
    return {
      itemData:{
        name:'',
        promql:'',
        id:''
      }, // 编辑单个数据
      showDialog:false,
      total:0,
      params: {
        paging: true,
        page: 1,
        pageSize: 20,
      },
      tableData: [],
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      server.manualTargetListApi(this.params).then(res => {
        this.total = res.total;
        this.tableData = res.list || [];
      })
    },
    deleteItem(item){
      this.$confirm(this.$t('isConfirmDel'),  this.$t('prompt'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancle'),
        type: 'warning'
      }).then(() => {
        this.delReq(item.id);
      });
    },
    delReq(id){
      server.manualTargetDeleteApi({id}).then(()=>{
        this.$message({
          type:'success',
          message:'删除成功'
        })
        this.getList();
      }).catch(err=>{
        this.$message({
          type:'error',
          message:err.message
        })
      })
    },
    swtichShowDialog(){
      this.showDialog = !this.showDialog;
    },
    editItem(item){
      this.creatEdit(item);
    },
    create(){
      let param = {
        name:'',
        promql:'',
        id:''
      }
      this.creatEdit(param);
    },
    creatEdit(item){
      this.itemData = {
        ...this.itemData,
        ...item
      };
      this.swtichShowDialog();
    },
    changePage(page){
      this.params ={...this.params,...{page}};
      this.getList();
    }
  },
}
</script>
<style scoped>
.contain-box,.table-box {
  padding: 20px;
}
.table-box {
  background: #fff;
  margin-top:20px
}
.page-box {
  padding-top: 20px;
}
.create-dialog >>> .el-dialog__body{
  padding-left:0;
  padding-right:0;
}
</style>