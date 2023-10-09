<template>
  <div class="dilatation-list">
    <div style="margin-bottom: 20px">
      <label style="font-size: 14px">应用：</label>
      <SelectApp v-model="form.appId" :platformType="0"/>
    </div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="container" label="容器名称"> </el-table-column>
      <el-table-column prop="nameSpace" label="命名空间"> </el-table-column>
      <el-table-column prop="replicas" label="当前副本数"> </el-table-column>
      <el-table-column prop="setReplicas" label="扩容副本数"> </el-table-column>
      <el-table-column prop="envId" label="envId"> </el-table-column>
      <el-table-column prop="time" label="扩容时间戳" width="170px">
        <template slot-scope="scope">
              {{scope.row.time && $dateFormat(scope.row.time, 'yyyy-mm-dd HH:MM:ss')}}【{{scope.row.time}}】
        </template>
      </el-table-column>
      <el-table-column :label="$t('createTime')" width="180px">
        <template slot-scope="scope">
          {{scope.row.time && $dateFormat(scope.row.createTime, 'yyyy-mm-dd HH:MM:ss')}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import server from "@/api/service/app-health.js"
import SelectApp from '@/components/SelectApp.vue';
export default {
  components:{
    SelectApp,
  },
  data() {
    return {
      form: {
        appId: "",
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
      server.getDilatationRecord(this.form).then((res) => {
        console.log('res.list', res.list);
        this.tableData = res.list ||[]
        this.loading = false;
      }).catch(()=>{
        this.loading = false;
      })
    },
  },
}
</script>
<style scoped>
.danger{
  color:#f56c6c;
  cursor: pointer;
}
.health{
  color:#67c23a;
}
.dilatation-list{
  padding: 20px;
}
</style>
