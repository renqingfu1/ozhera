<template>
  <div class="create-charts-box">
    <div class="create-charts">
      <div  class="bottom">
        <div class="left">
          <p class="left-title">可用字段</p>
          <div class="key-list-ul">
            <KeyList @changeKey="changeKey" />
          </div>
        </div>
        <div class="right">
          <div class="search-box">
            <el-row>
              <ChartType v-model="chartType" style="marginRight:10px;"/>
              <el-button type="primary" size="mini"
                @click="toSapceTree"
              >返回仪表板</el-button>
            </el-row>
          </div>
          <div class="chart-box">
            <div v-if="key" class="chart-inner">
              <el-form :model="formData" ref="form" inline class="charts-form">
                <el-form-item label="标题" prop="name">
                  <el-input v-model="formData.name" maxlength="20" :clearable="true"></el-input>
                </el-form-item>
                <el-form-item label="" class="timer-box">
                    <MiDatePicker v-model="timer" @nearTimeText="nearTimeText"
                      @changeDate="changeDate"
                      :showPicker="isNearText?true:false"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" class="refresh-btn"
                    @click="refreshData"
                  >刷新</el-button>
                  <el-button type="primary" @click="submitForm('form')">保存并返回</el-button>
                </el-form-item>
              </el-form>
              <ChartLoading v-show="showLoading"/>
              <MyCharts
              :chartType="chartType"
              :chartData="chartData"/>
            </div>
            <EmptyChart v-else/>
          </div>
        </div>
      </div>
  </div>
  </div>
</template>
<script>
import { nearTimeText } from '@/common/fun/log-query';
import MiDatePicker from '@/components/MiDatePicker.vue';
import '@/views/user/tree/analysis/common.scss';
import { mapState } from 'vuex';
import {
  previewChart, createChart, createGrider, createRelChartGrider,
} from '@/common/req/list/user/charts';
import ChartLoading from '@/views/user/tree/analysis/components/ChartLoading.vue';
import KeyList from './components/KeyList.vue';
import ChartType from './components/ChartType.vue';
import EmptyChart from './components/EmptyChart.vue';
import MyCharts from './components/MyCharts.vue';

export default {
  components: {
    MiDatePicker,
    KeyList,
    ChartType,
    EmptyChart,
    MyCharts,
    ChartLoading,
  },
  data() {
    return {
      showLoading: false,
      formData: {
        name: '',
      },
      isNearText: false,
      timer: [
        new Date().setTime(new Date().getTime() - 15 * 60 * 1000),
        new Date().getTime(),
      ],
      chartType: '1',
      key: '',
      chartData: [],
    };
  },
  computed: {
    ...mapState({
      chartsTypes: (state) => state.moduleChart.chartTypes,
      colNum: (state) => state.moduleChart.colNum,
    }),
  },
  watch: {
    chartType(newType) {
      const chartTypeLabel = this.chartsTypes.filter(
        (item) => item.typeCode === newType,
      )[0]?.name;
      this.formData.name = `${this.key}${chartTypeLabel}`;
    },
  },
  methods: {
    nearTimeText,
    changeKey(key) {
      this.key = key;
      this.setChartName(key);
      this.refreshData();
    },
    setChartName(key) { // 设置chart的标题
      const chartTypeLabel = this.chartsTypes.filter(
        (item) => item.typeCode === this.chartType,
      )[0]?.name;
      this.formData.name = `${key}${chartTypeLabel}`;
    },
    refreshData() {
      this.showLoading = true;
      const { params } = this.$route;
      const reqParams = {
        storeId: Number(params.storeId),
        fieldName: this.key,
        typeCode: this.chartType,
        startTime: this.timer[0],
        endTime: this.timer[1],
      };
      previewChart(reqParams).then((res) => {
        const resD = res.data || [];
        const arr = typeof resD.data === 'string' ? JSON.parse(resD.data) : resD.data;
        this.chartData = arr;
        this.showLoading = false;
      }).catch(() => {
        this.showLoading = false;
      });
    },
    changeDate() {
      if (!this.key) return;
      this.refreshData();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitData();
          return true;
        }
        return false;
      });
    },
    async submitData() {
      const { params } = this.$route;
      let { dashboardId } = this.$route.query;
      if (!dashboardId) {
        const initGriderP = {
          ...this.$route.params,
        };
        const createDashborad = await createGrider(initGriderP); // 创建仪表板
        dashboardId = createDashborad.data;
      }
      const creatChartParams = {
        spaceId: params.spaceId,
        storeId: params.storeId,
        graphType: this.chartType,
        name: this.formData.name,
        fieldName: this.key,
      };
      const chartData = await createChart(creatChartParams); // 创建图表
      const createRelP = this.retItemVal(chartData.data, dashboardId);
      await createRelChartGrider(createRelP); // 创建关联
      this.returnAnalysis();
    },
    returnAnalysis() {
      this.$router.push({
        name: 'User-SpaceTree',
        query: {
          storeId: this.$route.params.storeId,
          spaceId: this.$route.params.spaceId,
          type: 'analysis',
        },
      });
    },
    // 图表ID
    retItemVal(graphId, dashboardId) {
      const layoutL = Number(this.$route.query.layoutL);
      const pointData = {
        x: (layoutL * 2) % (this.colNum || 12),
        y: layoutL + (this.colNum || 12), // puts it at the bottom
        w: 2,
        h: 6,
        i: graphId,
      };
      return {
        dashboardId,
        graphId,
        point: JSON.stringify(pointData),
        privateName: this.formData.name,
      };
    },
    toSapceTree() {
      this.$router.push({
        name: 'User-SpaceTree',
        query: {
          ...this.$route.params,
          type: 'analysis',
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.create-charts-box{
  height: 100%;
  .create-charts{
    height: 100%;
    background: #fafbfd;
    padding: 20px 20px 0 20px;
  }
}
.bottom{
  display: flex;
  height: calc(100% - 20px);
  width: 100%;
  .left{
    width: 252px;
    height: 100%;
    background: #F5F7FA;
    overflow: hidden;
    .left-title{
      height: 30px;
      line-height: 30px;
      font-weight: 700;
      font-size: 12px;
      padding: 0 10px;
    }
  }
  .right{
    margin-left: 10px;
    width: calc(100% - 252px);
    .chart-box{
      position: relative;
      width: 100%;
      height: calc(100% - 38px);
      min-width: 230px;
      min-height: 230px;
      border: 1px solid #D3DAE6;
      border-radius: 4px;
      background: #fff;
    }
  }
}
.search-box{
  display: flex;
  padding-bottom: 10px;
}
.timer-box{
  ::v-deep .mi-date-picker .el-date-editor--datetimerange.el-input__inner{
    height:  28px;
  }
  ::v-deep .mi-date-picker .picker{
    border-left:solid 1px #dcdfe6;
    height: 28px;
    line-height:  28px;
    background: #fff;
  }
  ::v-deep .mi-date-picker .el-range-editor--mini .el-range__icon{
    line-height: 20px;
  }
}
.charts-form{
  padding: 18px 0 1px 30px;
  /* border-bottom: solid 1px #eee; */
  // ::v-deep .el-button--mini{
  //   width: 260px;
  // }
}
.chart-inner{
  height: 100%;
}
.key-list-ul{
  height: calc(100% - 30px);
  overflow-y: auto;
}
</style>
