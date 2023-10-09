<template>
  <div class="store-item-box line-height-20" >
    <p class="store-name pointer" :class="store.value==$route.query.storeId?'active':''">
      <i :class="['iconfont', 'icon-sanjiao3',' pointer', showDetail?'rotated':'' ]"
      @click="switchShowFn" ></i>
      <span class="store-name-label" @click="clickStore(store)">
        <span class="store-name-span">{{store.label}}</span>
      </span>
    </p>
    <div class="store-innner" v-show="showDetail">
      <div class="btn-box line-height-20">
        <!-- <MiButton icon="el-icon-search" @click="clickStore(store)">查询</MiButton> -->
        <MiButton icon="iconfont icon-analysis" @click="clickAnalysis(store)">
          {{ $t('logQuery.analyze') }}</MiButton>
        <MiButton icon="iconfont icon-shalou" @click="clickProgress(store)">
          {{ $t('logQuery.collect') }}
        </MiButton>
        <MiButton icon="iconfont icon-edit" @click="editStore(store)">
          {{ $t('edit') }}
        </MiButton>
        <MiButton icon="iconfont icon-key" @click="impower(store)">
          {{ $t('empower') }}
        </MiButton>
      </div>
      <div class="data-link children">
        <div class="data-detail" >
          <div class="children">
            <div class="log-tail-config">
              <div class="left">
                <i :class="['iconfont', 'icon-sanjiao3','pointer',
                store.children && store.children.length>0?'':'hide',
                showTail?'rotated':''
                ] "
                  @click="switchShowTailFn"
                ></i>
                <span >{{ $t('logQuery.logTailManage') }}</span>
              </div>
              <div class="right add-tail">
                <MiButton icon="iconfont icon-add" @click="clickAddTail(store)"></MiButton>
              </div>
            </div>
            <ul v-show="showTail" class="tail-ul">
              <li
              @click="clickTailFn({tail,store})"
              v-for="tail in store.children" :key="tail.value" class="tail-li pointer">
                <span class="tail-span">
                  <el-tooltip effect="dark" :content="tail.label"
                  placement="top-start">
                    <i >{{tail.label}}</i>
                  </el-tooltip>
                </span>
                <MiButton icon="el-icon-delete" @click="deleteTail(tail)" class="delete-tail">

                </MiButton>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
    <el-dialog
      title="授权"
      :visible.sync="dialogVisible"
      width="350px"
      append-to-body
      class="impower-body">
      <div class="space-select">
        <span>授权space：</span>
        <SelectImpowerSpace v-model="toImpowerId"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeImpower">取 消</el-button>
        <el-button type="primary" @click="confirmImpower">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import MiButton from '@/components/MiButton.vue';
import { impowerSpace } from '@/common/req/list/user/store-impower';
import SelectImpowerSpace from '@/components/user-space-tree/components/select-impower-space.vue';

export default {
  components: { MiButton, SelectImpowerSpace },
  props: {
    data: {
      require: true,
    },
  },
  computed: {
    store() {
      return this.data;
    },
  },
  data() {
    return {
      showDetail: false,
      // showData: false,
      showTail: false,
      dialogVisible: false,
      toImpowerId: '',
      impowerStoreId: '',
    };
  },
  methods: {
    switchShowFn() {
      this.showDetail = !this.showDetail;
    },
    // switchShowDataFn() {
    //   this.showData = !this.showData;
    // },
    switchShowTailFn() {
      this.showTail = !this.showTail;
    },
    clickStore(store) {
      this.$emit('clickStore', store);
    },
    clickProgress(store) {
      this.$emit('clickProgress', store);
    },
    clickTailFn(tailAndStore) {
      this.$emit('clickTailFn', tailAndStore);
    },
    deleteTail(tail) {
      this.$emit('deleteTail', tail);
    },
    clickAddTail(store) {
      this.$emit('clickAddTail', store);
    },
    editStore(store) {
      this.$emit('editStore', store);
    },
    clickAnalysis(store) {
      this.$emit('showAnalysis', store);
    },
    impower(store) {
      this.impowerStoreId = store.value;
      this.dialogVisible = true;
    },
    closeImpower() {
      this.dialogVisible = false;
      this.toImpowerId = '';
    },
    confirmImpower() {
      if (!this.toImpowerId) {
        this.$message.warning('请选择space');
        return;
      }
      impowerSpace({
        storeId: this.impowerStoreId,
        spaceId: this.toImpowerId,
      }).then(() => {
        this.$message.success('授权成功');
        this.closeImpower();
      });
    },
  },
};
</script>
<style scoped>
.rotated{
  transform: rotate(90deg);
}
.line-height-20{
  line-height: 40px;
}
.icon-sanjiao3{
  display: inline-block;
  font-size: 12px;
  margin:0 5px 0 10px;
  transition:all 500ms ease;
}
.btn-box {
  height: 40px;
  line-height: 25px;
  background: #f2f2f2;
  padding: 0 12px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.store-item-box{
  font-size: 14px;
}
.store-item-box >>> .el-button{
  font-size: 14px;
  padding:0px;
  display: flex;
  align-items: center;
}
.children{
  padding-left: 8px;
}
.tail-ul{
  padding-left:15px;
}
.pointer{
  cursor: pointer;
}
.store-name{
  display: flex;
}
.data-link,.store-name{
  border-bottom: solid 1px #ececec;
}
.store-name.active{
  background: rgb(139,194,248,.2)
}
.store-name-label{
  display: inline-block;
  width: 208px;
}
.store-btn {
  margin: 0 3px;
}
.tail-li{
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
}
.tail-li >>> .el-icon-delete,.log-tail-config >>> .el-icon-plus{
  font-weight: 800;
}
.tail-li .delete-tail{
  display: none;
}
.tail-li:hover .delete-tail{
  display: inline-block;
}
.log-tail-config{
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
}
.log-tail-config .add-tail {
  display: none;
}
.log-tail-config:hover .add-tail {
  display: inline-block;
}
.tail-span{
  display: inline-block;
  padding-left:13px;
  width: 180px;
  overflow: hidden;
  word-break: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
  direction: rtl;
  text-align: left;
}
.tail-span>i{
  font-style: normal;
}
.hide{
  visibility: hidden;
}
.icon-cunchushebei{
  font-size: 12px;
}
.store-name-span{
  display: inline-block;
  width:calc(100% - 15px);
  height: 20px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  text-align: left;
}
.dialog-footer{
  display: flex;
  justify-content: center;
}
.dialog-footer >>> .el-button{
  padding: 5px 10px;
}
</style>
