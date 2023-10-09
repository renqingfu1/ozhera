<template>
  <el-select v-model="time" :placeholder=" $t('pleaseSel')" size="small"
             style="width: 90px; vertical-align: middle"
             @change="selectChange">
    <el-option
        v-for="item in timeOptions"
        :key="item"
        :label="item"
        :value="item">
    </el-option>
  </el-select>
</template>
<script>
import { setSelectStorage, getSelectStorage } from '@/utils/localStorage';

export default {
  name: 'grafana-date',
  props: {
    value: String,
    url: String,
    isToSecond: { // 是否转出成秒数
      type: Boolean,
      default: false
    },
    secondParamName: { // 秒数url参数key
      type: String,
      default: 'var-query0'
    },
    timeOptions: { // 秒数url参数key
      type: Array,
      default: () => ['30s', '1m', '5m', '15m', '30m', '1h', '2h', '6h', '12h', '1d', '2d', '3d', '7d']
    }
  },
  watch: {
    value(newVal) {
      this.time = getSelectStorage('timePickerSelect') || newVal
      this.selectChange()
    },
    '$route'() {
      const val = getSelectStorage('timePickerSelect');
      if(val && JSON.stringify(val) != JSON.stringify(this.time)) {
        this.time = val
        this.selectChange();
      }
    },
  },
  data() {
    return {
      time: '', // 选中时间
      toTime: { // 时间转换成秒
        's': 1,
        'm': 60,
        'h': 60 * 60,
        'd': 60 * 60 * 24
      }
    }
  },
  created() {
    this.time = getSelectStorage('timePickerSelect') || this.value
    this.selectChange()
  },
  methods: {
    // 选择时间
    selectChange() {
      this.loading = true;
      setSelectStorage('timePickerSelect', this.time) // 存储选中数据
      let url = this.replaceQueryString(this.url, 'from', `now-${this.time}`)
      url = this.replaceQueryString(url, 'to', 'now')
      if (this.isToSecond && this.time) {
        const s = this.toTime[this.time.slice(-1)]
        const value = this.time.slice(0, -1) * s
        url = this.replaceQueryString(url, this.secondParamName, value)
      }
      this.$emit('changDateFn', url, this.time)
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
  }
}
</script>
