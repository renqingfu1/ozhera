<template>
  <div class="c-table-row" v-show="isShow(item.parentIndex)">
    <!-- 应用名 -->
    <div class="c-table-cell" :style="'width: 260px;overflow:hidden;'">
      <div
        class="app-name-cell"
        :style="'padding-left: ' + (item.depth - 1) * 10 + 'px;'"
      >
        <div class="c-table-arrow">
          <span class="c-table-arrow-icon" v-if="item.hasChildren">
            <el-icon
              :size="12"
              @click="
                () => {
                  arrowClick(item);
                }
              "
            >
              <ArrowDown v-show="item.arrow" />
              <ArrowRight v-show="!item.arrow" />
            </el-icon>
          </span>
        </div>
        <div class="text-ellipsis">
          <el-tooltip
            effect="dark"
            :content="processes[item.processID]?.serviceName"
            placement="top"
            :show-after="showAfter"
          >
            <span
              class="process-name"
              :style="{
                'border-color': color[getColorIndex(item) % color.length],
              }"
            >
              {{ processes[item.processID]?.serviceName }}
            </span>
          </el-tooltip>
        </div>
      </div>
    </div>
    <!-- 状态 -->
    <div
      class="c-table-cell text-center status-cell"
      style="width: 50px"
      @click="detail(item)"
    >
      <span
        :class="[
          'status-circle status-circle-link',
          item?.tags?.some(isErrorTag)
            ? 'status-circle-error'
            : 'status-circle-success',
        ]"
      >
      </span>
    </div>
    <!-- 方法 -->
    <div class="c-table-cell" style="width: 240px">
      <el-tooltip
        effect="dark"
        :content="item.operationName"
        placement="top-start"
        :show-after="showAfter"
        popper-class="tooltip-method"
      >
        <div class="text-ellipsis">
          <span>
            {{ item.operationName }}
          </span>
        </div>
      </el-tooltip>
    </div>
    <!-- 时间 -->
    <div class="c-table-cell flex-cell timeline-container">
      <div class="timeline-content">
        <div
          :style="{
            width:
              (item.duration
                ? Math.max(0.1, (item.duration / durationMs) * 100)
                : 0) + '%',
            marginLeft:
              ((item.startTime - startTimeMS) / durationMs) * 100 + '%',
            backgroundColor: color[getColorIndex(item) % color.length],
            height: '10px',
          }"
        ></div>
        <span class="start-time-tip">
          {{ $t("starTime") }}：{{ difference(item.startTime - startTimeMS) }}
        </span>
      </div>
    </div>
    <!-- 耗时 -->
    <div class="c-table-cell" style="width: 100px">
      <span>
        {{ difference(item.duration) }}
      </span>
    </div>
    <!-- 实例 -->
    <div class="c-table-cell" style="width: 120px">
      <span>
        {{
          item?.process?.tags?.find((item) => {
            return item?.key === "ip";
          })?.value
        }}
      </span>
    </div>
    <!-- 操作 -->
    <div class="c-table-cell" style="width: 50px">
      <span class="detail-link" @click="detail(item)">{{ $t("details") }}</span>
    </div>
  </div>
</template>

<script>
import { ArrowDown, ArrowRight } from "@element-plus/icons-vue";
import _values from "lodash/values";
import { formatDuration } from "../../utils/time";

