<template>
  <div class="date-time">
    <el-config-provider :locale="locale">
      <el-date-picker
        v-model="dateTime"
        type="datetimerange"
        :shortcuts="shortcuts"
        range-separator="~"
        :start-placeholder="$t('startDate')"
        :end-placeholder="$t('endtDate')"
        size="small"
        @change="dateChange"
      >
      </el-date-picker>
    </el-config-provider>
  </div>
</template>

<script>
import { ElConfigProvider } from "element-plus";
import moment from "moment";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";

export default {
  name: "DateTime",
  components: {
    ElConfigProvider,
  },
  props: {
    getTraces: {},
    start: {},
    end: {},
  },
  data() {
    const { start, end } = this.$props;
    const { startTime, endTime, diffHour } = this.timeGet(start, end);
    return {
      startTime: start,
      endtime: end,
      dateTime: [startTime, endTime],
      lookbackValue: diffHour && diffHour <= 24 ? diffHour + "h" : "custom",
    };
  },
  watch: {
    start(newValue) {
      this.startTime = newValue;
      this.timeSet();
    },
    end(newValue) {
      this.endtime = newValue;
      this.timeSet();
    },
  },
  computed: {
    locale() {
      return this.i18n.locale.value == "zh-CN" ? zhCn : en;
    },
    shortcuts() {
      return [
        {
          text: this.$t("lastHour", { num: 1 }),
          value: () => {
            return [moment().subtract(1, "hours"), moment()];
          },
        },
        {
          text: this.$t("lastHour", { num: 2 }),
          value: () => {
            return [moment().subtract(2, "hours"), moment()];
          },
        },
        {
          text: this.$t("lastHour", { num: 3 }),
          value: () => {
            return [moment().subtract(3, "hours"), moment()];
          },
        },
        {
          text: this.$t("lastHour", { num: 6 }),
          value: () => {
            return [moment().subtract(6, "hours"), moment()];
          },
        },
        {
          text: this.$t("lastHour", { num: 12 }),
          value: () => {
            return [moment().subtract(12, "hours"), moment()];
          },
        },
        {
          text: this.$t("lastHour", { num: 24 }),
          value: () => {
            return [moment().subtract(24, "hours"), moment()];
          },
        },
        {
          text: this.$t("lastDay", { num: 2 }),
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
            return [start, end];
          },
        },
        {
          text: this.$t("lastWeek"),
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [start, end];
          },
        },
        {
          text: this.$t("lastMonth", { num: 1 }),
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            return [start, end];
          },
        },
        {
          text: this.$t("lastMonth", { num: 3 }),
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            return [start, end];
          },
        },
      ];
    },
  },
  methods: {
    timeGet(start, end) {
      const startTime = start ? moment(start).format() : "";
      const endTime = end ? moment(end).format() : "";
      const diffStart = start ? moment(start) : null;
      const diffEnd = end ? moment(end) : null;
      const diffHour = diffEnd.diff(diffStart, "hour");
      return {
        startTime,
        endTime,
        diffHour,
      };
    },
    timeSet() {
      const { startTime, endTime, diffHour } = this.timeGet(
        this.startTime,
        this.endtime
      );
      this.dateTime = [startTime, endTime];
      this.lookbackValue =
        diffHour && diffHour <= 24 ? diffHour + "h" : "custom";
    },
    // 时间发生改变
    dateChange(dates) {
      const start = dates ? moment(dates["0"]) : null;
      const end = dates ? moment(dates["1"]) : null;
      const diffHour = start && end ? end.diff(start, "hour") : "";
      const timeObj = {
        start: dates ? moment(dates["0"]).valueOf() * 1000 : null,
        end: dates ? moment(dates["1"]).valueOf() * 1000 : null,
        lookback: diffHour && diffHour <= 24 ? diffHour + "h" : "custom",
      };
      // 向applicationLink组件传值
      Promise.resolve(this.$emitter.emit("applicationLink", timeObj)).then(
        () => {
          // 更新数据
          this.getTraces();
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.date-time {
  margin-right: 15px;
}
</style>
