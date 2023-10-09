<!--
  分页组件：基于el-pagination
 -->
<template>
  <div :class='`pagination ${marginTop ? "is-margin-top" : ""}`'>
    <div class='record'>共 {{total}} 条记录 第{{currentPage}} / {{Math.ceil(total/pageSize)}}页</div>
    <el-pagination
      :background='background'
      :pager-count='pagerCount'
      :current-page.sync='newCurrentPage'
      :page-size="pageSize"
      :total='total'
      :disabled='pageDisabled'
      :hide-on-single-page='hideSinglePage'
      :page-sizes="tuneUp ? [10,20,30] : []"
      :layout='tuneUp ? "prev, pager, next, sizes, jumper" : "prev, pager, next"'
      @size-change="doSizeChange"
      @current-change='doCurrentChange'>
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'lone-pagination',
  props: {
    background: {
      type: Boolean,
      default: true
    },
    marginTop: {
      type: Boolean,
      default: false
    },
    pagerCount: {
      type: Number,
      default: 5
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },
    pageDisabled: {
      type: Boolean,
      default: false
    },
    hideSinglePage: {
      type: Boolean,
      default: false
    },
    // 调整每页展示个数
    tuneUp: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      newCurrentPage: this.currentPage
    }
  },
  methods: {
    doCurrentChange (val) {
      this.$emit('doCurrentChange', val)
    },
    doSizeChange (val) {
      this.$emit('doSizeChange', val)
    }
  }
}
</script>

<style lang="less" scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  .record {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.427450980392157)
  }
}
.is-margin-top {
  margin-top: 15px;
}
</style>
<style lang="less">
/* .pagination.is-margin-top .el-pagination.is-background .el-pager li {
  margin: 0px;
} */
</style>
