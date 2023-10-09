<template>
  <div>
    <lone-module>
      <el-button size='mini' id='but'>添加</el-button>
    </lone-module>
    <lone-module marginTop>
      <el-table :data="newTableList" stripe class='table-list'>
        <el-table-column label="id" prop='id' width="200"></el-table-column>
        <el-table-column label="name" prop='name' width=""></el-table-column>
        <el-table-column label="描述" prop='desc' width=""></el-table-column>
        <el-table-column :label="$t('createTime')" prop='cTime' width=""></el-table-column>
        <el-table-column :label="$t('updateTime')" prop='uTime' width=""></el-table-column>
        <el-table-column :label="$t('action')" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" round size="small" @click='editRow(scope.row.name)'>{{ $t('edit') }}</el-button>
            <el-button type="danger" round size="small" @click='deleteRow(scope.row.name)'>{{ $t('remove') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </lone-module>
  </div>
</template>

<script>
import tableList from '@/mock/tableList'
import { formatTime } from '@/utils'

export default {
  data() {
    return {
      tableList,
      newTableList: []
    }
  },
  created() {
    this.dealTableList();
  },
//   mounted() {
//         this.$nextTick(() => {
// console.log(document.getElementById('but'))
//     })
//   },
  methods: {
    dealTableList() {
      this.newTableList = this.tableList.map(item => ({
          ...item,
          cTime: formatTime(item.cTime),
          uTime: formatTime(item.uTime)
        })
      )
    },
    editRow(name) {
      this.$message.warning(`${name}数据暂不支持编辑~`)
    },
    deleteRow(name) {
      this.$message.warning(`${name}数据暂不支持删除~`)
    }
  }
}
</script>

<style lang="less" scoped>

</style>