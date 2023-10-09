<template>
  <ScrollBox class="user-log-query-table-box" @reqMore="addPage">
    <template>
      <StoreDetail v-model="storeDetail"/>
      <div class="search-box" >
        <SearchBox class="input-box"
          :keyListStr="keyListStr"
          ref="search-box"
          @searchSubmit="onSubmit"
          v-model="formInline.fullTextSearch"
          :storeId="storeId"
          :tailId="tailInfo.map(item=>item.id)"
          :startTime="formInline.timer?formInline.timer[0]:''"
          :endTime="formInline.timer?returnEndTime(formInline.timer[1]):''"
        />
        <MiDatePicker
        v-model="formInline.timer"
        @nearTimeText="nearTimeText"
        :showPicker="isNearText?true:false"/>
        <div class="query-time-box">
          <div class="log-query-time-msg el-tooltip__popper is-light">
            <i class="el-icon-info log-query-time-msg-text"></i>
            <span class="log-query-time-msg-text">{{ $t('logQuery.topMsg') }}</span>
            <!-- <div class="popper__arrow"></div> -->
          </div>
          <el-button-group>
            <el-button type="primary" @click="onSubmit" class="search-btn">
              {{ $t('search') }}</el-button>
            <el-button type="primary" @click="onDownload" class="search-btn">
              {{ $t('download') }}</el-button>
          </el-button-group>
        </div>
      </div>
      <div class="top-btns">
        <ChangeTail :tailsOptions="tailsOptions" v-model="tailInfo"
        style="margin-top:5px"/>
        <el-button type="text" class="switch-show-chart" @click="switchShowChart" v-if="echartData">
          <i class="iconfont" :class="showChart?'icon-view-no':'icon-view-yes'"></i>
          <span>{{ showChart?$t('hide'):$t('show') }}{{ $t('logQuery.charts') }}</span>
        </el-button>
      </div>
      <div class="log-echart" v-if="echartData">
        <div class="echart" v-loading="loading2" v-show="showChart">
          <LogEcharts
            :item="echartData"
            @change-data="searchChange"
            :isLoki="false"
          />
        </div>
      </div>
      <div class="user-log-query-table" v-if="tableData.length>0">
        <div class="filter-box">
          <FilterKey :selKeys="selKeys" :keyList="serachKeyListArrDelTime"
          @changeSel="changeSelKey"/>
          <p class="total-info">{{ $t('logQuery.totalNums')}}{{total}}</p>
        </div>
        <el-table
          v-loading="loading"
          :data="tableData"
          class="expand-table log-table"
          @sort-change="sortChange"
          :default-sort="defaulSort"
        >
          <el-table-column type="expand" class-name="expand-box"
            width="40">
            <template slot-scope="props">
              <ExpandLi :val="props.row"/>
            </template>
          </el-table-column>
          <el-table-column prop="time"
          :label="$t('logQuery.time')" width="150px"
          sortable="custom">
            <template slot-scope="props">
              <template v-if="props.row.logOfKV"></template>
              <p>{{$dateFormat(props.row.logOfKV.timestamp, 'yyyy/mm/dd')}}</p>
              <p>{{$dateFormat(props.row.logOfKV.timestamp, 'HH:MM:ss:l')}}</p>
            </template>
          </el-table-column>
          <template v-if="selKeys.length==0">
            <el-table-column prop="logOfString"
            :label="$t('logQuery.document')" >
              <template slot-scope="scope">
                <LogItem
                  :logType="logType"
                  :itemData="scope.row"
                  :formInline="formInline"
                  >
                      <template v-slot:logContext >
                        <LogContext
                          :logType="logType"
                          :logDetail="scope.row"
                          :storeName="storeDetail.logstoreName"
                          :formInline="formInline"
                          :extra="transformParams()"
                          style="margin:3px 0 5px 0;"/>
                      </template>
                </LogItem>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column  v-for="item in selKeys" :key="item"
            :prop="item" :label="item">
              <template slot="header" >
                <p style="white-space:nowrap;">
                  <span>{{ item }}</span>
                  <KeyTitle :keyName="item" @changeSelKey="changeSelKey"/>
                </p>
              </template>
              <template slot-scope="scope">
                <div class="detail-info">
                  <span class="detail-item" >
                    <span v-html="scope.row.logOfKV[item]"
                    class="content-text"></span>
                  </span>
                </div>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <div class="footer" v-show="noMore && total!==0">{{ $t('logQuery.allData') }}~</div>
        <div class="footer" v-show="loading">{{ $t('logQuery.loading') }}...</div>
      </div>
      <el-empty v-else :image-size="200" v-loading="loading"></el-empty>
    </template>
  </ScrollBox>
