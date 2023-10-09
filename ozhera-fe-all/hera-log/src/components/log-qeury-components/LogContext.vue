<template>
  <div class="log-context"
    v-if="viewVisible"
    >
    <el-button
      class="show-context-btn"
      type="primary" plain round @click="handleShowContext">
      {{ $t('logQuery.viewContext') }}</el-button>
    <el-drawer
      :title="$t('logQuery.viewContext')"
      :visible.sync="drawer"
      @open="openDrawer"
      size="1000px"
      direction="rtl">
      <div class="drawer-box"
        v-loading="loading"
        >
         <el-button type="primary" plain icon="el-icon-arrow-up" class="more-btn up-btn"
          @click="getMore('up')">{{ $t('logQuery.loadmoreUp') }}</el-button>
         <div class="table-box" ref="tableBox">
          <el-table
            :data="tableData"
            :show-header="false"
          >
            <el-table-column type="expand" class="expand-box">
              <template slot-scope="props">
                <json-view
                  :data="props.row.logOfKV || {}"
                  class="json-view-box"
                />
              </template>
            </el-table-column>
            <el-table-column prop="time"  width="150px" >
              <template slot-scope="props">
                {{props.row.logOfKV &&
                $dateFormat(props.row.logOfKV.timestamp, 'yyyy/mm/dd HH:MM:ss')}}
              </template>
            </el-table-column>
            <el-table-column prop="logOfString"  >
              <template slot-scope="scope">
                <LogItem
                :logType="logType"
                :itemData="scope.row"
                :showLogContext="false"
                :showTraceId="false"
                :formInline="formInline"
                />
              </template>
            </el-table-column>
          </el-table>
         </div>
        <el-button type="primary" plain icon="el-icon-arrow-down" class="more-btn down-btn"
         @click="getMore('down')">{{ $t('logQuery.loadmoreDown') }}</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('cancle')}}</el-button>
        <el-button type="primary" @click="dialogVisible = false">{{$t('confirm')}}</el-button>
      </span>
    </el-drawer>
  </div>
</template>
<script>
import LogItem from '@/components/log-qeury-components/LogItem.vue';
import { getLogContext } from '@/common/req/list/log';
import jsonView from 'vue-json-views';

export default {
  components: {
    LogItem,
    jsonView,
  },
  props: {
    logDetail: {
      required: true,
    },
    storeName: {
      required: true,
    },
    logType: {
      required: true,
    },
    formInline: {
      required: true,
    },
    extra: {
      required: true,
    },
  },
  data() {
    return {
      drawer: false,
      tableData: [],
      loading: false,
      pageSize: 20,
      nearWeekDay: new Date().getTime() - 5 * 24 * 60 * 60 * 1000, // 5天前的此时
    };
  },
  computed: {
    viewVisible() {
      return this.logType !== 7
        && new Date(this.logDetail.logOfKV.timestamp).getTime() > this.nearWeekDay;
    },
  },

  methods: {
    handleShowContext() {
      this.switchShowContext(true);
    },
    switchShowContext(val) {
      this.drawer = val;
    },
    async openDrawer() {
      this.tableData = await this.getTableData('0', this.logDetail);
    },
    // type up 向上 down 向下
    async getMore(type) {
      const { tableBox } = this.$refs;
      const { scrollTop, scrollHeight } = tableBox;
      if (type === 'up') {
        const item = await this.tableData[0];
        const res = await this.getTableData('2', item);
        this.tableData = [...res, ...this.tableData];
        this.$nextTick(() => {
          const curScrollHeight = tableBox.scrollHeight;
          tableBox.scrollTop = (curScrollHeight - scrollHeight) + scrollTop;
        });
      } else if (type === 'down') {
        const item = this.tableData[this.tableData.length - 1];
        const res = await this.getTableData('1', item);
        this.tableData = [...this.tableData, ...res];
        this.$nextTick(() => {
          tableBox.scrollTop = scrollTop;
        });
      }
    },
    // type : 0-around;1-after;2-before
    async getTableData(type, item = {}) {
      this.loading = true;
      const params = {
        logstore: this.storeName,
        ip: item.ip,
        fileName: item.fileName,
        timestamp: item.timestamp,
        lineNumber: parseInt(item.lineNumber, 10),
        pageSize: this.pageSize,
        type,
      };
      try {
        const { data } = await getLogContext(params);
        this.loading = false;
        const newData = data.logDataDTOList;
        if (newData.length === 0) {
          this.$message.warning('没有更多数据了');
        }
        return newData;
      } catch (error) {
        this.loading = false;
        return [];
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.log-context{
  display: inline-block;
  vertical-align: top;
}
.drawer-box{
  padding: 40px 0;
  position: relative;
  height: 100%;
  overflow: hidden;

  .more-btn{
    position: absolute;
    display: block;
    width: 100%;
  }
  .down-btn{
    bottom: 5px;
  }
  .up-btn{
    top: 5px;
  }
  .table-box{
    height: 100%;
    overflow: scroll;
  }
}

.show-context-btn.el-button--mini, .show-context-btn.el-button--mini.is-round{
  display: inline-block;
  font-size: 12px;
  font-weight: normal;
  margin-right: 10px;
  border:solid 1px #54b399;
  color: #54b399;
  background: #fff;
  border-radius: 0;
  height: 27px;
  cursor: pointer;
  line-height:27px;
  padding: 0 5px;
}
</style>
