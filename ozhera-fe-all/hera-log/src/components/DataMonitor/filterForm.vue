<template>
  <el-form :inline="true" :model="searchParams" ref="searchForm">
    <el-form-item label="数据类型" prop="metric">
      <el-select v-model="searchParams.metric" filterable placeholder="请选择">
        <el-option
          v-for="item in optionData.metric"
          :key="item.id"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="采样方法" prop="aggreator">
      <el-select v-model="searchParams.aggreator" filterable placeholder="请选择">
        <el-option
          v-for="item in optionData.aggreator"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="时间选择">
      <el-date-picker
        v-model="searchTime"
        size="small"
        type="datetimerange"
        :clearable="false"
        :picker-options="pickerOptions"
        range-separator="至"
        value-format="timestamp"
        :default-time="defaultTime"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="changeDateFn">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="Topic" prop="topic">
      <el-select v-model="searchParams.topic" filterable placeholder="请选择"
                 style="width: 600px;">
        <el-option
          v-for="item in topicOption"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="getDataFn">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import paramOption from '@/components/DataMonitor/paramOption';

export default {
  name: 'data-filter-form',
  props: {
    searchParams: Object,
    topicOption: Array,
  },
  data() {
    return {
      optionData: {
        metric: paramOption.metricOption, // 数据类型下拉选项
        aggreator: paramOption.aggreatorOption, // 采样方法下拉选项
      },
      searchTime: [new Date(new Date().toLocaleDateString()).getTime(), new Date()], // 时间筛选
      defaultTime: ['00:00:00', '23:59:59'],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          },
        }],
      },
    };
  },
  methods: {
    getDataFn() {
      if (this.searchParams.topic) {
        this.$emit('filter');
      } else {
        this.$message.warning('请选择Topic数据！');
      }
    },
    // 日期change
    changeDateFn(date) {
      if (date && date.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        this.searchParams.begin = date[0];
        // eslint-disable-next-line prefer-destructuring
        this.searchParams.end = date[1];
      } else {
        this.searchParams.begin = '';
        this.searchParams.end = '';
      }
    },
  },
};
</script>
