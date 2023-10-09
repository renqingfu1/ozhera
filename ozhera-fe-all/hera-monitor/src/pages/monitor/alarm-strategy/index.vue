<template>
  <div class="unusual-box">
    <lone-module class="title">
      <span class="title-text">{{ $t('ApplyAlarmPolicy') }}</span>
    </lone-module>
    <div class="inner">
      <IndexSearch @getList="searchList" v-model="searchParams"/>
      <div class="main">
        <div class="detail-box">
          <template>
            <el-table :data="tableData" v-loading='loading' @sort-change="sortChange">
              <el-table-column prop="strategyName" :label="$t('policyPage.policyName')" sortable="custom" :sort-orders="['descending', 'ascending']" width="150px"> </el-table-column>
              <el-table-column prop="strategyType" :label="$t('policyPage.monitoringType')" width="130px">
                <template slot-scope="scope">
                    {{strategyOptions.filter(item=>item.value == scope.row.strategyType).length>0 && 
                    strategyOptions.filter(item=>item.value == scope.row.strategyType)[0].label || scope.row.strategyType}}
                </template>
              </el-table-column>
              <el-table-column prop="appName" :label="$t('appName')" width="150px"> </el-table-column>
              <el-table-column prop="alarmRulesArr" :label="$t('policyPage.alarmRule')"  min-width="400px">
                <template slot-scope="scope">
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    width="400">
                    <div>
                      <p v-for="(item,index) in scope.row.alarmRulesArr" :key="index" v-html="item" class="pop-p"></p>
                    </div>
                    <div slot="reference" >
                      <p class="ellipsis-p" v-for="(item,index) in scope.row.alarmRulesArrNoBr" :key="index"><span class="rule-point">·</span>{{item}}</p>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="creater" :label="$t('updater')" width="130px"> </el-table-column>
              <el-table-column prop="updateTime" :label="$t('updateTime')" sortable="custom" :sort-orders="['ascending', 'descending']" width="180px">
                <template slot-scope="scope">
                  {{$dateFormat(scope.row.updateTime, 'yyyy-mm-dd HH:MM:ss')}}
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                prop="status"
                :label="$t('policyPage.alarmIsOn')"
                width="130px"
                :filters="[{
                    text: '启动', value: activeValue
                  }, {
                    text: '关闭', value: inactiveValue
                  }]"
                :filter-method="filterHandler"
                filter-placement="bottom-end">
                <template slot-scope="scope">
                  <el-popconfirm
                    :title="`确定要${scope.row.status === activeValue?'关闭':'开启'}此应用报警策略吗？${scope.row.status === activeValue?'关闭后将不会发送报警通知。':'开启后大约1分钟后生效。'}`"
                    width="220"
                    @confirm="switchStratRule(scope.row)"
                    v-if="scope.row.owner"
                  >
                    <el-switch :value="scope.row.status" :active-value="activeValue" :inactive-value="inactiveValue" slot="reference" ></el-switch>
                  </el-popconfirm>
                  <el-switch v-else :value="scope.row.status" :active-value="activeValue" :inactive-value="inactiveValue" :disabled="true"></el-switch>
                </template>
              </el-table-column>
              <el-table-column  :label="$t('action')" width="160px" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="copy(scope.row)"
                    type="text"
                    size="small"
                    :disabled="!scope.row.owner"
                  >
                    {{ $t('copy') }}
                  </el-button>
                  <el-button
                    @click.native.prevent="edit(scope.row)"
                    type="text"
                    size="small"
                    :disabled="!scope.row.owner"
                  >
                  {{ $t('edit') }}
                  </el-button>
                  <el-button
                    @click.native.prevent="deleteItem(scope.row)"
                    type="text"
                    size="small"
                    :disabled="!scope.row.owner"
                  >
                  {{ $t('remove') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="page-box">
              <el-pagination
                background
                layout="total, prev, pager, next"
                :page-size="searchParams.pageSize"
                :current-page="searchParams.page"
                :total="total"
                @current-change="pageChange"
              >
              </el-pagination>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import serverStrategy from '@/api/service/alarm-srategy.js';
import IndexSearch from './IndexSearch';
import {mapActions,mapState} from 'vuex'; 
import {
  transformRes,
  transformURL,
  retrunDetail,
  transformStr,
  returnStr
} from '@/pages/monitor/alarm-strategy/transform.js'

export default {
  components:{IndexSearch},
  computed:{
    ...mapState({
      strategyOptions: (state) => state.moduleStrategyList.strategyOptions, 
      presetMetrics: state => state.moduleStrategyList.presetMetrics, // 指标
      checkDataCount: state => state.moduleStrategyList.checkDataCount, // 持续时间
      alarmLevels: state => state.moduleStrategyList.alarmLevels, // 报警级别
      sendInterval: state => state.moduleStrategyList.sendInterval, // 报警频率
    }),
  },
  data() {
    const lastSearchParams = this.$route.params.searchParams || {}
    return {
      activeValue:0,
      inactiveValue:1,
      loading:false,
      dialogVisible:false,
      total: 0,
      searchParams:{
        page:1,
        pageSize:20,
        strategyName:'',
        sortBy: 'update_time',
        sortOrder: 'desc',
        paging:true,
        owner: true,
        ...lastSearchParams,
      },
      tableData: [],
      itemDetail:{}
    }
  },
  async mounted() {
    await this.GETSTRATEGYOPTION();
    await this.GETRUlESOPTION(); //获取所有规则的选项
    await this.searchList();
  },
  methods: {
    ...mapActions('moduleStrategyList', ['GETSTRATEGYOPTION','GETRUlESOPTION']),
    searchList(){
      this.loading = true;
      serverStrategy.strategyListApi(this.searchParams).then(res=>{
        this.tableData = this.transformRes(res.list||[]);
        this.total = res.total;
        this.searchParams = {...this.searchParams,...{
          page: res.page,
          pageSize: res.pageSize
        }};
        this.loading = false;
      }).catch(()=>{
        this.loading = false;
      })
    },
    transformRes,
    returnStr,
    transformURL,
    retrunDetail,
    transformStr,
    pageChange(page){
      this.searchParams = {...this.searchParams,...{page}}
      this.searchList();
    },
    // 分页：当前页改变时会触发
    handleCurrentChange (val) {
      this.searchParams.page = val || 1
      this.searchList()
    },
    sortChange({ prop, order }){
      const sortableProps = {strategyName: 'strategy_name', updateTime: 'update_time'}
      this.searchParams = {
        ...this.searchParams, 
        sortBy:  sortableProps[prop], 
        sortOrder: order === 'ascending' ? 'asc' : 'desc'
      }
      this.searchList()
    },
    copy(row){
      this.$router.push({
        name:'warnStrategyCreate',
        query:{
          id:row.id,
          type:'copy'
        },
        params: { searchParams: this.searchParams },
      })
    },
    deleteItem(row){
      this.$confirm(`确定删除 ${row.appName} 的报警规则吗?`, this.$t('prompt'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancle'),
        type: 'warning',
      }).then(() => {
        const param = {
          id: row.id, 
        }
        this.delReq(param);
      }).catch(() => {});
    },
    delReq(param){
      serverStrategy.delStrategy(param).then(() => {
        this.$message.success('删除成功！');
        this.searchList();
      });
    },
    edit(row) {
      this.$router.push({
        name:'warnStrategyCreate',
        query:{id:row.id},
        params: { searchParams: this.searchParams },
      })
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    switchStratRule(row){
      let params = {
        id:row.id,
        status:row.status===0?1:0
      }
      console.log('params',params);
      serverStrategy.switchOpenAlarm(params).then(()=>{
        this.searchList();
      })
    }
  },
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
  /* height: calc(100% - 54px); */
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
.tooltip-inner {
  display: inline-block;
  width: 168px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.page-box {
  padding-top: 10px;
  text-align: right;
}
.btn-box {
  padding: 0 0 20px 0;
}
.small-form >>> .el-input,.small-form >>> .el-textarea__inner{
  width: 300px;
}
.bottom-btn-box{
  text-align: right;
}
.top-search{
  display: flex;
  justify-content: space-between;
}
.top-search >>> .el-input-group{
  width: 260px;
}
.small-form >>> .el-input,.small-form >>> .el-textarea__inner{
  width: 300px;
}
.bottom-btn-box{
  text-align: right;
}
.pop-switch{
  display: flex;
  justify-content: left;
}
.pop-switch p{
  line-height: 18px;
}
.alarm-rules-p{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.ellipsis-p{
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.pop-p{
  position: relative;
  font-size: 12px;
  padding-left: 8px;
}
.pop-p::before{
  content: '·';
  position: absolute;
  left: 0;
  top:0;
  font-size: 20px;
  height: 16px;
  line-height: 16px;
}
.rule-point{
  display: inline-block;
  height: 20px;
  line-height: 20px;
  font-size: 20px;
  vertical-align: middle;
}
</style>
