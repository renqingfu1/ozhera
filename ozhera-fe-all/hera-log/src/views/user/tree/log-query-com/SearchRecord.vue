<!--
 * @Description:
 * @Date: 2022-04-12 16:00:51
 * @LastEditTime: 2022-05-06 14:44:08
-->
<template>
<div v-if="page !=='index'">
  <el-popover  popper-class="search-record-popover" v-model="visible" trigger="manual"
    placement="bottom">
    <!-- 查询记录按钮 -->
    <div  slot="reference" class="search-record-btn" @click="visible = !visible" >
      <i class="el-icon-mobile"></i><i class="el-icon-arrow-down"></i>
    </div>
   <!-- 内容 -->
    <div class="search-record" @click.stop="recordBoxClick">
      <!-- 头部 -->
      <div class="search-record-header">已保存查询</div>
      <!-- 有数据的展示 -->
      <div class="search-record-content">
        <!-- 提示 -->
        <div class="tip">
          {{recordData.length?'保存想要再次使用的查询文本和筛选。':'没有已保存查询。 保存想要再次使用的查询文本和筛选。'}}
        </div>
        <div v-if="recordData.length">
          <el-input v-model="input" placeholder="请输入存储记录名" class="input-filter"></el-input>
          <!-- 记录列表 -->
          <ul  class="list">
            <li v-for="(item,index) in recordDataFilter" :key="index"
            @click.stop="recordClick(item)"
            :class="[item.selected?'selected':'']">
              <div class="detail" >
                <span><i class="el-icon-check" v-if="item.selected"></i>{{item.name}} </span>
                <el-tooltip class="item" effect="dark" :content="item.common" placement="top">
                  <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
              </div>
              <i class="el-icon-delete" @click.stop="deleteRecordClick(item)"></i>
            </li>
          </ul>
        </div>
      </div>
      <!-- 底部 -->
      <div class="search-record-footer">
        <!-- 有选中项 -->
        <div v-if="currentRecordData.name"  class="has-selected-footer">
          <el-button type="text" @click="clearRecord">清除</el-button>
          <div>
            <el-button type="primary" plain @click.stop="reSaveRecord">另存为新的</el-button>
            <el-button type="primary" @click.stop="saveRecord">保存更改</el-button>
          </div>
        </div>
        <!-- 没有选中项 -->
        <div v-else class="no-selected-footer">
            <el-button type="primary" @click.stop="saveCurrentRecord">保存当前查询</el-button>
        </div>
      </div>
    </div>
  </el-popover>
  <!-- 保存查询 -->
  <SearchRecordDialog
    :searchRecordDialog="searchRecordDialog"
    :closeRecordDialog="closeRecordDialog"
    :storeId="myStoreId"
    :param="param"
    :startTime="startTime"
    :endTime="endTime"
    :getRecordList="getRecordList"
    :editInfo="editInfo"
    :tailId="tailIdProps"
    @afterSaved="afterSaved"
    ></SearchRecordDialog>
</div>
</template>

<script>
import {
  searchRecordList, deleteRecord,
} from '@/common/req/list/logConfig';
import SearchRecordDialog from './SearchRecordDialog.vue';

