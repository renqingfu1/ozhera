<template >
  <div class="query-by-trace-box">
    <TableBox :showHeader="true" class="query-by-trace">
    <template slot="header">
      <BreadCrumb :items="breadCrumbItems" />
    </template>
    <template>
      <div style="padding: 10px 0;border-bottom:solid 1px #eee">
        <!-- el-icon-magic-stick -->
        <span style="font-size: 14px;">
          <span style="color: #409eff">
            traceId:{{this.$route.query.traceId}}；{{ $t('serverRoom') }}
            :{{this.$route.query.region}}
          </span>
        </span>
      </div>
      <div >
        <el-table
          v-loading="loading"
          :data="tableData"
          class="expand-table log-table"
        >
          <el-table-column type="expand" class="expand-box">
            <template slot-scope="props">
              <json-view
                :data="JSON.parse(props.row)"
                class="json-view-box"
              />
            </template>
          </el-table-column>
          <el-table-column prop="time" label="时间" width="150px">
            <template slot-scope="props">
              {{$dateFormat(JSON.parse(props.row).timestamp, 'yyyy/mm/dd HH:MM:ss')}}
            </template>
          </el-table-column>
          <el-table-column prop="logOfString" label="数据">
            <template slot-scope="props">
              <span
                v-for="
                item in Object.keys(JSON.parse(props.row)).filter((item)=>item!=='timestamp')"
                :key="item"
                class="detail-item"
              >
                <b class="title">{{item}}</b>:<span v-html="(JSON.parse(props.row))[item]"></span>
                <b> </b>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </TableBox>
  </div>
</template>
<script>
import jsonView from 'vue-json-views';
import {
  getLogsByTrace,
} from '@/common/req/list/log';
import TableBox from '@/components/TableBox.vue';
import BreadCrumb from '@/components/BreadCrumb.vue';
import { transformAll } from '@/common/fun/log-query';

export default {
  components: {
    jsonView,
    TableBox,
    BreadCrumb,
  },
  props: {
  },
  data() {
    return {
      breadCrumbItems: [
        {
          label: '通过trace查询日志',
        },
      ],
      loading: false,
      formInline: {
        page: 1,
        pageSize: 100,
        timer: [
          new Date().setTime(new Date().getTime() - 15 * 60 * 1000),
          new Date().getTime(),
        ],
        fullTextSearch: '',
        logstore: null,
      },
      // total: 0,
      tableData: [],
      options: [],
      keyListArr: [],
      keyListObj: {},
      curTableData: [],
    };
  },
  computed: {
    serachKeyListArr() {
      // 搜索框的内容
      const res = this.keyListArr.filter(
        (item) => item !== 'tail' && item !== 'logstore',
      );
      return res;
    },
    disabled() {
      return this.loading || this.noMore;
    },
  },
  methods: {
    search() {
      // 是否是精确查找
      const params = {
        traceId: this.$route.query.traceId,
        region: this.$route.query.region, // 机房名
      };
      this.getListSearch(params);
    },
    getListSearch(params) {
      this.loading = true;
      getLogsByTrace(params)
        .then((res) => {
          this.tableData = res.data.dataList;
          // this.total = res && res.data && res.data.total;
          this.loading = false;
        })
        .catch((err) => {
          console.log('err', err);
          this.loading = false;
        });
    },
    transformAll,
  },
  mounted() {
    this.search();
  },
};
</script>
<style scoped>
.expand-table >>> .el-table__expanded-cell {
  background: #f5f7fa;
}
.expand-table >>> .el-table__expanded-cell .el-form-item--mini {
  margin-bottom: 0;
}

/* .expand-table .el-table__expanded-cell{

} */
.infinite-table-box {
  max-height: 500px;
  overflow-y: scroll;
}
.detail-item {
  margin-right: 10px;
}
.json-view-box.json-view-container {
  background: transparent;
}
.hight-light {
  background: #bbfffc;
}
.log-echart {
  border-top: solid 1px #ebeef5;
}
.log-table >>> em {
  font-style: normal;
  background: #ffff00;
}
.log-table >>> .title {
  background: #e6f7ff;
  padding: 0 5px;
  border-radius: 10px;
  box-sizing: border-box;
  word-break: normal;
}
.log-table >>> .red {
  color: #f56c6c;
}
.footer {
  text-align: center;
  font-size: 12px;
  color: #909399;
  padding: 10px 0;
}
.query-by-trace{
  background: #fff;
}
.query-by-trace-box{
  padding: 20px;
}
</style>
