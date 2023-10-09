<!--
 * @Description: 
 * @Date: 2021-12-10 16:02:14
 * @LastEditTime: 2023-09-13 14:13:20
-->
<template>
  <div class="trace-id-table table-chart">
    <!-- 快速地位 -->
    <div class="affix-container" @click="affixClick" v-if="statusError()">
      <div class="affix-content">
        <div class="affix-icon"><i class="iconfont icon-run-left"></i></div>
        <span>{{ $t("quicklyLocateAnomalies") }}</span>
      </div>
    </div>
    <!--信息 -->
    <div class="table-info">
      <span
        >{{ $t("startPoint") }}：<b>{{ tableInfo?.startTime }}</b></span
      >
      <span
        >{{ $t("duration") }}：<b>{{ tableInfo?.duration }}</b></span
      >
      <span
        >{{ $t("number") }}：<b>{{ serviceNum() }}</b></span
      >
      <span
        >{{ $t("linkDepth") }}：<b>{{ tableInfo.depth }}</b></span
      >
      <span
        >{{ $t("total") }}：<b>{{ tableInfo.total }}</b></span
      >
    </div>
    <!-- 表格 -->
    <div
      :class="[
        'table-content',
        'table-list',
        tableInfo.linePos ? '' : 'table-line',
        tableInfo.hasLine ? '' : 'no-line',
      ]"
      v-loading="loading"
      :element-loading-text="$t('loading')"
    >
      <!-- 头部 -->
      <TableHead :durationMs="tableInfo.durationMs"></TableHead>
      <!-- 内容 -->
      <div v-if="tableData.length">
        <div v-for="(item, index) in tableData" :key="item.spanID + index">
          <TableRow
            :tableData="tableData"
            :item="item"
            :durationMs="tableInfo.durationMs"
            :startTimeMS="tableInfo.startTimeMS"
            :detail="detail"
            :processes="processes"
            :index="index"
          ></TableRow>
        </div>
      </div>
      <el-empty :description="$t('emptyDescription')" v-else></el-empty>
    </div>
    <!-- span详情 -->
    <SpanDetail
      :showSpanDetail="showSpanDetail"
      :closeSpanDetail="closeSpanDetail"
      :detailData="detailData"
    ></SpanDetail>
  </div>
</template>

<script>
import TableHead from "./TableHead.vue";
import TableRow from "./TableRow.vue";
import SpanDetail from "./SpanDetail.vue";
import _values from "lodash/values";

