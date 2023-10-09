<template>
  <div class="mi-date-picker">

    <div v-if="showNear" class="picker">{{pickerLabel}}</div>
    <el-date-picker
      value-format="timestamp"
      v-model="timer"
      type="datetimerange"
      :picker-options="pickerOptions"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      align="right"
      :class="showNear?' timer-box hide-picker':'timer-box'"
      @change="changeDate"
      :clearable="false"
      popper-class="mi-date-picker-control"
    >
    </el-date-picker>
  </div>
</template>
<script>

export default {
  props: {
    value: {},
    showPicker: {
      type: Boolean,
    },
  },
  data() {
    return {
      pickerLabel: '',
      clickPick: false,
    };
  },
  computed: {
    timer: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
    showNear() {
      return this.showPicker;
    },
    pickerOptions() {
      const myself = this;
      return {
        shortcuts: [
          {
            text: myself.$t('commonDatePicker.last15m'),
            onClick(picker) {
              console.log('picker', picker, 'this', this);
              myself.clickPicker(this.$t('commonDatePicker.last15m'));
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 15 * 60 * 1000);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: myself.$t('commonDatePicker.last30m'),
            onClick(picker) {
              myself.clickPicker(myself.$t('commonDatePicker.last30m'));
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 30 * 60 * 1000);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: myself.$t('commonDatePicker.last1h'),
            onClick(picker) {
              myself.clickPicker(myself.$t('commonDatePicker.last1h'));
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 60 * 60 * 1000);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: myself.$t('commonDatePicker.last2h'),
            onClick(picker) {
              myself.clickPicker(myself.$t('commonDatePicker.last2h'));
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 2 * 60 * 60 * 1000);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: myself.$t('commonDatePicker.last4h'),
            onClick(picker) {
              myself.clickPicker(myself.$t('commonDatePicker.last4h'));
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 4 * 60 * 60 * 1000);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: myself.$t('commonDatePicker.last8h'),
            onClick(picker) {
              myself.clickPicker(myself.$t('commonDatePicker.last8h'));
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 8 * 60 * 60 * 1000);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: myself.$t('commonDatePicker.last12h'),
            onClick(picker) {
              myself.clickPicker(myself.$t('commonDatePicker.last12h'));
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 12 * 60 * 60 * 1000);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: myself.$t('commonDatePicker.last1d'),
            onClick(picker) {
              myself.clickPicker(myself.$t('commonDatePicker.last1d'));
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 24 * 60 * 60 * 1000);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: myself.$t('commonDatePicker.last2d'),
            onClick(picker) {
              myself.clickPicker(myself.$t('commonDatePicker.last2d'));
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 2 * 24 * 60 * 60 * 1000);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: myself.$t('commonDatePicker.last3d'),
            onClick(picker) {
              myself.clickPicker(myself.$t('commonDatePicker.last3d'));
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3 * 24 * 60 * 60 * 1000);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: myself.$t('commonDatePicker.last5d'),
            onClick(picker) {
              myself.clickPicker(myself.$t('commonDatePicker.last5d'));
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 5 * 24 * 60 * 60 * 1000);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: myself.$t('commonDatePicker.today'),
            onClick(picker) {
              myself.clickPicker(myself.$t('commonDatePicker.today'));
              const end = new Date();
              const start = new Date().setHours(0, 0, 0, 0);
              picker.$emit('pick', [start, end.getTime()]);
            },
          },
          {
            text: myself.$t('commonDatePicker.yesterday'),
            onClick(picker) {
              myself.clickPicker(myself.$t('commonDatePicker.yesterday'));
              const end = new Date().setHours(0, 0, 0, 0);
              const start = new Date();
              start.setTime(end - 3600 * 1000 * 24);
              picker.$emit('pick', [start.getTime(), end]);
            },
          },
        ],
      };
    },
  },
  methods: {
    clickPicker(text) {
      this.clickPick = true;
      this.pickerLabel = text;
    },
    changeDate(val) {
      let res = val;
      if (this.clickPick) { // 点击快捷键
        this.clickPick = false;
      } else {
        this.pickerLabel = '';
        res = [this.correctStart(val), val[1]];
      }
      this.sendTextFn(this.pickerLabel);
      this.$emit('changeDate', res);
      this.$emit('input', res);
    },
    sendTextFn(text) {
      this.$emit('nearTimeText', text);
    },
    correctStart(val) { // 校正开始时间
      if (!val[0]) { return null; }
      const start = val[0];
      const remain = start % 1000;
      const resStart = start - remain;
      return resStart;
    },
  },
};
</script>
<style scope lang="scss">
.mi-date-picker{
  position: relative;
  overflow: hidden;
  & .timer-box{
    opacity: 1;
    // border-left: none;
  }
  .el-range-editor--mini.el-input__inner{
    height: 32px;
  }
  & .hide-picker .el-date-editor--datetimerange.el-input__inner{
    width: 100%;
  }
  & .hide-picker{
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
.picker{
  height: 38px;
  line-height: 38px;
  color: var(--ant-primary-color);
  border:solid 1px #dcdfe6;
  border-left: none;
  padding:0 20px;
  font-size: 12px;
}
.timer-box.el-date-editor .el-range-input{
  width: 120px;
}
.mi-date-picker .el-date-editor .el-range-separator{
  width: 15px;
  padding:0;
  height: 38px;
  line-height: 38px;
}
.mi-date-picker .el-date-editor--datetimerange.el-input__inner{
  width: 298px;
  height: 38px;
}
.mi-date-picker .el-range-editor--mini .el-range__icon{
  line-height: 30px;
}

.mi-date-picker-control {
  .el-picker-panel__footer {
    .el-picker-panel__link-btn:nth-child(1){
      display: none;
    }
  }
}
</style>
