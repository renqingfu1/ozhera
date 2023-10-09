<template>
  <div >
    <div class="top-search">
      <el-input :placeholder="$t('indexPage.enterKeywords')"
       v-model="filterText" class="top-input"></el-input>
    </div>
    <div class="tree-box">
      <el-tree
        ref="tree"
        :data="spaceStore"
        node-key="key"
        :filter-node-method="filterNode"
        :default-expanded-keys="expandedKeys"
        :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span @click="clickItem(node,data)"
          :class="data.level=='store'?'store-label':'space-label'">{{ node.label}}</span>
          <span v-if="data.level =='store'">
            <el-button
              type="text"
              size="mini"
              class="save-btn"
              @click="() => addStar(node, data)">
              <i
              :class="[data.isFavourite ==1?'saved-star':'saved-star-no','el-icon-star-on']"></i>
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
  </div>

</template>
<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      filterText: '',
      data: [],
      expandedKeys: ['90008_eco-xunkids', '90010_线上业务研发组--Staging'],
    };
  },
  computed: {
    ...mapState({
      spaceStore: (state) => state.moduleSaved.spaceStore,
    }),
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    ...mapActions('moduleSaved', ['AddSaveItem', 'GetSaveStoreList', 'GetTreeAction', 'RemoveStoreTailAction']),
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1
      || (data.spaceName && data.spaceName.indexOf(value) !== -1);
    },
    append(node, data) {
      const { parent } = node;
      const val = {
        spaceName: parent.data.label,
        spaceId: parent.data.value,
        storeName: data.label,
        storeId: data.value,
      };
      this.$emit('selectStore', val);
    },
    addStar(node, data) {
      let params = { sort: 3 };// store
      const newData = !data.isFavourite;
      if (data.isFavourite) { // 取消收藏
        params = { ...params, id: data.value }; // tail或store的id}
        this.RemoveStoreTailAction({
          params,
          callback: () => {
            this.updateStore({
              data,
              type: 'isFavourite',
              newData,
              msg: '取消收藏成功！',
            });
          },
        });
      } else { // 收藏
        params = {
          ...params,
          spaceId: data.spaceId,
          spaceName: data.spaceName,
          storeId: data.value,
          storeName: data.label,
        };
        this.AddSaveItem({
          params,
          callback: () => {
            this.updateStore({
              data,
              type: 'isFavourite',
              newData,
              msg: '收藏成功！',
            });
          },
        });
      }
    },
    updateStore({
      data, type, newData, msg,
    }) {
      this.GetSaveStoreList();
      this.$set(data, type, newData);
      this.$message.success(msg);
    },
    clickItem(node, data) {
      if (data.level === 'space') {
        this.$set(node, 'expanded', !node.expanded);
      } else {
        this.append(node, data);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  ::v-deep .store-label:hover{
    color: #1890ff;
  }
}
.top-search{
  padding: 0 9px;
}
.top-input{
  width: 304px;
  margin-bottom: 5px;
}
.tree-box{
  max-height: 200px;
  overflow-y:auto ;
  overflow-x:hidden ;
}
.saved-star{
  color:#f9ba01;
}
.saved-star-no{
  color:#65676b;
}
.el-icon-star-on{
  font-size: 15px;
}

</style>
