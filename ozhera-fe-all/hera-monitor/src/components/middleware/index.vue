<template>
  <div class="list-content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
          v-for="item in activeList"
          :key="item.value"
          :label="item.label"
          :name="item.value"
          class="db-redis-box"
      >
        <el-table :data="tableData[activeName]" v-loading="loading" size="small">
          <el-table-column width="1"></el-table-column>
          <div v-for="(row, index) in paramTemplate.tableColumns"
               :key="index">
            <el-table-column :prop="row.key"
                             :label="row.title"
                             :width="row.width"
                             :key="`${activeName}-${row.key}`"
                             v-if="!row.isShow || row.isShow.includes(activeName)"
                             :formatter="row.formatter">
              <template slot-scope="scope">
                <span v-if="row.slot">
                  <a v-if="row.slot === 'url' && scope.row[row.key]"
                     :href="scope.row[row.key]"
                     style="color:#409EFF"
                     target="_blank">查看监控</a>
                </span>
                <span v-else>
                  {{scope.row[row.key] || (row.key === 'projectName' ? $route.query.name : '')}}
                </span>
              </template>
            </el-table-column>
          </div>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import paramTemplate from './param-template'
import server from '@/api/service/application.js';

export default {
  name: 'middleware',
  components: {},
  props: {},
  data() {
    return {
      loading: false,
      activeName: "db", // tab选中值
      activeList:[{
        label: 'DB',
        value: 'db'
      }, {
        label: 'Redis',
        value: 'redis'
      }],
      paramTemplate: paramTemplate,
      tableData: {
        'db': [],
        'redis': []
      },
      isGetData: {} // 是否已请求过数据
    }
  },
  watch: {
    '$route' () {
      this.isGetData = {} // 是否已请求过数据
      this.getListFn() // 获取中间件实例列表
    }
  },
  mounted() {
    this.activeName = 'db'
    this.getListFn() // 获取中间件实例列表
  },
  methods: {
    handleClick() {
      if (!this.isGetData[this.activeName]) {
        this.getListFn() // 获取中间件实例列表
      }
    },
    // 获取中间件实例列表
    getListFn() {
      this.loading = true;
      this.tableData[this.activeName] = [];
      const param = {
        projectName: this.$route.query.name,
        projectId: Number(this.$route.query.id),
        type: this.activeName
      }
      server.getMiddlewareList(param).then(data => {
        this.loading = false;
        this.isGetData[this.activeName] = true;
        this.tableData[this.activeName] = data.list || []
      }).catch(() => {
        this.loading = false;
      })
    }
  }
}
</script>

<style lang="less" scoped>
.list-content {
  padding: 20px;
  padding-top: 0;
  margin-right: 16px;
  background: #fff;
}
.list-content ::v-deep .el-tabs--top .el-tabs__content .db-redis-box{
  padding-left: 0;
}
</style>