export default {
  name: "TableRow",
  components: {
    ArrowDown,
    ArrowRight,
  },
  props: {
    tableData: {}, //所有的数据
    item: {}, //单个数据
    durationMs: {},
    startTimeMS: {},
    detail: {},
    processes: {},
    index: {},
  },
  data() {
    return {
      color: [
        "rgb(183, 136, 94)",
        "rgb(23, 184, 190)",
        "rgb(248, 220, 161)",
        "#B3AD9F",
        "#f3be92",
        "#ced182",
        "#f4d05a",
        "#87CEFF",
        "#7CCD7C",
        "#7EC0EE",
      ], // 颜色
      showAfter: 500, //延迟显示
    };
  },
  mounted() {
    this.getStartTimeTipLeft();
  },
  methods: {
    //当前元素是否展示
    isShow(parentIndex) {
      //根结点
      if (parentIndex === -1) {
        return true;
      } else {
        //如果父亲的箭头是向左的，这个元素则是隐藏的
        if (this.$props.tableData[parentIndex]?.arrow === false) {
          return false;
        } else {
          //父亲的箭头是向下的则找父亲的父亲
          return this.isShow(this.$props.tableData[parentIndex].parentIndex);
        }
      }
    },
    // 颜色索引
    getColorIndex(spanItem) {
      const allProcessNameArr = _values(this.$props.processes).map(
        (p) => p.serviceName
      );
      const spanItemServiceName =
        this.$props.processes[spanItem.processID]?.serviceName;
      let colorIndex;
      allProcessNameArr.forEach((item, index) => {
        if (item === spanItemServiceName) {
          colorIndex = index; //颜色索引
        }
      });
      return colorIndex;
    },
    //箭头点击
    arrowClick(item) {
      item.arrow = !item.arrow;
    },
    // 判断状态
    isErrorTag: ({ key, value }) => {
      return key === "error" && (value === true || value === "true");
    },
    //差值
    difference(time) {
      return formatDuration(time);
    },
    //计算浮动的位置
    getStartTimeTipLeft() {
      const { item, startTimeMS, durationMs, index } = this.$props;
      this.$nextTick(() => {
        const $ele = document.querySelectorAll(".start-time-tip")[index];
        $ele.style.left =
          "calc(" +
          ((item.startTime - startTimeMS) / durationMs) * 100 +
          "% - " +
          ($ele.offsetWidth + 14) +
          "px" +
          ")";
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/theme.scss";
@import "../../style/common.scss";
.c-table-row {
  display: flex;
  &:hover {
    background-color: #f3f6f9;
  }
  .c-table-cell {
    border-left: 1px solid #ebeef5;
    line-height: 20px;
    font-size: 14px;
    color: rgb(96, 98, 102);
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 3px;
    padding-bottom: 3px;
    display: flex;
    align-items: center;
    &:first-child {
      border-left: none;
    }
  }
  .c-table-arrow {
    display: flex;
    align-items: center;
    width: 20px;
    text-align: center;
    .c-table-arrow-icon {
      cursor: pointer;
      padding: 0 4px;
      position: relative;
      left: -4px;
      &:hover {
        background-color: #eee;
      }
    }
  }
}
//超出...
.text-ellipsis {
  flex: 1;
  @include text-ellipsis;
}
.text-center {
  text-align: center;
}
.flex-cell {
  flex: 1;
}
//应用名
.app-name-cell {
  display: flex;
  align-items: center;
}
.process-name {
  height: 20px;
  border-left-width: 3px;
  border-left-style: solid;
  padding-left: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}
//状态
.status-cell {
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
}

// 时间
.timeline-container {
  &:hover {
    .timeline-content {
      span {
        visibility: visible;
      }
    }
  }
}
.timeline-content {
  font-size: 12px;
  position: relative;
  width: 100%;
  span {
    visibility: hidden;
    color: #666;
    position: absolute;
    top: -6px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 0 3px;
    margin-left: 8px;
    white-space: nowrap;
    &:before,
    &:after {
      content: "";
      width: 0;
      height: 0;
      position: absolute;
      display: block;
      border-width: 6px;
      border-style: solid;
      top: 4px;
    }
    &:before {
      border-color: transparent transparent transparent #ccc;
      right: -12px;
    }
    &:after {
      border-color: transparent transparent transparent #fff;
      right: -11px;
    }
  }
}
//操作
.detail-link {
  font-size: 14px;
  color: $themeColor;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
</style>
<style lang="scss">
//方法
.tooltip-method {
  min-width: 40px;
  text-align: center;
  .el-popper__arrow,
  .el-popper__arrow:before {
    left: -20px;
  }
}
</style>
