<template>
  <div>
    <div class="top-box">
      <p class="left-title">LogStore{{$t('Attribute')}}</p>
      <div class="right">
        <el-button @click="saveData" v-if="!cannotEditStore">保存</el-button>
        <el-button :disabled="content.isEditDisabled()" @click="editStore" >
          {{cannotEditStore?$t('edit'):'取消'}}</el-button>
        <el-dropdown style="margin-left:10px" @command="handleCommand"
          :disabled="content.isEditDisabled()">
          <el-button plain  type="primary">
            {{$t('more')}}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="clickCopyStore">复制Logstore</el-dropdown-item>
            <el-dropdown-item command="clickDeleteStore">删除Logstore</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <CreateStore
    ref="createStore"
    :spaceId="content.spaceId"
    :storeId="content.storeId"
    :allCannotEdit="cannotEditStore"
    @onSuccess="editStoreSuc"
    :hideBtn="true"/>
    <el-dialog
      title="复制store"
      :visible.sync="showCopyStore"
      :close-on-click-modal="false"
      append-to-body
      width="900px">
      <CreateStore v-if="showCopyStore" @onSuccess="onCopySuccess"
        @switchShowDialog="switchShowCopyStore"
        :spaceId="$route.query.spaceId"
        :storeId="content.storeId" copyStore/>
    </el-dialog>
  </div>
</template>
<script>
import CreateStore from '@/views/LogConfig/store/CreateStore.vue';
import { mapMutations, mapState, mapActions } from 'vuex';
import { deleteStore } from '@/common/req/list/logConfig';
import EventBus from './event-bus';

export default {
  components: {
    CreateStore,
  },
  props: {
    content: {
      require: true,
      type: Object,
    },
  },
  computed: {
    ...mapState('moduleSpaceTree', ['activeTabValue']),
  },
  data() {
    return {
      showCopyStore: false,
      cannotEditStore: true,
    };
  },
  methods: {
    ...mapMutations('moduleSpaceTree', ['removeTab']),
    ...mapActions('moduleSpaceTree', ['getSpaceTreeAction']),
    editStore() {
      this.cannotEditStore = !this.cannotEditStore;
    },
    saveData() {
      this.$refs.createStore.onSubmit(true);
    },
    editStoreSuc() {
      this.cannotEditStore = true;
      this.getSpaceTreeAction(this.$route.query.spaceId);
    },
    onCopySuccess() {
      this.showCopyStore = false;
      this.getSpaceTreeAction(this.$route.query.spaceId);
    },
    switchShowCopyStore() {
      this.showCopyStore = false;
    },
    handleCommand(command) {
      if (command === 'clickDeleteStore') { // 删除store
        const { storeId } = this.content;
        this.$confirm('确定要删除这个store吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          deleteStore({ id: storeId }).then(() => {
            this.removeTab(this.activeTabValue);
            EventBus.$emit('getTreeList');
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
          });
        });
      } else if (command === 'clickCopyStore') {
        this.showCopyStore = true;
      }
    },
  },
};
</script>
<style scoped>
.top-box{
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding:20px;
}
.left-title{
  font-size: 16px;
  color: rgba(0,0,0,0,.85);
  font-weight: 800;
}
</style>