export default {
  name: "TableChart",
  components: {
    TableHead,
    TableRow,
    SpanDetail,
  },
  props: {
    loading: {}, //加载状态
    processes: {}, //应用名透传
    tableData: {}, //表格数据
    tableInfo: {}, //信息
  },
  data() {
    return {
      showSpanDetail: false, // 是否显示span详情
      detailData: {}, //详细信息
      currentErrorIndex: 0, //当前错误信息的位置
      requestId: null,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, true);
  },
  unmounted() {
    document.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    // 应用数量
    serviceNum() {
      return new Set(_values(this.$props.processes).map((p) => p.serviceName))
        .size;
    },
    //详情
    detail(data) {
      this.showSpanDetail = true;
      this.detailData = data;
    },
    //关闭详情
    closeSpanDetail() {
      this.showSpanDetail = false;
    },
    //是否有错误状态
    statusError() {
      const isErrorTag = ({ key, value }) =>
        key === "error" && (value === true || value === "true");
      return this.$props.tableData.filter((sp) => sp.tags.some(isErrorTag))
        .length;
    },
    //滚动到异常位置
    affixClick() {
      const $par = document.querySelector(".table-content");
      const $err = $par.querySelectorAll(".status-circle-error");
      if ($err.length) {
        let currentScroll = document.documentElement.scrollTop;
        let nextScroll = $err[this.currentErrorIndex].offsetTop - 60;
        this.scrollToTop(currentScroll, nextScroll, 1000);
      }
    },
    scrollToTop(scrollY, totalScrollDistance, duration) {
      const that = this;
      let oldTimestamp = null;
      const flag = totalScrollDistance - scrollY > 0;
      const diff = Math.abs(totalScrollDistance - scrollY);

      function step(newTimestamp) {
        if (oldTimestamp !== null) {
          // if duration is 0 scrollY will be -Infinity
          if (flag) {
            scrollY += Math.max(
              30,
              (diff * (newTimestamp - oldTimestamp)) / duration
            );
            if (scrollY >= totalScrollDistance) {
              window.cancelAnimationFrame(that.requestId);
              return (document.documentElement.scrollTop = totalScrollDistance);
            }
          } else {
            scrollY -= Math.max(
              30,
              (diff * (newTimestamp - oldTimestamp)) / duration
            );
            if (scrollY <= totalScrollDistance) {
              window.cancelAnimationFrame(that.requestId);
              return (document.documentElement.scrollTop = totalScrollDistance);
            }
          }
          document.documentElement.scrollTop = scrollY;
        }
        oldTimestamp = newTimestamp;
        that.requestId = window.requestAnimationFrame(step);
      }
      window.cancelAnimationFrame(that.requestId);
      that.requestId = window.requestAnimationFrame(step);
    },
    handleScroll() {
      this.$nextTick(() => {
        const $par = document.querySelector(".table-content");
        const $err = $par.querySelectorAll(".status-circle-error");
        if ($err.length) {
          const scrollTop = document.documentElement.scrollTop;
          if (
            Math.ceil(scrollTop) + document.documentElement.clientHeight >=
            document.querySelector(".tracing-content").offsetHeight
          ) {
            this.currentErrorIndex = 0;
          } else if (
            Math.ceil(scrollTop) >=
            $err[$err.length - 1].offsetTop - 60
          ) {
            this.currentErrorIndex = 0;
          } else {
            let flag = true;
            $err.forEach((item, index) => {
              if (Math.ceil(scrollTop) < item.offsetTop - 60 && flag) {
                this.currentErrorIndex = index;
                flag = false;
              }
            });
            flag = true;
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/theme.scss";
@import "../../style/common.scss";
.affix-container {
  position: fixed;
  top: 184px;
  right: 40px;
  width: 32px;
  height: 32px;
  z-index: 999;
  cursor: pointer;
  opacity: 0.8;
  .affix-content {
    display: flex;
    align-items: center;
    width: 120px;
    border-radius: 16px;
    .affix-icon {
      display: inline-block;
      width: 32px;
      height: 32px;
      position: relative;
    }
    i.icon-run-left {
      border-radius: 50%;
      color: #f56c6c;
      background: #fff;
      font-size: 32px;
      line-height: 32px;
      position: absolute;
      top: 0;
      left: 0;
    }
    span {
      padding: 0px 4px;
      color: #fff;
      font-size: 12px;
      font-weight: bold;
    }
  }
  &:hover {
    width: 120px;
    opacity: 1;
    transition: 500ms;
    .affix-content {
      background: #f56c6c;
      i.icon-run-left {
        color: #fff;
        background: #f56c6c;
        // animation: myfirst 300ms linear 0s 1 alternate;
        transition: 300ms;
      }
    }
  }
}
@keyframes myfirst {
  0% {
    transform: rotate(0deg);
    top: 0;
    left: 0;
  }
  25% {
    transform: rotate(90deg);
    top: -15px;
    left: 5px;
  }
  50% {
    transform: rotate(180deg);
    top: -30px;
    left: 0px;
  }
  75% {
    transform: rotate(270deg);
    top: -15px;
    left: -5px;
  }
  100% {
    transform: rotate(360deg);
    top: 0;
    left: 0;
  }
}
.table-chart {
  //信息
  .table-info {
    padding: 10px 20px 12px 20px;
    font-size: 14px;
    line-height: 26px;
    span {
      display: inline-block;
      padding-right: 20px;
      color: $deeper-black-color;
    }
  }
  //内容
  .table-content {
    padding: 0px 20px 20px;
    min-height: 300px;
  }
}
</style>
