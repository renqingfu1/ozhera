<template>
  <div class="container">
    <!-- <el-input v-model="filterText" size="small" class="input" 
      suffix-icon="el-icon-search"/> -->
    <el-tree class="tree" ref="tree" @current-change="onNodeChange"
      :data="treeData"
      v-loading="loading"
      node-key="id"
      :default-expanded-keys="['1']"
      :filter-node-method="filterNode"
      highlight-current
      :expand-on-click-node="false"
      :props="defaultProps">
    </el-tree>
  </div>
</template>

<script>
import server from '@/api/service/aggregation'

export default {
  components: { 
  },
  data() {
    return {
      loading: true,
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'cname'
      }
    }
  },
  watch: {
    // filterText(val) {
    //   this.$refs.tree.filter(val);
    // }
  },
  mounted() {
    server.getDepartmentTree().then(data => {
      this.treeData = [data]
      this.loading = false
    }).catch(() => {
      this.loading = false
    })
  },
  methods: {
    onFilter(val) {
      console.log('DeptTree onFilter', val)
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    onNodeChange(data) {
      this.$emit('node-change', data);
    }
  },
}
</script>

<style lang="less" scoped>
.container {
  background: white;
  padding: 10px;
}
.input {
  margin: 15px 0;
}
.tree {
  height: 100%;
  flex: 1;
}
</style>
