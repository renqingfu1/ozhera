<template>
  <div class="tree-box">
    <div class="none-store-action">
      <span class="left-title">{{ $t('treeComponent.title') }}</span>
      <el-button type="text" @click="newCreateStoreFn" :disabled="editDisabled" >
        <i class="iconfont icon-add"></i>
      </el-button>
    </div>
    <div class="tree-ul">
      <UserSpaceTree v-model="spaceTree"
        @clickStore="clickSearch"
        @clickTailFn="clickTailFn"
        @deleteTailFn="deleteTailClick"
        @clickProgress="clickProgress"
        @editStore="editStore"
        @showAnalysis="showAnalysis"
        @clickAddTail="clickAddTail"/>
    </div>
    <el-drawer title="创建tail" :visible.sync="createTailVisible" direction="rtl" :size="660"
    class="create-tail-drawer">
      <div class="creat-tail-box">
        <CreateTail
        v-if="createTailVisible"
        :spaceId="$route.query.spaceId"
        :storeId="storeId"
        tailId=""
        ref="createTail"
        @switchShowCreate="switchShowCreateTail"
        @getListFn="refresh"
        />
        <CreateTailFooter @switchShowDialog="switchShowCreateTail" @submitCreate="submitCreate"/>
      </div>
    </el-drawer>
    <el-dialog
      title="新增store"
      :visible.sync="showCreateStore"
      :close-on-click-modal="false"
      append-to-body
      width="900px">
      <CreateStore v-if="showCreateStore" @onSuccess="refresh"
      @switchShowDialog="switchShowCreateStore"
      :spaceId="$route.query.spaceId"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import CreateStore from '@/views/LogConfig/store/CreateStore.vue';
import { deleteTail } from '@/views/LogConfig/tail/tail';
import CreateTail from '@/views/LogConfig/tail/create-tail.vue';
import CreateTailFooter from '@/views/LogConfig/tail/CreateTailFooter.vue';
import UserSpaceTree from '@/components/user-space-tree/index.vue';
import EventBus from './event-bus';

