<template>
  <div class="data-time-box">
    <span class="last-time" v-if="('' + time[0]).indexOf('now') > -1">{{
      retTimePicker()
    }}</span>
    <el-date-picker
      class="mi-date-time"
      :class="
        ('' + time[0]).indexOf('now') > -1 ? 'hide-date-time' : 'show-date-time'
      "
      v-model="time"
      type="datetimerange"
      popper-class="el-data-picker-quick-key"
      :picker-options="pickerOptions"
      :default-time="['00:00:00', '23:59:59']"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="timestamp"
      range-separator="~"
      size="small"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      align="right"
      :clearable="false"
      @change="confirmTime"
    >
    </el-date-picker>
  </div>
</template>
<script>
import { setSelectStorage, getSelectStorage } from '@/utils/localStorage'

export default {
  name: 'grafana-date',
  props: {
    iframeUrl: String,
    timeOptions: {
      type: Array,
      default: () => [
        '30s',
        '1m',
        '5m',
        '15m',
        '30m',
        '1h',
        '2h',
        '6h',
        '12h',
        '1d',
        '2d',
        '3d',
        '7d',
      ],
    },
    value: Array, // 选中时间
    disabledDay: {
      // 禁用天数
      type: Number,
      default: 7,
    },
    dashboardFilter: Boolean, // dashboard筛选 仅可选择该日期前后3天时间可选
  },
  computed: {
    time: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
  // watch: {
  //   data: {
  //     handler() {
  //       const val = this.getSelectLocalData(); // 获取本地存储日期选中数据
  //       if(val && JSON.stringify(val) != JSON.stringify(this.time)) {
  //         this.time = val;
  //         this.selectChange()
  //       }
  //     },
  //     immediate: true,
  //     deep: true
  //   },
  // },
  data() {
    const self = this
    return {
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      selectDate: '', // 已选中的minDate日期
      pickerOptions: {
        // 当前时间日期选择器特有的选项
        shortcuts: [],
        disabledDate: time => {
          // DashBoard日期只能查询7天内的数据，每次查询不能超过3天
          return self.disabledDate(time, 7)
        },
        onPick: ({ maxDate, minDate }) => {
          self.selectDate = minDate.getTime()
          if (!minDate || maxDate) {
            self.selectDate = ''
          }
        },
      },
      unit: {
        // 日期时间快捷键显示对应时间单位
        s: 'second',
        m: 'minutes',
        h: 'hours',
        d: 'days',
      },
    }
  },
  created() {
    this.pickerOptionsChange() // 日期时间组件快捷键数据处理
    if (this.time && this.time[1] == 'now') {
      this.startPlaceholder = this.time[0]
      this.endPlaceholder = this.time[1]
    }
  },
  methods: {
    // 日期时间组件快捷键数据处理
    pickerOptionsChange() {
      const self = this
      const shortcuts = []
      this.timeOptions.forEach(item => {
        shortcuts.push({
          text: `Last ${item.slice(0, -1)} ${this.unit[item.slice(-1)]}`,
          onClick(picker) {
            const start = `now-${item}`
            const end = 'now'
            self.startPlaceholder = start
            self.endPlaceholder = end
            picker.$emit('pick', [start, end])
          },
        })
      })
      this.pickerOptions.shortcuts = shortcuts
    },
    // 禁用事件
    disabledDate(time) {
      const curData = new Date().setHours(24, 0, 0, -1)
      const day = 24 * 3600 * 1000
      const newDate = curData - day * this.disabledDay
      // 若一个日期也没选中 则 返回 当前日期7天内日期可选
      return time.getTime() > curData || time.getTime() < newDate
    },
    // 选择时间
    selectChange() {
      this.loading = true
      if (!this.iframeUrl) return
      let url = this.replaceQueryString(
        this.iframeUrl,
        'from',
        this.time[0] || ''
      )
      url = this.replaceQueryString(url, 'to', this.time[1] || '')
      this.$emit('changDateFn', url, this.time)
    },
    // 日期时间组件change事件
    confirmTime(val) {
      if (!val) {
        this.time = [undefined, undefined]
        this.startPlaceholder = '开始日期'
        this.endPlaceholder = '结束日期'
      }
      this.setSelectLocalData() // 本地存储日期选中数据
      this.selectChange()
    },
    // 本地存储日期选中数据
    setSelectLocalData() {
      let time = ''
      if (this.time[1] == 'now') {
        time = this.time[0].split('-')[1]
      }
      const param = {
        value: this.time,
        quickValue: time, // 日期快捷选项选中值
      }
      setSelectStorage('datePickerSelect', param) // 存储选中数据
    },
    // 获取本地存储日期选中数据
    getSelectLocalData() {
      const param = getSelectStorage('datePickerSelect')
      const quickValue = param && param.quickValue
      let val = (param && param.value) || this.data
      if (quickValue && typeof quickValue == 'string') {
        // 快捷键日期值处理
        val = [`now-${quickValue}`, 'now']
      }
      return val
    },
    // 替换参数
    replaceQueryString(url, name, value) {
      if (url.includes(`&${name}=`)) {
        const re = new RegExp(name + '=[^&]*', 'gi')
        return url.replace(re, name + '=' + value || '')
      } else {
        return `${url}&${name}=${value}`
      }
    },
    retTimePicker() {
      let sTime = this.time[0]
      let str = 'Last '
      let numAndUnit = sTime.split('-')[1]
      let text = ''
      if (numAndUnit.indexOf('d') > -1) {
        text = numAndUnit.replace('d', ' days')
      } else if (numAndUnit.indexOf('h') > -1) {
        text = numAndUnit.replace('h', ' hours')
      } else if (numAndUnit.indexOf('s') > -1) {
        text = numAndUnit.replace('s', ' secondes')
      } else if (numAndUnit.indexOf('m') > -1) {
        text = numAndUnit.replace('m', ' minites')
      }
      return str + text
    },
  },
}
</script>
<style lang="less" scoped>
.data-time-box {
  position: relative;
  cursor: pointer;
  .last-time {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    border: 1px solid #dcdfe6;
    background: #fff;
    font-size: 12px;
    color: #606266;
    padding: 0 10px;
  }
  .hide-date-time {
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  .show-date-time {
    opacity: 1;
    position: static;
  }
}
</style>
