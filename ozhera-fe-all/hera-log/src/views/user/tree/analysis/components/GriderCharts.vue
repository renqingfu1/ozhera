<template>
  <div class="chart-detail">
    <div class="actions">
      <p class="title">
        <span class="title-text" @click="editTitle" :class="chartTitle?'':'null-title'">
          {{chartTitle || '[无标题]'}}
        </span>
      </p>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <i class="el-icon-setting"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="delete">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <ChartLoading v-show="showLoading && !isAutoRefresh"/>
    <v-chart :option="option" :autoresize="true"/>
    <el-dialog title="修改图表名称" :visible.sync="showDialog"
      width="350px"
      custom-class="edit-chart-title"
      :append-to-body="true">
      <el-form v-model="form">
        <el-form-item label="图表名称" >
          <el-input v-model="form.name" maxlength="25" style="width:220px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { use } from 'echarts';
import { EventBus } from '@/views/user/tree/analysis/event-bus/refresh-chart';
import {
  getChartData,
  delRaletion,
} from '@/common/req/list/user/charts';
import { mapState } from 'vuex';
import ChartLoading from './ChartLoading.vue';
import { returnChartOptions } from '../common';

const myoptions = returnChartOptions();

use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
]);

export default {
  components: {
    VChart,
    ChartLoading,
  },
  provide: {
    [THEME_KEY]: '',
  },
  props: {
    id: {
      required: true,
    },
    dashboardId: {
      required: true,
    },
    title: {
    },
    graphType: {
      required: true,
    },
  },
  // 数据配置
  data() {
    return {
      showLoading: false,
      showDialog: false,
      chartTitle: '',
      form: {
        name: '',
      },
      option: {
        title: {
          show: false,
        },
        dataset: {
          dimensions: ['field', 'count'],
          source: [],
        },
        xAxis: {
          type: 'category',
        },
        yAxis: {
          type: 'value',
        },
        series: [],
        grid: {
          x: 60, // 左侧距离
          y: 20, // 顶部距离
          x2: 30, // 右侧距离
          y2: 50, // 底部距离
        },
      },
    };
  },
  computed: {
    ...mapState({
      timer: (state) => state.moduleChart.timer,
      isAutoRefresh: (state) => state.moduleChart.isAutoRefresh,
    }),
  },
  mounted() {
    this.getData();
    EventBus.$on('refresh', () => {
      this.getData();
    });
    this.chartTitle = this.title; // 初始化title
    this.updataOption(this.graphType);
  },
  methods: {
    isPie(chartType) {
      let switchPie = false;
      if (`${chartType}` === '1' || `${chartType}` === '8' || `${chartType}` === '9') {
        switchPie = true;
      }
      return switchPie;
    },
    updataOption(chartType) {
      const curType = myoptions.filter((item) => item.typeCode === `${chartType}`);
      if (curType.length <= 0) {
        console.log('数据不对！');
        return;
      }
      const curObj = curType[0];
      this.option.series = [];
      this.option.series.push(curObj.otherData);
      if (`${chartType}` === '4') { // 水平条形图
        this.option.xAxis.type = 'value';
        this.option.yAxis.type = 'category';
      } else {
        this.option.xAxis.type = 'category';
        this.option.yAxis.type = 'value';
      }
      this.option.xAxis.show = !this.isPie(chartType);
      this.option.yAxis.show = !this.isPie(chartType);
    },
    getData() {
      if (!this.timer || (this.timer && this.timer.length < 2)) {
        // this.$message.error('请选择时间!');
        return;
      }
      this.showLoading = true;
      const reqParams = {
        graphId: this.id,
        startTime: this.timer[0],
        endTime: this.timer[1],
      };
      getChartData(reqParams).then(({ data }) => {
        const resD = data.data || [];
        const resObj = JSON.parse(resD);
        this.option.dataset.source = resObj;
        this.showLoading = false;
      }).catch(() => {
        this.showLoading = false;
      });
    },
    editTitle() {
      this.form.name = this.chartTitle;
      this.switchShow();
    },
    switchShow() {
      this.showDialog = !this.showDialog;
    },
    confirm() {
      this.chartTitle = this.form.name;
      this.$emit('setSaveStatus', false);
      this.$emit('changeTitle', {
        graphId: this.id,
        name: this.form.name,
      });
      this.switchShow();
    },
    handleCommand(command) {
      if (command === 'delete') {
        delRaletion({ graphId: this.id, dashboardId: Number(this.dashboardId) }).then(() => {
          this.$emit('freshGrider');
        });
      }
    },
  },
};
</script>
<style scoped lang="scss" >
.chart-detail{
  height: 100%;
  overflow: hidden;
}
.actions{
  height: 24px;
  display: flex;
  justify-content: space-between;
}
.actions:hover{
  background: rgba(254,197,20,0.1);
}
.title{
  flex: 1;
  padding-left: 10px;
  font-size: 12px;
  height: 24px;
  line-height: 24px;
  max-width: calc(100% - 24px);

}
.title-text{
  font-weight: 500;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: calc(100% - 50px);
}
.title-text:hover{
  border-bottom: solid 2px #333;
}
.el-dropdown-link{
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background: #eee;
  cursor: pointer;
}
.null-title{
  color: #a0a0a0;
}
.title-text.null-title:hover{
  border-bottom: solid 2px #a0a0a0;
}
</style>
<style lang="scss">
.edit-chart-title{
  color:red;
  ::v-deep .el-dialog__body{
    padding-bottom: 0;
  }
}
</style>