export default {
  components: {
    CreateStore, CreateTail, CreateTailFooter, UserSpaceTree,
  },
  props: {
    editDisabled: {
      type: Boolean,
    },
  },
  data() {
    return {
      showCreateStore: false, // 是否展示创建store的弹窗
      keyList: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      createTailVisible: false,
      storeId: null,
    };
  },
  computed: {
    ...mapState({
      editableTabs: (state) => state.moduleSpaceTree.editableTabs,
      spaceTree: (state) => state.moduleSpaceTree.spaceTree,
      defaultExpandedKeys: (state) => state.moduleSpaceTree.defaultExpandedKeys,
    }),
    manangeName() {
      return this.$t('manangeNameLang');
    },
  },
  mounted() {
    this.getInitData();
    EventBus.$on('getTreeList', () => {
      this.refresh();
    });
  },
  watch: {
    $route(from, to) {
      if (`${from.query.spaceId}` !== `${to.query.spaceId}`) { // 如果spaceID变了
        this.getInitData();
      }
    },
  },
  methods: {
    ...mapActions('moduleSpaceTree', ['setSpaceTreeAction', 'getSpaceTreeAction']),
    ...mapMutations('moduleSpaceTree', ['setActvieTab', 'addTabMutation', 'addExpanedKey', 'removeExpandKey', 'deleteTabMutaion']),
    switchShowCreateTail() {
      this.createTailVisible = !this.createTailVisible;
    },

    submitCreate(ruleForm) {
      this.$refs.createTail.onSubmit(ruleForm);
    },
    newCreateStoreFn() {
      this.switchShowCreateStore();
    },
    switchShowCreateStore() {
      this.showCreateStore = !this.showCreateStore;
    },
    isExist(data) {
      let filter = [];
      filter = this.editableTabs.filter((item) => item.name === `${data.value}_${data.type}`);
      if (filter.length > 0) {
        this.setActvieTab(filter[0].name);
      }
      return filter.length > 0;
    },
    deleteTail,
    deleteTailClick(tail) {
      this.deleteTail(tail.value, this.deleteTabGetlist, tail);
    },
    clickSearch(data) {
      this.$nextTick(() => {
        this.searchBtn(data);
      });
    },
    deleteTabGetlist(tail) {
      this.refresh();
      this.deleteTabMutaion(`${tail.value}_tailDetail`);
    },
    clickProgress(data) {
      const type = 'progress';
      const content = {
        storeId: data.value,
        spaceId: this.$route.query.spaceId,
      };
      this.addTabFn(type, content, data);
    },
    showAnalysis(store) {
      const type = 'analysis';
      const content = {
        storeName: store.label,
        storeId: store.value,
        spaceId: this.$route.query.spaceId,
      };
      this.addTabFn(type, content, store);
    },
    // tailInfo tailId , tailName
    searchBtn(data, tailInfo) {
      const type = 'search';
      const content = {
        storeId: data.value,
        spaceId: this.$route.query.spaceId,
        ...tailInfo,
      };
      this.addTabFn(type, content, data);
    },
    clickAddTail(storeInfo) {
      this.storeId = storeInfo.value;
      this.switchShowCreateTail();
    },
    editStore(store) {
      const type = 'storeDetail';
      const content = {
        spaceId: this.$route.query.spaceId,
        storeId: store.value,
        ...store,
      };
      this.addTabFn(type, content, store);
    },
    clickTailFn({ tail, store }) {
      const type = 'tailDetail';
      const content = {
        tailId: tail.value,
        tailName: tail.label,
        storeId: store.value,
        spaceId: this.$route.query.spaceId,
      };
      this.addTabFn(type, content, tail);
    },
    // content 需要 storeId , tailId, tailName ,spaceId // 不需要storeName
    // data label value
    // inputV 输入框回显数据 ，只有初始化需要回显，否则清空
    addTabFn(type, content, data, inputV) {
      this.$router.push({
        query: {
          ...this.$route.query,
          inputV: inputV || '',
          storeId: content.storeId,
          tailId: content.tailId,
          tailName: content.tailName,
          type,
        },
      });
      this.addTabItem(type, content, data);
    },
    addTabItem(type, content, data) {
      if (this.isExist({ ...data, ...{ type } })) return;
      const types = [{
        label: '收集',
        value: 'progress',
      }, {
        label: this.$t('search'),
        value: 'search',
      }, {
        label: this.manangeName,
        value: 'tailDetail',
      }, {
        label: this.manangeName,
        value: 'storeDetail',
      }, {
        label: '日志分析',
        value: 'analysis',
      }];
      const title = types.filter((item) => item.value === type)[0].label;
      const tab = {
        title: `${data.label}${title}`,
        name: `${data.value}_${type}`, // name 保存id type
        type,
        content: {
          ...content,
          isEditDisabled: () => this.editDisabled,
        },
      };
      this.addTabMutation(tab);
      this.setActvieTab(tab.name);
    },
    async getInitData() {
      const { query } = this.$route;
      const { type, spaceId } = query;
      await this.getSpaceTreeAction(spaceId);
      // 如果地址栏没有storeId则取第一个store
      const curStore = this.getStoreDetail();
      if (!curStore) return;
      const otherTypes = ['tailDetail', 'storeDetail', 'progress', 'analysis'];
      const typeIndex = otherTypes.indexOf(type);
      if (typeIndex > -1) {
        const tailOrStore = typeIndex === 0 ? this.getCurTail(curStore) : curStore;
        this.addTabItem(type, query, tailOrStore);
      } else { // 日志查询
        const content = {
          storeId: curStore.value,
          spaceId,
        };
        this.addTabItem('search', content, curStore);
      }
    },
    getCurTail(store) {
      const { tailId } = this.$route.query;
      const tail = store.children.filter((item) => `${item.value}` === `${tailId}`)[0];
      return tail;
    },
    getStoreDetail() {
      const { storeId } = this.$route.query;
      const realStore = storeId || this.spaceTree[0]?.value;
      if (!realStore) return false;
      const curStores = this.spaceTree.filter((item) => `${item.value}` === `${realStore}`);
      const curStore = curStores.length ? curStores[0] : {};
      return curStore;
    },
    refresh() {
      this.getSpaceTreeAction(this.$route.query.spaceId);
    },
  },
};
</script>
<style scoped>
.tree-component {
  width: 240px;
}
.tree-component .text-span {
  /* width: 240px; */
  width: 110px;
  padding-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
}
.tree-component >>> .el-tree-node__content {
  height: 30px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.right-btn >>> .el-button {
    padding: 2px;
    border: none;
    background: none;
}
.right-btn >>> .el-button--primary.is-plain:focus, .el-button--primary.is-plain:hover{
  background: #0170fe;
}
.none-store-action{
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: solid 1px #e9e9e9;
}
.right-btn >>> .el-button [class*=el-icon-]+span{
  margin-left: 1px;
}
.el-button--primary.is-plain{
  color:#0170fe;
}
.left-title{
  display: inline-block;
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  font-weight: 650;
  color: rgba(0,0,0,0.84);
}
.none-store-action >>> .el-button--text{
  font-size: 18px;
  padding: 0;
  color: rgba(0,0,0,0.65);
}
.tree-box{
  height: calc(100% - 10px);
}
.tree-ul{
  height: calc(100% - 39px);
  overflow-y:auto ;
}
.icon-add{
  font-size: 12px;
}
.creat-tail-box{
  padding:20px 0 20px 40px;
}
</style>
<style lang="scss" >
.create-tail-drawer{
  .el-drawer__header{
    margin-bottom: 15px;
    padding: 15px 20px 0 20px;
  }
}
</style>
