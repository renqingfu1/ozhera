<template>
  <div class="timer-box">
    <div v-if="showShort" class="short-time">时间：{{ retTimePicker() }}</div>
    <el-button @click="handleCommand(-1)" size="small" v-show="!showShort"
      >-1h</el-button
    >
    <el-button @click="handleCommand(-24)" size="small" v-show="!showShort"
      >-1d</el-button
    >
    <el-date-picker
      size="small"
      v-model="myTimer"
      type="datetimerange"
      range-separator="~"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      align="right"
      value-format="timestamp"
      :picker-options="pickerOptions"
      :clearable="false"
      popper-class="slow-query-timer-pop"
      :class="showShort ? 'absolute-timer' : ''"
    >
    </el-date-picker>
    <el-button
      @click="handleCommand(1)"
      class="one-hour"
      size="small"
      v-show="!showShort"
      >+1h</el-button
    >
    <el-button @click="handleCommand(24)" size="small" v-show="!showShort"
      >+1d</el-button
    >
  </div>
</template>
<script>
export default {
  props: {
    value: {},
  },
  computed: {
    myTimer: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
        this.emitVal(val)
      },
    },
    showShort() {
      if (
        typeof this.myTimer[0] == 'string' &&
        this.myTimer[0].startsWith('now')
      ) {
        // 表示时间是 now 开头的
        return true
      }
      return false
    },
  },
  methods: {
    retTimePicker() {
      let sTime = this.myTimer[0]
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
    handleCommand(command) {
      let changeT = command * 60 * 60 * 1000
      let sTime = parseInt(this.myTimer[0]) + changeT
      let eTime = parseInt(this.myTimer[1]) + changeT
      let cTime = new Date().getTime()
      let sevenDayTimestamp = 7 * 24 * 60 * 60 * 1000
      if (cTime - sTime > sevenDayTimestamp || eTime > cTime) {
        this.$message({
          type: 'warn',
          message: '只能搜索当前时间至七天前的信息！',
        })
        return
      }
      this.emitVal([sTime, eTime])
    },
    emitVal(val) {
      this.$emit('change', val)
    },
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '近1小时',
            onClick(picker) {
              picker.$emit('pick', ['now-1h', 'now'])
            },
          },
          {
            text: '近3小时',
            onClick(picker) {
              picker.$emit('pick', ['now-3h', 'now'])
            },
          },
          {
            text: '近6小时',
            onClick(picker) {
              picker.$emit('pick', ['now-6h', 'now'])
            },
          },
          {
            text: '近12小时',
            onClick(picker) {
              picker.$emit('pick', ['now-12h', 'now'])
            },
          },
          {
            text: '近1天',
            onClick(picker) {
              picker.$emit('pick', ['now-1d', 'now'])
            },
          },
          {
            text: '近3天',
            onClick(picker) {
              picker.$emit('pick', ['now-3d', 'now'])
            },
          },
          {
            text: '近7天',
            onClick(picker) {
              picker.$emit('pick', ['now-7d', 'now'])
            },
          },
        ],
        disabledDate(time) {
          return (
            time.getTime() < Date.now() - 8 * 24 * 60 * 60 * 1000 ||
            time.getTime() > Date.now()
          )
        },
      },
    }
  },
}
</script>
<style lang="less" scoped>
.timer-box {
  position: relative;
  height: 32px;
  overflow: hidden;
  .el-button {
    vertical-align: top;
    margin-left: 0;
    border-right: none;
  }
  .absolute-timer {
    position: absolute;
    opacity: 0;
    left: 0;
    top: 0;
  }
  .one-hour {
    border-left: none;
  }
  .el-button:last-child {
    border-right: 1px solid #dcdfe6;
  }
}
.short-time {
  height: 32px;
  line-height: 32px;
  border: solid 1px #1890ff;
  font-size: 12px;
  padding: 0 10px;
  color: #1890ff;
  cursor: pointer;
}
</style>
<style lang="less">
.slow-query-timer-pop {
  .el-picker-panel__footer {
    .el-button--text {
      display: none;
    }
  }
}
</style>
