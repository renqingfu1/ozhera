<template>
  <div class="filter-container">
    <!-- TraceID： -->
    <div class="filter-trace-id">
      <span>TraceID：</span>
      <el-input
        v-model.trim="traceIdNew"
        :placeholder="$t('placeholder')"
        class="trace-id-input"
        @keyup.enter="inputEnterSearch"
      >
        <template #suffix>
          <Search class="icon-search" @click="inputEnterSearch" /> </template
      ></el-input>
      <el-tooltip effect="dark" :content="$t('copy')" placement="right">
        <DocumentCopy class="icon-document-copy" @click="copy"></DocumentCopy>
      </el-tooltip>
    </div>
    <!-- 时间 -->
    <el-select
      v-model="time"
      :placeholder="$t('timePlaceholder')"
      class="filter-time"
      @change="timeChange"
    >
      <el-option
        v-for="item in timeOptions"
        :key="item.value"
        :label="item.value === 'today' ? $t('today') : item.value + $t('day')"
        :value="item.value"
      />
    </el-select>
    <!-- 区域 -->
    <el-select
      v-model="area"
      :placeholder="$t('regionPlaceholder')"
      class="filter-time"
      @change="areaChange"
    >
      <el-option
        v-for="item in areaOptions"
        :key="item.value"
        :label="$t(`${item.label}`)"
        :value="item.value"
      />
    </el-select>
    <!-- 历史 -->
    <!-- <el-checkbox
      v-model="historyNew"
      label="查询历史"
      class="history"
      @change="historyChange"
    ></el-checkbox> -->
  </div>
</template>

<script>
import { Search, DocumentCopy } from "@element-plus/icons-vue";
import useClipboard from "vue-clipboard3";
import { ElMessage } from "element-plus";

const isProd = window.location.host.indexOf("test") === -1;
const areaDefault = isProd ? "c3" : "staging";

// const getTime = (start, end) => {
//   if (start && end) {
//     if (start == new Date(new Date().toLocaleDateString()).getTime()) {
//       return "today";
//     }
//     const days = Math.floor((end - start) / 86400000);
//     if ([2, 3, 4, 5, 6, 7].indexOf(days) > -1) {
//       return "" + days;
//     }
//   }
//   return "";
// };

export default {
  name: "FilterTraceId",
  components: {
    Search,
    DocumentCopy,
  },
  props: {
    traceId: {},
    history: {},
    getTracesData: {},
  },
  data() {
    const { days, area: areaQuery } = this.$route.query;
    return {
      traceIdNew: this.$props.traceId, // 选中的值
      time: days, //时间
      area: areaQuery || areaDefault,
      timeOptions: [
        {
          value: "today",
        },
        {
          value: "2",
        },
        {
          value: "3",
        },
        {
          value: "4",
        },
        {
          value: "5",
        },
        {
          value: "6",
        },
        {
          value: "7",
        },
      ],
      areaOptions: isProd
        ? [
            {
              value: "all",
              label: this.$t("notSpecified"),
            },
            {
              value: "c3",
              label: this.$t("China"),
            },
            {
              value: "ali-sgp",
              label: this.$t("Singapore"),
            },
            {
              value: "aws-or",
              label: this.$t("America"),
            },
            {
              value: "ksru-mos",
              label: this.$t("Russia"),
            },
            {
              value: "aws-de",
              label: this.$t("Germany"),
            },
            {
              value: "aws-mb",
              label: this.$t("India"),
            },
            {
              value: "az-ams",
              label: this.$t("Holland"),
            },
          ]
        : [
            {
              value: "all",
              label: this.$t("notSpecified"),
            },
            {
              value: "staging",
              label: "staging",
            },
          ],
      historyNew: this.$props.history, //是否查询历史
    };
  },
  watch: {
    traceId(newValue) {
      this.traceIdNew = newValue;
    },
    history(newValue) {
      this.historyNew = newValue;
    },
  },
  methods: {
    //输入框值改变
    inputEnterSearch() {
      this.$router.push({
        path: "/traceid/" + this.traceIdNew,
        query: {
          area: areaDefault,
          ...this.$route.query,
          source: undefined,
          timestamp: new Date().getTime(),
        },
      });
    },
    //复制
    copy() {
      const Msg = this.traceIdNew;
      const { toClipboard } = useClipboard();
      try {
        //复制
        toClipboard(Msg);
        //下面可以设置复制成功的提示框等操作
        if (Msg) {
          ElMessage.success(this.$t("replicatingSuccess"));
        } else {
          ElMessage.error(this.$t("noContentToCopy"));
        }
      } catch (e) {
        //复制失败
        console.error(e);
        ElMessage.error(this.$t("copyFailed"));
      }
    },
    //时间改变
    timeChange() {
      const start = new Date();
      const end = new Date().getTime();
      const todayStartTime = new Date().setTime(
        new Date(new Date(new Date().toLocaleDateString()).getTime())
      );
      let startTime = todayStartTime;
      let endTime = end;
      if (this.time && this.time !== "today") {
        startTime = start.setTime(
          todayStartTime - 3600 * 1000 * 24 * Number(this.time - 1)
        ); //开始时间
        endTime = start.setTime(
          todayStartTime - 3600 * 1000 * 24 * Number(this.time - 2) - 1000
        ); //结束时间
      }
      this.$router.push({
        path: this.$route.path,
        query: {
          area: areaDefault,
          ...this.$route.query,
          startTime,
          endTime,
          days: this.time,
        },
      });
    },
    areaChange() {
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          area: this.area,
        },
      });
    },
    //历史
    historyChange() {
      // 向applicationLink组件传值
      Promise.resolve(
        this.$emitter.emit("traceId", {
          history: this.historyNew,
        })
      ).then(() => {
        // 更新数据
        this.$props.getTracesData();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/theme.scss";
.filter-container {
  display: flex;
  align-items: center;
}
.filter-trace-id {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: $deep-black-color;
  letter-spacing: 0;
  line-height: 30px;
  font-weight: 650;
  display: flex;
  align-items: center;
  .trace-id-input {
    width: 320px;
    margin: 0px 12px 0 0px;
  }
  .icon-search {
    width: 18px;
    cursor: pointer;
    &:hover {
      color: $deeper-black-color;
    }
  }
  .icon-document-copy {
    width: 20px;
    color: $lighter-black-color;
    cursor: pointer;
    &:hover {
      color: $deeper-black-color;
    }
  }
}
.filter-time {
  padding-left: 20px;
}
.history {
  padding-left: 20px;
}
</style>