export default {
  name: 'SearchRecord',
  components: {
    SearchRecordDialog,
  },
  props: {
    storeId: {
      type: Number,
    },
    // 参数
    param: {
      type: String,
      default: '',
    },
    // 开始时间
    startTime: {
    },
    // 结束时间
    endTime: {
    },
    page: {
      type: String,
    },
    tailId: {
      type: Array,
    },
  },
  computed: {
    myStoreId() {
      return this.storeId;
    },
    recordDataFilter() {
      return this.recordData.filter((item) => item.name.indexOf(this.input) > -1);
    },
    tailIdProps() {
      return this.tailId;
    },
  },
  data() {
    return {
      visible: false,
      recordData: [], // 查询数据列表
      currentRecordData: {}, // 当前选中项
      searchRecordDialog: false, // 保存查询记录弹窗
      editInfo: {},
      input: '',
    };
  },
  mounted() {
    // 获取列表
    if (this.page !== 'index') {
      this.getRecordList();
    }
    // 点击其他地方隐藏记录菜单
    document.addEventListener('click', () => {
      this.visible = false;
    }, true);
  },
  methods: {
    afterSaved() {
      this.getRecordList();
    },
    // 显示记录菜单
    recordBoxClick() {
      this.visible = true;
    },
    // 获取查询记录数据
    getRecordList() {
      // 查询记录数据
      searchRecordList({
        storeId: this.myStoreId,
        sort: 1,
      }).then((res) => {
        if (res && res.code === 0 && res.data) {
          // 当前的缓存
          const currentQueryName = sessionStorage.getItem('currentQueryName');
          const resList = res.data || [];
          // 所有的查询数据
          this.recordData = resList.map((item) => {
            if (item.name === currentQueryName) {
              this.currentRecordData = item;
            }
            return {
              ...item,
              selected: item.name === currentQueryName,
            };
          });
          // this.total = res.data.total;
        }
      });
    },
    // 当前页改变
    // handleCurrentChange(val) {
    //   this.currentPage = val;
    //   this.getRecordList();
    // },
    // 记录点击
    recordClick(data) {
      this.currentRecordData = data;
      this.recordData = this.recordData.map((item) => ({
        ...item,
        selected: item.name === data.name,
      }));
      // 隐藏
      this.visible = false;
      // 进行查询操作
      this.$emit('searchSubmit', data);
    },
    // 删除记录点击
    deleteRecordClick(item) {
      this.$confirm(this.$t('delTips'), this.$t('prompt'), {
        confirmButtonText: '删除',
        confirmButtonClass: 'sure-delete-btn',
        cancelButtonText: this.$t('cancle'),
        type: 'warning',
      }).then(() => {
        deleteRecord({
          id: item.id,
        }).then((res) => {
          if (res && res.code === 0) {
          // 如果删除的是选中项
            if (item.id === this.currentRecordData.id) {
              this.clearRecord();
            }
            // 刷列表
            this.getRecordList();
            // 隐藏
            this.visible = false;
          }
        });
      }).catch(() => {
      });
    },
    // 清除
    clearRecord() {
      sessionStorage.removeItem('currentQueryName');
      this.currentRecordData = {};
      this.$emit('searchSubmit', '');
      this.recordData = this.recordData.map((item) => ({
        ...item,
        selected: false,
      }));
    },
    // 另存为新的
    reSaveRecord() {
      this.searchRecordDialog = true;
      this.editInfo = {};
    },
    // 保存更改
    saveRecord() {
      this.searchRecordDialog = true;
      this.editInfo = this.currentRecordData;
    },
    // 保存当前查询
    saveCurrentRecord() {
      this.searchRecordDialog = true;
      this.editInfo = {};
    },
    // 关闭弹窗
    closeRecordDialog() {
      this.searchRecordDialog = false;
      // 隐藏
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.save-btn{
  border-radius: 0;
  height: 38px;
  padding: 10px;
}
// 查询记录按钮
.search-record-btn{
  border:1px solid #dcdfe6;
  border-right:none;
  display: flex;
  align-items: center;
  padding-left: 4px;
  padding-right: 4px;
  height: 38px;
  cursor: pointer;
  .el-icon-mobile,.el-icon-arrow-down{
    color: #C0C4CC;
  }
  .el-icon-mobile{
    margin-right: 2px;
  }
  &:hover{
    .el-icon-mobile,.el-icon-arrow-down{
     color: #0071c2;
  }
  }
}
.search-record{
  &-header{
    padding: 16px;
    border-bottom: 1px solid #e9e9e9;
    font-weight: bold;
  }
  &-content{
    .tip{
      padding:12px 12px 6px 12px
    }
    .input-filter{
      margin-left: 10px;
    }
    .list{
      padding: 6px 4px;
      max-height: 200px;
      overflow: auto;
      li{
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        .detail{
          line-height: 24px;
          padding: 4px 8px;
          color: #0071c2;
          width: calc(100% - 32px);
          min-width: 30px;
          display: flex;
          align-items: center;
        }
        span{
          display: inline-block;
          max-width: calc(100% - 18px);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 4px;
        }
        .el-icon-delete{
          opacity: 0;
          margin-right: 8px;
          transition: opacity .15s;
          color: #bd271e;
          width: 24px;
          height: 24px;
          margin-right: 8px;
          display: inline-block;
          text-align: center;
          line-height: 24px;
          &:hover{
            background-color: rgba(189,39,30,.1);
            border-radius: 4px;
          }
        }
        &:hover{
          background-color: rgba(211,218,230,.25);
          span{
            text-decoration: underline;
          }
          .el-icon-delete{
          opacity: 1;
          }
        }
        &.selected{
          background-color: rgba(211,218,230,.25);
          .el-icon-check{
            margin-right: 12px;
          }
          .detail{
            color: #343741;
          }
          span{
            font-weight: 700;
          }
        }
      }
    }
    .page{
      display: flex;
      justify-content: center;
      padding: 6px 12px 4px;
    }
  }
  &-footer{
    margin-top: 8px;
    padding: 16px;
    border-top: 1px solid #e9e9e9;
    .has-selected-footer{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .no-selected-footer{
      display: flex;
      align-items: center;
      justify-content:flex-end
    }
  }
}
</style>
<style lang="scss">
// 弹出框
.search-record-popover{
  max-width: 400px;
  padding: 0px!important;
}
.sure-delete-btn{
  background-color: #F56C6C!important;
  border-color:#F56C6C!important;
  &:hover{
    opacity: 0.9;
  }
}
</style>
