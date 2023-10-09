<template>
  <div>
    <lone-module class="title">
      <span class="title-text">应用进程报警策略</span>
    </lone-module>
    <div class="inner">
      <div class="table-box">
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
          <el-table-column prop="projectName" label="应用"> </el-table-column>
          <el-table-column prop="name" label="平台">
            <template slot-scope="scope">
              <div class="platform-div">
                <Platform :platformType="scope.row.appSource" />
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('action')">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="toConfigList(scope)">配置列表</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import serverApp from "@/api/service/application"
import Platform from "@/components/application/platform.vue"
import { mapActions } from "vuex"
export default {
  components: {
    Platform,
  },
  data() {
    return {
      tableData: [],
      loading:false
    }
  },
  mounted() {
    this.getList()
    this.GETPLATFORMLIST()
  },
  methods: {
    ...mapActions("modulePlatForm", ["GETPLATFORMLIST"]),
    getList() {
      this.loading = true;
      serverApp
        .getAppList({
          viewType: 0,
        })
        .then(res => {
          this.tableData = res.list;
          this.loading = false;
        }).catch(()=>{
          this.loading = false;
        })
    },
    toConfigList(scope){
      this.$router.push({
        params:{
          projectId: scope.row.projectId,
          projectName: scope.row.projectName,
        },
        name:'AppProgressConfig'
      })
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
.platform-div {
  ::v-deep .platform-tag {
    border: none;
    color: #6d6f73;
    font-size: 14px;
  }
  ::v-deep .el-tag--plain.el-tag--info{
    background: transparent;
  }
}

</style>