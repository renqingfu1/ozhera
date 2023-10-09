<template>
  <div>
    <p class="empty-p" v-if="val.length==0">{{emptyMsg}}</p>
      <div v-else >
        <div class="input-box">
          <el-input v-model="searchVal" class="search-input"
          suffix-icon="el-icon-search"></el-input>
        </div>
        <ul  class="item-ul">
          <li  v-for="(item,index) in showVal"
            :key="item.value">
            <el-button type="text" class="btn-text" @click="selSaved(item,'space-store')">
              {{obj[typeName].showText.map(cur=>item[cur]).join(' | ')}}
            </el-button>
            <p class="btn-box">
              <el-button type="text" class="delete-btn" @click="delSaved(item)">
                <i class="el-icon-circle-close"></i>
              </el-button>
              <el-button type="text" class="top-btn" @click="toTop(item,index)"
              :disabled="index==0">
                <i class="el-icon-upload2" />
              </el-button>
            </p>
          </li>
        </ul>
      </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      searchVal: '',
      obj: {
        query: { // 查询条件
          showText: ['name'],
        },
        app: { // app
          showText: ['appName', 'tailName'],
        },
        store: { // store
          showText: ['spaceName', 'storeName'],
        },
      },
    };
  },
  props: {
    value: {},
    typeName: {
      type: String,
    },
    emptyMsg: {
      type: String,
    },
  },
  computed: {
    ...mapState({
      allStore: (state) => state.moduleSaved.allStore,
    }),
    val: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    showVal() {
      const searchVal = this.searchVal.toLowerCase();
      const { val } = this;
      if (searchVal.length > 0) {
        if (this.typeName === 'query') {
          return val.filter((item) => (item.name.toLowerCase()).indexOf(searchVal) > -1);
        } if (this.typeName === 'app') {
          return val.filter((item) => (item.appName.toLowerCase()).indexOf(searchVal) > -1
          || (item.tailName.toLowerCase()).indexOf(searchVal) > -1);
        } if (this.typeName === 'store') {
          return val.filter((item) => (item.storeName.toLowerCase()).indexOf(searchVal) > -1
        || (item.spaceName.toLowerCase()).indexOf(searchVal) > -1);
        }
      }
      return val;
    },
  },
  methods: {
    ...mapActions('moduleSaved', ['DelSaveItem', 'SwapSavedPosition']),
    selSaved(item) {
      const type = this.typeName === 'app' ? 'app' : 'space-store';
      const itemData = item.spaceId ? item : { ...item, ...this.getSpaceStore(item.storeId) };
      const val = {
        ...itemData,
        type,
      };
      this.$emit('selectVal', val);
      if (this.typeName === 'query') { // 查询条件
        const now = new Date().getTime();
        const timers = item.isFixTime === 0
          ? [now - 15 * 60 * 1000, now]
          : [item.startTime, item.endTime];
        this.$emit('changeTime', timers);
        this.$emit('changeInputV', item.queryText);
      }
    },
    getSpaceStore(storeId) {
      const store = this.allStore.filter((item) => item.value === storeId);
      if (store.length === 0) return {};
      return {
        spaceName: store[0].spaceName,
        spaceId: store[0].spaceId,
        storeId: store[0].value,
        storeName: store[0].label,
      };
    },
    delSaved(item) {
      const params = { id: item.id };
      this.DelSaveItem({
        params,
        type: this.typeName,
        callback: () => {
          this.$message.success('取消收藏成功！');
        },
      });
    },
    toTop(item, index) {
      console.log('item', item);
      this.SwapSavedPosition({
        params: {
          idFrom: item.id,
          idTo: this.val[index - 1].id,
        },
        type: this.typeName,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.item-ul{
    max-height: 180px;
    overflow-y: auto;
    li:first-child{
      border: none;
    }
  }
  li{
    font-size: 12px;
    padding: 5px 0 5px 10px;
    border-top: solid 1px #ebeef5;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .btn-box{
      display: inline-block;
      margin-left:0;
      padding: 0;
      opacity: 0;
      vertical-align: middle;
      .top-btn{
        margin-left: 2px;
      }
    }
  }
  li:hover{
    .btn-box{
      opacity: 1;
    }
  }
  .btn-text {
    width:calc(100% - 35px);
    padding:0;
    border: none;
    ::v-deep  span{
      display: inline-block;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: left;
      color: #606266;
      height: 16px;
      line-height: 16px;
      vertical-align: middle;
    }
    ::v-deep  span:hover{
      color: #348fff;
    }
  }
  .empty-p{
    padding: 10px;
    font-size: 12px;
  }
.input-box{
  padding:5px;
}
.search-input{
  width: 100%;
}
</style>
