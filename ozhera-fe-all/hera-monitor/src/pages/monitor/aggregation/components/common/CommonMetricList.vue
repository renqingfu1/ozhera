<template>
  <div>
    <el-form
      :inline="true"
      :model="formInline"
      class="form-inline form"
      size="small"
    >
      <el-form-item>
        <el-input
          v-model="formInline.searchName"
          :placeholder="`请输入${searchMeta.label}`"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-select
          style="width: 210px"
          v-model="formInline.selectedMetricOptions"
          multiple
          collapse-tags
          placeholder="请选择指标名"
        >
          <el-option
            v-for="item in metricOptions"
            :key="item.name"
            :label="item.cname"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="formInline.date" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="clickSearch"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <el-pagination
      style="margin-bottom: 10px"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-table
      :data="tableData"
      v-loading="loading"
      @sort-change="onSort"
      :default-sort="{ prop: 'http_error_total', order: 'ascending' }"
    >
      <el-table-column
        v-if="!!this.nameClicked"
        prop="name"
        :label="searchMeta.label"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleNameClicked(scope.row, scope.$index)"
            >{{ scope.row.name }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column v-else prop="name" :label="searchMeta.label" />
      <el-table-column
        v-for="c in columns"
        :key="c.name"
        :prop="c.name"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
        :label="`${c.cname}（${c.unit}）`"
      />
    </el-table>
    <el-pagination
      style="margin-top: 10px"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      layout="total,sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import server from "@/api/service/aggregation"
import { getTimeSeconds } from "@/utils/index"
import SelectedMetricOptionsManager from './SelectedMetricOptionsManager'

export default {
  props: {
    curDept: {},
    curApp: {},
    metricType: {},
    metricOptions: {},
    selectedMetricOptions: {},
    defaultOrderBy: {},
    selectedChanged: {},
    nameClicked: {},
  },
  components: {},
  watch: {
    curDept() {
      this.onSearch()
    },
    curApp() {
      this.onSearch()
    },
    metricOptions(val) {
      if (val.length > 0) {
        this.formInline.selectedMetricOptions = this.selectedMetricOptions
        this.columns = this.metricOptions
        this.onSearch()
      }
    },
  },
  data() {
    return {
      searchMeta: {
        paramName: "appName",
        label:this.$t('appName'),
        valueKey: "app_name",
      },
      api: {
        fn: server.getDepartmentTable,
        getExtraParams: () => ({ departmentId: this.curDept.id }),
      },
      formInline: {
        searchName: "",
        selectedMetricOptions: [],
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      columns: this.metricOptions,
      orderBy: this.defaultOrderBy,
      order: "desc",
      tableData: [],
      loading: true,
      total: 0,
      pageSize: 10,
      pageSizes: [10, 50, 100],
      page: 1,
    }
  },
  mounted() {
    SelectedMetricOptionsManager.addListener(this.metricType, this.listenMetricSelection)
  },
  beforeDestroy() {
    SelectedMetricOptionsManager.removeListener(this.metricType, this.listenMetricSelection)
  },
  methods: {
    listenMetricSelection(metricType, selections) {
      console.log('listenMetricSelection', metricType, selections === this.formInline.selectedMetricOptions)
      if(selections !== this.formInline.selectedMetricOptions) {
        this.formInline.selectedMetricOptions = selections
        this.doSearch()
      }
    },
    onSort({ prop, order }) {
      console.log("AppList onSort", prop, order)
      this.orderBy = prop
      this.order = order === "ascending" ? "asc" : "desc"
      this.doSearch()
    },
    handleCurrentChange(page) {
      this.page = page
      this.doSearch()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.doSearch()
    },
    ensureOrderBy() {
      if (!this.formInline.selectedMetricOptions.includes(this.orderBy)) {
        let name
        for (let i = 0; i < this.metricOptions.length; i++) {
          name = this.metricOptions[i].name
          if (this.formInline.selectedMetricOptions.includes(name)) {
            this.orderBy = name
            return
          }
        }
      }
    },
    getSortedMetricParams() {
      const ret = []
      let name
      for (let i = 0; i < this.metricOptions.length; i++) {
        name = this.metricOptions[i].name
        if (this.formInline.selectedMetricOptions.includes(name)) {
          ret.push(name)
        }
      }
      return ret
    },
    search(date) {
      this.formInline.date = new Date(date)
      this.onSearch()
    },
    clickSearch() {
      if (this.formInline.selectedMetricOptions.length === 0) {
        this.$message.warning("请选择指标名")
        return
      }
      this?.selectedChanged(
        this.metricType,
        this.formInline.selectedMetricOptions
      )
      this.onSearch()
    },
    onSearch() {
      this.page = 1
      this.doSearch()
    },
    canSearch() {
      return true
    },
    doSearch() {
      if (this.formInline.selectedMetricOptions.length === 0) {
        console.log("CommonMetricList doSearch empty metric.", this.metricType)
        return
      }
      if (!this.canSearch()) {
        return
      }
      this.loading = true
      const { date, searchName } = this.formInline
      this.ensureOrderBy()
      const { fn, getExtraParams } = this.api
      fn({
        [this.searchMeta.paramName]: searchName,
        metricsType: this.metricType,
        metrics: this.getSortedMetricParams(),
        time: getTimeSeconds(date),
        orderBy: this.orderBy,
        order: this.order,
        pageSize: this.pageSize,
        page: this.page,
        ...getExtraParams(),
      })
        .then(data => {
          if (data) {
            this.columns = data.meta_datas
            this.total = data.total
            this.tableData = data.metric_datas.map(item => {
              const ret = {
                appId: item.labels.app_id,
                name: item.labels[this.searchMeta.valueKey],
              }
              this.columns.forEach((m, index) => {
                ret[m.name] = item.values[index].value
              })
              return ret
            })
          } else {
            this.columns = this.metricOptions
            this.tableData = []
          }
          this.loading = false
        })
        .catch(() => {
          this.tableData = []
          this.loading = false
        })
    },
    handleNameClicked(row, index) {
      this?.nameClicked(row, index)
    },
  },
}
</script>

<style lang="less" scoped>
.form {
  margin: 20px 0 -5px 0;
}
</style>
