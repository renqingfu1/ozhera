<template>
  <div>
    <div class="inner">
      <div class="btn-box top-search">
        <div style="padding-right: 20px">
          <el-button type="primary"  icon="el-icon-plus" @click="newCreate" size="small">{{ $t('create') }} {{ title || $t('projectDashboard') }}</el-button>
        </div>
        <div>
          <el-button type="primary" size='small' plain @click='queryModule = !queryModule'>{{ $t('AdvanceFilter') }}</el-button>
          <span class="search-input-style" style="margin-left: 10px">
          <el-input v-model.trim="searchForm.marketName"
                    style="width: 260px"
                    size="small"
                    :placeholder="$t('marketList.placeholder',{name:titleStr})"
                    @keyup.enter.native="handleCurrentChange(1)">
          </el-input>
          <i class="el-icon-search icon-search" @click="handleCurrentChange(1)"></i>
        </span>
        </div>
      </div>
      <div class="btn-box top-search filter-more" v-if="queryModule">
        <el-form :inline="true" :model="searchForm" size="small" class="form-no-margin-bottom" ref="ruleForm">
          <el-form-item :label="$t('marketList.includingApplications')" prop="serviceName">
            <el-select v-model="searchForm.serviceName" :placeholder="$t('pleaseSel')"
                       value-key="name"
                       filterable
                       remote
                       clearable
                       style="width: 200px"
                       :remote-method="getAppList">
              <el-option
                  v-for="(item, index) in appList"
                  :key="`market-list-${item.id}-${index}`"
                  :label="item.name"
                  :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('creator')" prop="creator">
            <el-input v-model.trim="searchForm.creator"
                      style="width: 200px"
                      :placeholder="$t('enterCreator')"
                      clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleCurrentChange(1)">{{ $t('search') }}</el-button>
            <!--            <el-button @click="resetForm('ruleForm')">重置</el-button>-->
          </el-form-item>
        </el-form>
      </div>

      <div class="main" v-loading="loading">
        <div class="detail-box">
          <template>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="marketName" :label="$t('name')"></el-table-column>
              <!--              <el-table-column prop="belongTeam" label="所属团队"></el-table-column>-->
              <el-table-column prop="serviceList" :label="$t('marketList.includingApplications')" show-overflow-tooltip></el-table-column>
              <el-table-column prop="creator" :label="$t('creator')"></el-table-column>
              <el-table-column prop="lastUpdater" :label="$t('updater')"></el-table-column>
              <el-table-column prop="createTime" :label="$t('updateTime')" width="180px">
                <template slot-scope="scope">
                  {{$dateFormat(scope.row.updateTime, 'yyyy-mm-dd HH:MM:ss')}}
                </template>
              </el-table-column>
              <el-table-column prop="remark" :label="$t('remark')" show-overflow-tooltip></el-table-column>
              <el-table-column fixed="right" :label="$t('action')" width="170">
                <template slot-scope="scope">
                  <el-button @click="details(scope.row)" type="text" size="mini">{{ $t('market') }}</el-button>
                  <el-button @click="edit(scope.row)" type="text" size="mini">{{ $t('edit') }}</el-button>
                  <el-button @click="deleteItem(scope.row)" type="text" size="mini">{{ $t('remove') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="page-box">
              <el-pagination
                  background
                  layout="total,prev, pager, next, jumper"
                  :page-size="searchForm.pageSize"
                  :current-page="searchForm.page"
                  :total="total"
                  @current-change='handleCurrentChange'>
              </el-pagination>
            </div>
          </template>
        </div>
      </div>
    </div>
    <CreateMarket :show.sync="dialogVisible"
                  :item="dialogData"
                  :title="title"
                  :searchForm="searchForm"
                  :showArea="showArea"
                  :serverType="serverType"
                  @getList="handleCurrentChange" />
  </div>
</template>
<script>
import CreateMarket from './create';
import server from "@/api/service/market";
import server2 from "@/api/service/market-common";
import qs from 'qs'

export default {
  name: 'Market',
  components: {CreateMarket},
  props: {
    title: {
      type: String,
    },
    showArea: { // 是否显示区域
      type: Boolean,
      default: false
    },
    serverType: {
      type: String,
      default: 'project'
    }
  },
  computed:{
    titleStr(){
      return this.$t(this.title);
    },
  },
  data() {
    return {
      loading: false,
      searchForm:{
        marketName: '', // 大盘名称
        creator: '', // 创建者
        serviceName: '', // 服务名称
        page: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],
      appList: [], // 应用列表数据
      appParams: {
        appName: '', // 输入框筛选应用值
        viewType: 1, // 查询类型 0我的应用，1全部应用
        page: 1, // 页码
        pageSize: 20, // 每页条数
        area:0, // 中国区
      },
      dialogVisible:false,
      dialogData: {},
      queryModule: false
    }
  },
  mounted() {
    this.getAppList(); // 获取应用列表数据
    this.getList() // 获取列表数据
  },
  methods: {
    // 获取列表数据
    getList() {
      this.loading = true;
      server.getListPromise(this.searchForm, this.serverType).then(res => {
        this.loading = false;
        this.tableData = res.list
        this.total = res.total
      }).catch(() => {
        this.loading = false;
      });
    },
    // 分页：当前页改变时会触发
    handleCurrentChange (val) {
      this.searchForm.page = val || 1
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.handleCurrentChange(1)
    },
    // 获取应用列表数据
    getAppList(query) {
      this.appParams.appName = query || ''
      server2.getProjects(this.appParams).then(res => {
        this.appList = res.list
      })
    },
    // 新建
    newCreate() {
      this.dialogData = null;
      this.dialogVisible = true;
    },
    // 编辑
    edit(row) {
      this.dialogData = row;
      this.dialogVisible = true;
    },
    details(row) {
      console.log(row);
      const path = this.serverType == 'quality' ? '/quality-market-details' : '/market-details'
      this.$router.push({path, query: {
          serverType: this.serverType == 'quality' ? this.serverType : row.serviceType,
          serverName: row.serviceList,
        }}); // 跳转到
    },
    // 删除
    deleteItem(row) {
      this.$confirm(this.$t('isConfirmDel'),  this.$t('prompt'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText:  this.$t('cancle'),
        type: 'warning'
      }).then(() => {
        const param = {
          primaryId: row.id
        }
        server.delPromise(qs.stringify(param), this.serverType).then(()=>{
          this.handleCurrentChange();
          this.$message.success('删除成功');
        })
      }).catch(() => {});
    }
  },
}
</script>
<style scoped>
.inner {
  padding: 20px;
  box-sizing: border-box;
}

.main {
  background: #fff;
  padding: 20px;
  margin-bottom: 20px;
  overflow: hidden;
}
h4 {
  margin-bottom: 10px;
}
.page-box {
  padding-top: 10px;
  text-align: right;
}
.btn-box {
  padding: 0 0 20px 0;
}
.top-search{
  display: flex;
  justify-content: space-between;
}
.filter-more {
  background: #fff;
  margin-bottom: 20px;
  padding: 20px 20px 10px 20px;
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
.alarm-rules-box .alarm-rules-p:last-child {
  margin-bottom: 0;
}
.form-no-margin-bottom >>> .el-form-item {
  margin-bottom: 10px;
  vertical-align: top;
}
.form-no-margin-bottom >>> .el-form-item button {
  vertical-align: top;
}
</style>
