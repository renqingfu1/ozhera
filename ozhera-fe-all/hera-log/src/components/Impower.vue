<template>
  <el-dialog title="请选择需要授权的部门" :visible="dialogVisible" @close="closeDialog" width="30%">
    <el-input
      :placeholder="$t('IndexPage.enterKeywords')"
      v-model="filterText">
    </el-input>
    <el-tree
      ref="impowerTree"
      class="impower-tree"
      :data="treeData"
      show-checkbox
      node-key="id"
      :default-checked-keys="defaultKey"
      :filter-node-method="filterNode"
      :props="defaultProps">
    </el-tree>
    <el-row style="display:flex;justify-content:center;marginTop:20px">
      <el-button type="primary" @click="confirm">{{ $t('confirm') }}</el-button>
      <el-button @click="closeDialog">{{ $t('cancle') }}</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { getSpacePowerTree, editSpacePower } from '@/common/req/list/space-impower';

export default {
  props: {
    visible: {},
    propSpaceId: {},
  },
  computed: {
    dialogVisible() {
      return this.visible;
    },
    spaceId() {
      return this.propSpaceId;
    },
  },
  methods: {
    closeDialog() {
      this.$emit('changeVisible', false);
    },
    confirm() {
      const treeData = [...this.$refs.impowerTree.getCheckedKeys(), this.createDeptId];
      const treeDataNew = this.unique(treeData);
      const permDeptIds = treeDataNew.join(',');
      const params = {
        spaceId: this.spaceId,
        permDeptIds,
      };
      editSpacePower(params).then(() => {
        this.$message.success('授权成功');
        this.closeDialog();
      });
    },
    unique(arr) {
      // Set数据结构，它类似于数组，其成员的值都是唯一的
      return Array.from(new Set(arr)); // 利用Array.from将Set结构转换成数组
    },
    filterData() {
      const { treeData } = this;
      this.addParam(treeData);
    },
    addParam(param) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < param.length; i++) {
        const item = param[i];
        item.disabled = item.level !== 3;
        if (item.children) {
          this.addParam(item.children);
        } else {
          item.disabled = item.id === this.createDeptId;
        }
      }
    },
    getTreeData() {
      const params = { spaceId: this.spaceId };
      getSpacePowerTree(params).then(({ data }) => {
        this.createDeptId = data.createDeptId;
        this.checkId = (data.checkId && (data.checkId).split(',')) || [];
        this.defaultKey = this.checkId;
        this.treeData = data?.treeData?.children || [];
        this.filterData();
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  },
  watch: {
    visible(newV, oldV) {
      if (newV !== oldV && newV) {
        this.getTreeData();
      }
    },
    filterText(val) {
      this.$refs.impowerTree.filter(val);
    },
  },
  data() {
    return {
      filterText: '',
      defaultKey: [],
      treeData: [],
      defaultProps: 'label',
      createDeptId: null,
      checkId: [],

    };
  },
};
</script>
<style lang="scss" scoped>
.impower-tree {
  ::v-deep .el-tree-node .el-tree-node__content .el-checkbox.is-disabled{
    display: none;
  }
}

</style>
