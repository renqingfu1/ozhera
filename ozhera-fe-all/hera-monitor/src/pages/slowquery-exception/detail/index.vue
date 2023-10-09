<template>
  <div class="unusual-box">
    <lone-module class="title"  >
      <div @click="backPage">
        <i class="el-icon-back"></i>
        <span class="title-text">{{$route.query.errorType=='timeout'?'慢查询':'异常'}}详情</span>
      </div>
    </lone-module>
    <div class="inner">
      <div class="main">
        <div class="basic">
          <h4>{{$t('policyPage.basiceInfo')}}</h4>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item :label="$route.query.errorType==='timeout'?$t('appName'):'项目名称:'">
              <span>{{ row.projectName }}</span>
            </el-form-item>
            <el-form-item label="异常类型:">
              <span>{{ row.bisType }}</span>
            </el-form-item>
            <el-form-item label="方法名:">
              <span>{{ row.methodName }}</span>
            </el-form-item>
            <el-form-item label="可用性:" v-if="$route.query.class === 'unusual'">
              <span>{{ row.availability }}</span>
            </el-form-item>
            <el-form-item label="所属服务:" v-if="$route.query.type === 'dubbo_consumer'"
            >
              <div>
                <span class="tooltip-inner left-ellipsis" >{{row.serviceName}}</span>
                <el-popover
                  placement="top-start"
                  title=""
                  width="200"
                  trigger="hover"
                  v-if="row.serviceName.length>0"
                  :content="row.serviceName">
                  <i slot="reference" class="iconfont icon-question" style="font-size: 16px;" ></i>
                </el-popover>
              </div>
            </el-form-item>
            <el-form-item label="SQL:" v-if="$route.query.type === 'db'">
              <div>
                <span class="tooltip-inner left-ellipsis" >{{row.sql}}</span>
                <el-popover
                  placement="top-start"
                  title=""
                  width="200"
                  trigger="hover"
                  v-if="row.sql.length>0"
                  :content="row.sql">
                  <i slot="reference" class="iconfont icon-question" style="font-size: 16px;" ></i>
                </el-popover>
              </div>
            </el-form-item>
            <el-form-item label="数据源:" v-if="$route.query.type === 'db'">
              <span>{{ row.dataSource }}</span>
            </el-form-item>
            <el-form-item label="服务环境:" v-if="$route.query.serverEnv">
              <span>
                {{$route.query.serverEnv}}
              </span>
            </el-form-item>
            <el-form-item label="服务IP:">
              <span>{{ row.serverIp }}</span>
            </el-form-item>
            
            <el-form-item label="发生次数:">
              <span>{{ row.totalCount }}</span>
            </el-form-item>
            <el-form-item label="最近产生时间:">
              <span>
                  {{row.lastCreateTime && $dateFormat(row.lastCreateTime, 'yyyy-mm-dd HH:MM:ss')}}
              </span>
            </el-form-item>
            

          </el-form>
        </div>
        <div class="detail-box">
          <h4>详情列表</h4>
          <template>
            <el-table :data="tableData" style="width: 100%" >
              <el-table-column prop="timestamp" label="产生时间"  sortable>
                <template slot-scope="scope">
                  {{scope.row.createTime && $dateFormat(scope.row.createTime, 'yyyy-mm-dd HH:MM:ss')}}
                </template>
              </el-table-column>
              <el-table-column prop="errorCode" label="错误码" v-if="$route.query.errorType!=='timeout'">
              </el-table-column>
              <el-table-column prop="duration" label="耗时(ms)" v-if="$route.query.errorType=='timeout'">
              </el-table-column>
              <el-table-column prop="traceId" label="traceID">
              </el-table-column>
              <el-table-column
                fixed="right"
                :label="$t('action')"
                width="160">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="toLinkRoute(scope.row)"
                    type="text"
                    size="small">
                    链路
                  </el-button>
                  <!-- 调用异常有那个查看日志的按钮 -->
                  <el-button 
                    v-if="$route.query.errorType=='error'"
                    @click.native.prevent="showLog(scope.row,'')"
                    type="text"
                    :disabled="!row.access_log"
                    size="small">
                    日志
                  </el-button>
                  <el-button 
                    v-if="$route.query.errorType=='error' && row.domain!='mitelemetry'"
                    @click.native.prevent="showLog(scope.row,'ERROR')"
                    type="text"
                    :disabled="!row.access_log"
                    size="small">
                    错误日志
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="page-box">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="search.page"
                :page-size="search.pageSize"
                layout="total,prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </div>
          </template>
        </div>
      </div>
    </div>
    <el-drawer
      :title="`${logType=='ERROR'?'错误':''}日志信息（traceId：${detailInfo.traceId}）`"
      :visible.sync="drawer"
      size="700px"
      direction="rtl"
      class="log-drawer">
      <div v-if="drawer">
        <Log :detailInfo="detailInfo" :logType="logType"/>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import server from '@/api/service/application.js';
