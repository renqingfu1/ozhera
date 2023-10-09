<template>
  <div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="groupName" label="网关分组"> </el-table-column>
      <el-table-column prop="date" label="是否合格">
        <template slot-scope="scope">
          <span :class="scope.row.alarmNum===0?'danger':'health'">
            {{scope.row.alarmNum==0?'不合格':'合格'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="address" :label="$t('action')">
        <template slot-scope="scope">
          <el-button type="text" @click="openCreate(scope.row)">报警配置</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import server from "@/api/service/app-health.js"
export default {
  data() {
    return {
      form: {
        groupName: "",
      },
      total: 100,
      tableData: [],
      loading:false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true;
      server.getTeslaHealthList(this.form).then((res) => {
        this.tableData = res
        this.loading = false;
      }).catch(()=>{
        this.loading = false;
      })
    },
    openCreate(){
      this.$router.push({
        name:'WarnStrategyGatewayCreate',
      })
    }
  },
}
</script>
<style scoped>
.danger{
  color:#f56c6c;
}
.health{
  color:#67c23a;
}
</style>
