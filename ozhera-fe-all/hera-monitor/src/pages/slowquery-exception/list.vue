<template>
  <div class="my-table">
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column
        :prop="item.value"
        :label="item.label"
        v-for="item in listData.tableKey"
        :key="item.value"
        :width="item.width"
        show-overflow-tooltip
        :sortable="item.sortable || false"
      >
      </el-table-column>
      <el-table-column fixed="right" :label="$t('action')" width="80">
        <template slot-scope="scope">
          <el-button
            v-for="item in listData.methods"
            :key="item.value"
            @click="handleClick(scope.row, item)"
            type="text"
            size="small"
            >{{ item.label }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import server from "@/api/service/slowQueryException.js"
import {getAppSource} from '@/utils/getAppSource';
import { mapState,mapMutations } from "vuex";
import {reRealTime} from '@/utils/ret-now-time.js';

export default {
  props: {
    listData: {
      require: true,
    },
    type: {
      require: true,
    },
    timer:{},
    method:{},
  },
  data() {
    return {
      updatDataVal:{
        type:'',
        value:''
      },
      loading: false,
      tableData: [],
      appSource:null,
      area:null // 增加，用于详情跳转
    }
  },
  watch: {
    '$route' (to,from ) {
      if(to.name !== 'lodashBoard'){
        return;
      }
      let toId = Number(to.query.id)
      let fromId = Number(from.query.id)
      if(toId!==fromId){
        this.getList();
      }
    },
    getStatistic:{
      handler(val){
        if(val ){
          this.updateDetail();
        }
      },
      immediate:true
    }
  },
  methods: {
    ...mapMutations('slowquery',['updateNums','updateGetStatistic']),
    getAppSource,
    handleClick(row, item) {
      let method = item.name
      this[method](row)
    },
    toDetail(row) {
      const {serverIp,serviceName,sql,dataSource,serverEnv,sqlMethod} = row;
      let query = {
        serverIp,serviceName,sql,dataSource,serverEnv,sqlMethod,
        appSource:this.appSource,
        projectId: this.$route.query.id,
        projectName: this.$route.query.name,
        type : this.listData.detailType, // http/dubbo_consumer/mysql
        errorType: this.type=='slowQuery'?'timeout':'error',//error（异常）/timeout （慢查询）
        methodName: this.listData.detailType==='redis'?row.method:row.methodName,
        endTime: this.timer[1] || '',
        startTime: this.timer[0] || '',
        area : this.area || null,
      }
      this.$router.push({
        name:'appUnusualDetail', 
        query
      })
    },
    callDetail(row) {
      console.log("跳转到调用详情", row)
    },
    refreshMethod(params){
      this.labels = {...this.labels, ...{...params.labels}};
      this.timer = params.timer;
      this.getList();
    },
    returnLabels(){ // 处理method请求参数
      const labels = {
        serverEnv: this.$route.query.serverEnv,
      }
      const methodNameKey = this.listData.labelMethodName || 'methodName';
      labels[methodNameKey] = this.method
      return labels;
    },
    reRealTime,
    retTime(preTime){
      let newT = (preTime+'').indexOf('now')>=0?this.reRealTime(preTime):preTime;
      return newT;
    },
    getList() {
      let startTime = this.retTime(this.timer[0]);
      let endTime = this.retTime(this.timer[1]);
      this.appSource = this.getAppSource(this.$store.state.project,this.$route.query.id);
      this.loading = true;
      let params = {
        projectId: this.$route.query.id,
        projectName: this.$route.query.name,
        metric: this.listData.value,
        op: ">",
        value: 10,
        metricSuffix: '_total',
        labels:this.returnLabels(),
        startTime,
        endTime,
        appSource:this.appSource,
      }
      if(this.type === 'exception' || this.listData.value ==="httpSlowQuery"){
        delete params.op;
        delete params.value;
      }
      server.getException(params).then(res => {
        this.tableData = (res && res.list) || [] // 数据请求成功
        this.area = res?.summary?.area || null;

        this.updatDataVal = {
          ...this.updatDataVal,
          ...{
            type:this.listData.statistics,
            value:res?.total||0
          }
        };
        this.updateDetail();

        this.loading =false;
      }).catch(()=>{
        this.loading =false;
      })
    },
    updateDetail(){ 
      if(this.getStatistic && this.updatDataVal.type){ // 统计数据回来并且，列表数据回来了
        this.updateNums(this.updatDataVal);
      }
    }
  },
  computed:{
    ...mapState({
      getStatistic: (state) => state.slowquery.getStatistic,
    }),
  },
  mounted() {
    this.getList();
  },
  deactivated(){
    this.updateGetStatistic(false);
  }
}
</script>
<style scope lang="less">
.my-table{
  .cell{
    // direction: rtl;
    text-align: left;
  }
}
.method-input{
  margin-bottom: 20px;
  .el-input__inner{
    border:none;
  }
  .el-input{
    border: solid 1px #DCDFE6;
  }
  .method-input-inner  {
    .el-input-group__append{
      background: #fff;
      border:none;
    }
    .search-btn{
      padding:10px;
    }
  }
}
</style>
