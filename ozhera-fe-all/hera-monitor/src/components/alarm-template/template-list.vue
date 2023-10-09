<template>
  <div class="inner">
    <div class="btn-box top-search">
      <el-button
          type="primary"
          icon="el-icon-plus"
          @click="newCreate"
          size="small"
      >{{ $t('create') }}</el-button
      >
      <span class="search-input-style">
        <el-input
            v-model.trim="searchForm.name"
            style="width: 260px"
            size="small"
            :placeholder="$t('policyPage.enterTempName')"
            @keyup.enter.native="handleCurrentChange(1)"
        >
        </el-input>
        <i
            class="el-icon-search icon-search"
            @click="handleCurrentChange(1)"
        ></i>
      </span>
    </div>
    <div v-loading="loading">
      <div class="detail-box">
        <template>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="template.name" :label="$t('policyPage.TempName')" min-width="12%">
            </el-table-column>
            <el-table-column prop="template.strategyType" :label="$t('policyPage.templateType')" width="120px">
              <template slot-scope="scope">
                {{
                  (strategyOptionsTem.filter(
                      item => item.value == scope.row.template.strategyType
                      ).length > 0 &&
                      strategyOptionsTem.filter(
                          item => item.value == scope.row.template.strategyType
                      )[0].label) ||
                  ""
                }}
              </template>
            </el-table-column>
            <el-table-column prop="alarmRulesArr" :label="$t('policyPage.alarmRule')" min-width="20%">
              <template slot-scope="scope">
                <el-popover
                    placement="top-start"
                    trigger="hover"
                    width="400">
                  <div>
                    <p v-for="(item,index) in scope.row.alarmRulesArr" :key="index" v-html="item" class="pop-p"></p>
                  </div>
                  <div slot="reference" >
                    <p class="ellipsis-p" v-for="(item,index) in scope.row.alarmRulesArrNoBr" :key="index">·{{item}}</p>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="template.remark" :label="$t('remark')" min-width="10%">
            </el-table-column>
            <el-table-column prop="template.creater" :label="$t('creator')" width="120px"></el-table-column>
            <el-table-column
                prop="template.createTime"
                :label="$t('createTime')"
                min-width="110px"
                width="170px"
            >
              <template slot-scope="scope">
                {{
                  $dateFormat(
                      scope.row.template.createTime,
                      "yyyy-mm-dd HH:MM:ss"
                  )
                }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('action')" width="120px">
              <template slot-scope="scope">
                <el-button @click="edit(scope.row)" type="text" size="small"
                           v-if="scope.row.template.creater == $store.state.moduleUserInfo.userInfo.user">
                  {{ $t('edit') }}
                </el-button>
                <el-button
                    @click="deleteItem(scope.row)"
                    type="text"
                    size="small"
                    v-if="scope.row.template.creater == $store.state.moduleUserInfo.userInfo.user">
                  {{ $t('remove') }}
                </el-button>
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
                @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import server from "@/api/service/alarm-template"
import { mapActions, mapState } from "vuex"
import {
  transformRes,
  returnStr,
  transformURL,
  retrunDetail,
  transformStr
} from '@/pages/monitor/alarm-strategy/transform.js'

export default {
  props: {
    type: {
      type: Number,
      default: 0, // 0我的 1全部
    }
  },
  computed: {
    ...mapState({
      strategyOptionsTem: state => state.moduleStrategyList.strategyOptionsTem,
      presetMetrics: state => state.moduleStrategyList.presetMetrics, // 指标
      checkDataCount: state => state.moduleStrategyList.checkDataCount, // 持续时间
      alarmLevels: state => state.moduleStrategyList.alarmLevels, // 报警级别
      sendInterval: state => state.moduleStrategyList.sendInterval, // 报警频率
    }),
  },
  data() {
    return {
      loading: false,
      searchForm: {
        name: "",
        page: 1,
        pageSize: 20,
      },
      total: 0,
      tableData: [],
    }
  },
  async mounted() {
    await this.GETSTRATEGYOPTIONTEM() // 获取策略类型
    await this.GETRUlESOPTION() // 规则
    await this.templateHandle();
  },
  watch: {
    "$store.state.moduleUserInfo": {
      handler() {
        if (!this.type) this.getList()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions("moduleStrategyList", [
      "GETSTRATEGYOPTIONTEM",
      "GETRUlESOPTION",
    ]),
    transformRes,
    transformURL,
    retrunDetail,
    transformStr,
    returnStr,
    getList() {
      this.loading = true
      let params = {
        ...this.searchForm
      }
      if (!this.type) {
        const { userInfo } = this.$store && this.$store.state.moduleUserInfo;
        params.creater = userInfo.user;
      }
      server.getTemplateListIndex(params)
          .then(res => {
            this.loading = false
            this.tableData = this.transformRes(res.list || [])
            this.total = res.total
          })
          .catch(() => {
            this.loading = false
          })
    },

    deleteItem(row) {
      const delText = this.$t('isConfirmDelName',{name:row.template.name});
      this.$confirm(
        delText,
          this.$t('prompt'),
          {
            confirmButtonText:this.$t('confirm'),
            cancelButtonText: this.$t('cancle'),
            type: "warning",
          }
      )
          .then(() => {
            const param = {
              id: row.template.id,
            }
            server.deleteAlarmTemplate(param).then(() => {
              this.handleCurrentChange()
              this.$message.success("删除成功")
            })
          })
          .catch(() => {})
    },
    // 分页：当前页改变时会触发
    handleCurrentChange(val) {
      this.searchForm.page = val || 1
      this.getList()
    },
    newCreate() {
      this.$router.push({ name: "createAppAlarmTemplate" }) // 跳转到
    },
    edit(row) {
      this.$router.push({
        name: "createAppAlarmTemplate",
        query: { id: row.template.id },
      }) // 跳转到
    },
    // 模板处理
    templateHandle() {
      if (this.type) {
        this.getList()
      } else if (this.$store.state.moduleUserInfo.userInfo.user) {
        this.getList()
      }
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
.page-box {
  padding-top: 10px;
  text-align: right;
}
.btn-box {
  padding: 0 0 20px 0;
}
.top-search {
  display: flex;
  justify-content: space-between;
}
.top-search >>> .el-input-group {
  width: 260px;
}
.small-form >>> .el-input,
.small-form >>> .el-textarea__inner {
  width: 300px;
}
.bottom-btn-box {
  text-align: right;
}
.alarm-rules-p {
  white-space: nowrap;
  width: 100%;
  margin-bottom: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
}
.alarm-rules-box .alarm-rules-p:last-child {
  margin-bottom: 0;
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
}
</style>