import Log from './log.vue';
import {reRealTime} from '@/utils/ret-now-time.js';

export default {
  components:{Log},
  data() {
    return {
      detailInfo:{
        projectId:null,
        serverIp:'',
        traceId:'',
        domain:'',
        startTime:0,
        endTime:0,
        area: '',
      },
      drawer:false,
      row: {
        projectName: "",
        bisType: "",
        serverIp: "",
        availability: "",
        lastCreateTime: "",
        methodName:'',
        serviceName:'',
        sql:'',
        dataSource:'',
        area: '',
      },
      total: 0,
      search:{
        page:1,
        pageSize:20,
      },
      tableData: [],
      logType:''
    }
  },
  mounted() {
    this.getDetailInfo();
  },
  methods:{
    reRealTime,
    retTime(preTime){
      let newT = (preTime+'').indexOf('now')>=0?this.reRealTime(preTime):preTime;
      return newT;
    },
    getDetailInfo(){
      const {startTime,endTime} = this.$route.query;
      let params = {...this.$route.query, ...this.search,...{
        startTime : this.retTime(startTime),
        endTime : this.retTime(endTime)
      }};
      server.getUnusualDetial(params).then((res)=>{
        this.row = {...this.row,...res.summary};
        this.tableData = res.list || [];
        this.search = {...this.search,...{
          page: res.page,
          pageSize:res.pageSize,
        }}
        this.total= res.total
      }).catch(err=>{
        console.log('err',err);
      })
    },
    toLinkRoute(item){
      let source=''
      if(item.domain==='mitelemetry')
        source='MITELEMETRY'
      if(item.domain==='jaegerquery')
        source='HERA'
      let params={
        source,
        startTime:item.createTime,
        endTime:item.createTime,
        area:this.row.area || '',
      }
      let query=Object.keys(params).map(key=>{
        return key+'='+params[key]
      }).join("&")
      let path=`/project-hera-tracing/traceid/${item.traceId}?${query}`;
      window.open(path, 'blank');
    },
    showLog(row,type){
      this.logType = type;
      this.detailInfo = {...this.detailInfo, ...{
        generationTime:this.$dateFormat(row.createTime, 'yyyy-mm-dd HH:MM:ss'),
        projectId:Number(this.$route.query.projectId),
        serverIp:this.$route.query.serverIp,
        traceId:row.traceId,
        domain:row.domain,
        startTime:(+row.timestamp)-60*15*1000,
        endTime:(+row.timestamp)+60*15*1000,
        area:this.row.area || '',
      }};
      this.switchShowDraw();
    },
    switchShowDraw(){
      this.drawer = !this.drawer;
    },
    handleCurrentChange(page){
      this.search = {...this.search,...{page}};
      this.getDetailInfo();
    },
    backPage(){
      this.$router.go(-1);
    }
  }
}
</script>
<style scoped>

.title {
  color: #000;
}
.title-text {
  margin-left: 8px;
}
.unusual-box {
  height: 100%;
  color: rgba(0, 0, 0, 0.85);
}
.inner {
  padding: 20px;
  box-sizing: border-box;
}
.el-icon-back {
  color: #409eff;
  font-size: 18px;
  vertical-align: top;
  font-weight: 800;
}
.main {
  background: #fff;
  padding: 20px;
}
h4 {
  margin-bottom: 10px;
}
.basic >>> .el-form-item {
  width: 32%;
  margin-bottom: 0;
}
.basic >>> .el-form-item__label {
  padding-right: 5px;
}
.basic >>> .el-form-item__label,
.basic >>> .el-form-item__content {
  line-height: 30px;
  height: 30px;
}
.tooltip-inner {
  display: inline-block;
  max-width: 168px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  vertical-align: top;
  margin-right: 10px;
}
.detail-box {
  border-top: solid 1px #eee;
  margin-top: 20px;
  padding-top: 20px;
}
.page-box{
  padding-top: 10px;
  text-align: right;
}
.log-drawer >>> .el-drawer__header{
    border-bottom: solid 1px #ddd;
    padding-bottom: 20px; 
    margin-bottom: 0;
    font-weight: 500;
    color: #333;
  }
</style>