</template>
<script>
import {
  getLogsListApi,
  getESChartsApi,
} from '@/common/req/list/log';
import ScrollBox from '@/components/ScrollBox.vue';
import LogEcharts from '@/components/echarts/bar.vue';
import {
  transformAll, transformLokiHighLight,
  nearTimeText,
  returnTimeOptions,
} from '@/common/fun/log-query';
import {
  getStoreById,
  getTailList,
} from '@/common/req/list/logConfig';
import MiDatePicker from '@/components/MiDatePicker.vue';
import ChangeTail from '@/views/user/tree/log-query-com/ChangeTailIndex.vue';
import SearchBox from '@/views/user/tree/log-query-com/SearchBox.vue';
import StoreDetail from '@/views/user/tree/log-query-com/StoreDetail.vue';
// import { validateInput } from '@/common/fun/validateInput';
import LogItem from '@/components/log-qeury-components/LogItem.vue';
import LogContext from '@/components/log-qeury-components/LogContext.vue';
import FilterKey from './components/FilterKey.vue';
import ExpandLi from './components/ExpandLi.vue';
import KeyTitle from './components/KeyTitle.vue';

export default {
  components: {
    ScrollBox,
    LogEcharts,
    LogItem,
    MiDatePicker,
    StoreDetail,
    ChangeTail,
    SearchBox,
    LogContext,
    FilterKey,
    ExpandLi,
    KeyTitle,
  },
  props: {
    page: {
      type: String,
    },
    storeId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showChart: true,
      isNearText: '', // 是否选择的是最近时间
      showFooter: false,
      machineOptions: [],
      breadCrumbItems: [
        {
          label: '日志查询',
        },
      ],
      loading: false,
      formInline: {
        page: 1,
        pageSize: 20,
        timer: [
          new Date().setTime(new Date().getTime() - 15 * 60 * 1000),
          new Date().getTime(),
        ],
        fullTextSearch: '',
        logstore: null,
        tail: '', // 字符串
        sortKey: 'timestamp',
        asc: false,
      },
      total: 0,
      tableData: [],
      value2: '',
      storeOptions: [],
      keyListArr: [],
      keyListStr: '',
      keyListObj: {},
      rules: {
        timer: [{ required: true, message: '请选择时间范围', trigger: 'blur' }],
        logstore: [{ required: true, message: '请选择store', trigger: 'blur' }],
      },
      tailsOptions: [],
      loading2: false, // es图表loading
      echartData: null, // es图表数据
      curTableData: [],
      storTailoptions: [],
      beginSortValue: null, // 日志查询分页参数
      spaceTreePageDetail: [],
      noMore: false,
      logType: -1,
      tailInfo: [], // 对象类型的数组
      storeDetail: {
        machineRoom: '',
        logTypeName: '',
        storePeriod: '',
        shardCnt: '',
        logstoreName: '',
      },
      selKeys: [],
    };
  },
  computed: {
    serachKeyListArr() { // 搜索框的内容
      const res = this.keyListArr.filter((item) => item !== 'tail' && item !== 'logstore');
      return res;
    },
    serachKeyListArrDelTime() {
      const res = this.serachKeyListArr.filter((item) => item !== 'timestamp');
      return res;
    },
    defaulSort() {
      return {
        prop: 'time',
        order: this.formInline.asc ? 'ascending' : 'descending',
      };
    },
    lokiOrMatrix() {
      return this.logType === 6 || this.logType === 7;
    },
  },
  methods: {
    // params type :obj {type:add | del,val}
    changeSelKey(obj) {
      const { type, val } = obj;
      if (type === 'add') {
        this.selKeys.push(val);
      } else {
        const index = this.selKeys.indexOf(val);
        this.selKeys.splice(index, 1);
      }
    },
    switchShowChart() {
      this.showChart = !this.showChart;
    },
    addPage() {
      if (this.showFooter || this.loading) return;
      this.formInline = { ...this.formInline, ...{ page: this.formInline.page + 1 } };
      const params = this.transformParams();
      this.getListSearch(params);
    },
    sortChange({ order }) {
      this.formInline = {
        ...this.formInline,
        ...{ asc: order === 'ascending' },
      };
      this.onSubmit();
    },
    onSubmit(data) {
      // 记录列表带过来的数据
      if (data && data.source === 'recordSubmit') {
        if (data.startTime) {
          this.formInline.timer = [data.startTime, data.endTime];
        } else {
          this.formInline.timer = [new Date().setTime(new Date().getTime() - 15 * 60 * 1000),
            new Date().getTime()];
        }
      } else if (this.isNearText) {
        this.changeNearTime();
      }
      // if (!this.validateInput(this.formInline.fullTextSearch)) return;
      this.noMore = false;
      this.formInline.page = 1;
      const query = {
        ...this.$route.query,
        inputV: this.formInline.fullTextSearch,
        startTime: this.formInline.timer[0],
        endTime: this.formInline.timer[1],
        tailName: this.tailInfo.map((item) => item.tail).join(','),
      };
      this.$router.push({
        query,
      });
      this.tableData = [];
      this.beginSortValue = null;
      this.searchSubmit();
    },
    getDownload(params) {
      const baseDomain = process.env.VUE_APP_MIONEDOMAIN;
      let api = `${baseDomain}/log/export`;
      if (this.logType === 7) { // matrix
        api = `${baseDomain}/matrix/log/export`;
      }
      const reqP = params;
      const reqUrl = this.parseParams(api, reqP);
      console.log('reqUrl', reqUrl);
      window.open(reqUrl, '_blank');
    },
    onDownload() {
      if (this.isNearText) {
        this.changeNearTime();
      }
      this.formInline.page = 1;
      const params = this.transformParams();
      this.getDownload(params);
    },
    parseParams(uri, params) {
      const paramsArray = [];
      Object.keys(params).forEach((key) => params[key] && paramsArray.push(`${key}=${params[key]}`));
      if (uri.search(/\?/) === -1) {
        // eslint-disable-next-line no-param-reassign
        uri += `?${paramsArray.join('&')}`;
      } else {
        // eslint-disable-next-line no-param-reassign
        uri += `&${paramsArray.join('&')}`;
      }
      return uri;
    },
    changeNearTime() {
      const options = returnTimeOptions();
      const curTimeArr = options.filter((item) => item.text === this.isNearText);
      if (curTimeArr.length > 0) this.formInline.timer = curTimeArr[0].timer;
    },
    searchSubmit() {
      const params = this.transformParams();
      this.getESChartsData(params); // 获取es数据监控图表数据
      this.getListSearch(params);
    },
    searchTable() {
      const params = this.transformParams();
      this.getListSearch(params);
    },
    transformParams() {
      const {
        timer, fullTextSearch, page, pageSize, sortKey, asc,
      } = this.formInline;
      const params = {
        spaceId: this.$route.query.spaceId,
        storeId: this.storeId,
        area: this.storeDetail.machineRoom,
        tail: this.returnTailNameStr(),
        logstore: this.storeDetail.logstoreName,
        startTime: timer ? timer[0] : '',
        endTime: timer ? this.returnEndTime(timer[1]) : '',
        fullTextSearch: fullTextSearch.startsWith('not ') ? ` ${fullTextSearch}` : fullTextSearch,
        page,
        pageSize,
        beginSortValue: this.beginSortValue, // 日志查询分页参数
        sortKey,
        asc,
        appIds: this.retAppids(),
      };
      return params;
    },
    retAppids() {
      let filters = [];
      if (this.tailInfo.length > 0) {
        const tailNames = this.returnTailNameArr();
        filters = this.tailsOptions.filter((item) => tailNames.indexOf(item.tail) >= 0);
      } else {
        filters = this.tailsOptions;
      }
      const arr = filters.map((item) => (this.lokiOrMatrix ? item.appId : item.milogAppId));
      return arr;
    },
    returnTailNameArr() {
      return this.tailInfo.map((item) => item.tail);
    },
    returnTailNameStr() {
      return this.tailInfo.map((item) => item.tail).join(',');
    },
    returnEndTime(timer) {
      const left = timer % 1000;
      return timer - left + 999;
    },
    getListSearch(params) {
      if (this.loading || this.noMore) return;
      // eslint-disable-next-line no-underscore-dangle
      this.loading = true;
      const request = getLogsListApi(params);
      request.then((res) => {
        // eslint-disable-next-line no-mixed-operators
        const newData = this.transformReturn(res, this.logType);
        this.curTableData = newData;
        this.tableData = this.tableData.concat(newData);
        console.log('tableData', this.tableData);
        if (this.logType === this.lokiOrMatrix) { //  matrix loki 才将query接口取total
          this.total = res && res.data.total;
        }
        this.loading = false;
        this.beginSortValue = res.data.thisSortValue; // 请求下一页标识参数
      })
        .catch((err) => {
          console.log('error log-query', err);
          this.loading = false;
        });
    },
    transformAll,
    transformLokiHighLight,
    transformReturn(res, logType) {
      const resList = (res && res.data.logDataDTOList) || [];
      this.noMore = resList.length < this.formInline.pageSize;
      const resListNew = resList.map((item) => {
        if (item.logOfKV) {
          this.transformAll(item, logType);
        }
        if (item.logOfKVJSON.message && item.logOfKVJSON.logsource) { // logsource 包含所有解析的内容，若不删除会重复
          (
            // eslint-disable-next-line no-param-reassign
            delete item.logOfKV.logsource
          );
        }
        return item;
      });

      return resListNew;
    },
    // 获取es数据监控图表数据
    getESChartsData(params) {
      this.loading2 = true;
      const request = getESChartsApi(params);
      request.then((res) => {
        this.loading2 = false;
        this.echartData = this.resetLokiSt(res);
        if (this.logType !== this.lokiOrMatrix) { //   非matrix loki 才将ES接口取total
          this.total = res && res.data.totalCounts;
        }
      }).catch((err) => {
        this.loading2 = false;
        this.echartData = null;
        console.log('err', err);
      });
    },
    resetLokiSt(res) {
      const data = res?.data || null;
      if (data.counts) {
        const retCounts = data.counts?.map((item) => (item >= 5000 ? 5000 : item));
        data.counts = retCounts;
      }
      return data;
    },
    last5Day(startTime) { // 开始时间是否是5天前
      let res = false;
      if (this.isNearText === '最近5天') {
        res = false;
      } else {
        const near5Day = new Date().getTime() - 5 * 24 * 60 * 60 * 1000; // 5天前的此时
        res = startTime < near5Day;
      }
      return res;
    },
    // 点击图表重新获取es数据
    searchChange(param) {
      this.nearTimeText('');
      this.formInline.timer = param;
      this.onSubmit();
    },
    getTailsOptions() {
      return getTailList({ storeId: this.storeId, page: 1, pageSize: 1000 });
    },
    getKeyList() {
      return getStoreById({ id: this.storeId });
    },
    nearTimeText,
    initTimeTail() {
      if (this.$route.query.tailName) {
        const tailNameArr = this.$route.query.tailName.split(',');
        this.tailInfo = this.tailsOptions.filter((item) => tailNameArr.indexOf(item.tail) > -1);
      } else {
        this.tailInfo = [];
      }
      if (this.$route.query.startTime && this.$route.query.endTime) {
        this.formInline.timer = [
          parseInt(this.$route.query.startTime, 10),
          parseInt(this.$route.query.endTime, 10),
        ];
      }
    },
    initInput() { // 从飞书跳转会携带数据
      if (typeof this.$route.query.inputV === 'object') {
        this.$message.warning('请检查地址栏参数');
        return;
      }
      const fullTextSearch = this.$route.query.inputV || '';
      this.formInline.fullTextSearch = fullTextSearch;
      if (fullTextSearch) {
        this.onSubmit({ source: 'feishuJump' });
      }
    },
    setStoreData({ data }) {
      this.storeDetail = { ...this.storeDetail, ...data };
      this.logType = data.logType;
      if (data.logType === 7) {
        this.keyListArr = [];
        return;
      }
      const selected = data.keyList;
      this.keyListStr = selected;
      const arr = selected.split(',');
      const newArr = [];
      arr.forEach((ele) => {
        const keyName = ele.split(':')[0];
        const item = keyName;
        this.$set(this.keyListObj, item, '');
        newArr.push(item);
      });
      this.keyListArr = newArr;
    },
  },
  async mounted() {
    const storeDetail = await this.getKeyList(); // 此处要拿到storeName和keyList
    this.setStoreData(storeDetail);
    const { data } = await this.getTailsOptions();
    this.tailsOptions = data.list || [];
    this.initTimeTail();
    this.initInput();
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

.hight-light {
  background: #bbfffc;
}
.log-table >>> em {
  font-style: normal;
  background: #ffff00;
}
.log-table >>> .title{
  background:rgba(0,95,163,0.1);
  padding:2px 5px;
  border-radius: 5px;
  box-sizing: border-box;
  word-break: normal;
}
.log-table >>> .red{
  color: #F56C6C;
}
.footer{
  text-align: center;
  font-size: 12px;
  color:#909399;
  padding:10px 0;
}
.log-table.el-table::before{
  height: 0;
}
.user-log-query-table-box{
  padding: 0 20px 0 20px;
}
.user-log-query-table-box >>> .table-box-main-inner{
  padding:0;
}
.user-log-query-table{
  padding-bottom: 20px;
}
.search-box{
  display: flex;
}
.search-btn{
  height: 38px;
}
.search-box .input-box{
  flex: 1;
}

</style>
<style lang="scss" scoped>

@font-face {
  font-family: 'RobotoBlack';
  src: url(./roboto-mono-cufonfonts/RobotoMono-Regular.ttf);
}
.log-table{
  ::v-deep .el-table__row .cell{
    font-family: 'RobotoBlack';
    font-size: 12px;
    color:#343741;
    line-height: 25px;
  }
}
.user-log-query-table ::v-deep .cell{
  padding: 0;
}
.search-box {
  ::v-deep .mi-date-picker .timer-box{
    border-left:none;
  }
}
.log-echart{
  ::v-deep .echart{
    margin: 5px 0 10px 0;
  }
}
.top-btns{
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  .switch-show-chart{
    font-weight: normal;
    ::v-deep span{
      display: flex;
      align-items: center;
    }
    ::v-deep .iconfont{
      margin-right:1px;
    }
  }
  .switch-show-chart:hover{
    background: transparent;
  }
}
.log-table {
  ::v-deep .empty-i{
    color: #8b8b8b;
    font-style: normal;
  }
}
.query-time-box{
  position: relative;
  .log-query-time-msg{
    position: absolute;
    top: -35px;
    right: 0;
    white-space: nowrap;
    .log-query-time-msg-text{
      font-size: 12px;
    }
    // .popper__arrow{
    //   border-bottom-width: 0;
    //   border-top-color:#1790ff;
    //   bottom: -6px;
    //   left: 143px;
    // }
  }
}
.total-info{
  font-size:13px;
  font-weight: 500;
  padding-bottom: 4px;
}
.filter-box{
  display: flex;
  justify-content: space-between;
}
</style>
