<template>
  <el-tabs
    v-model="activeTabValue"
    type="card"
    closable
    @tab-remove="removeTabInner"
    @tab-click="tabClick"
    class="my-tree-tabs"
  >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
    >
      <TabItem :content="item.content" :type="item.type"/>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import TabItem from './tab-item.vue';

export default {
  components: { TabItem },
  computed: {
    ...mapState({
      spaceTree: (state) => state.moduleSpaceTree.spaceTree,
      editableTabs: (state) => state.moduleSpaceTree.editableTabs,
    }),
    activeTabValue: {
      get() {
        return this.$store.state.moduleSpaceTree.activeTabValue;
      },
      set(value) {
        this.$store.commit('moduleSpaceTree/setActvieTab', value);
      },
    },
  },
  data() {
    return {
    };
  },
  methods: {
    ...mapMutations('moduleSpaceTree', ['removeTab']),
    removeTabInner(tabName) {
      this.removeTab(tabName);
    },
    tabClick(val) {
      const filter = this.editableTabs.filter(
        (item) => item.name === val.name && item.title === val.label,
      );
      const { content } = filter[0];
      this.$router.push({
        query: {
          ...this.$router.query,
          spaceId: content.spaceId,
          storeId: content.storeId,
          tailName: content.tailName,
          tailId: content.tailId,
          type: val.name.split('_')[1],
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.my-tree-tabs{
  >::v-deep .el-tabs__header{
    margin-bottom: 10px;
    .el-tabs__nav{
      border-radius: 0;
      border-top: none;
      border-left: none;
    }
    .el-tabs__item{
      height: 30px;
      line-height: 30px;
      background: #fafafa;
      border-bottom: solid 1px #efefef;
    }
    .el-tabs__item.is-active{
      background: #fff;

    }
  }
  ::v-deep .el-tabs__content{
    height: calc(100% - 40px);
  }
  ::v-deep .el-tab-pane{
    height: 100%;
  }
}
</style>
