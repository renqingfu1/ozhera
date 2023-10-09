<!--
 * @Description: 
 * @Date: 2021-12-22 11:32:47
 * @LastEditTime: 2023-09-13 14:13:59
-->
<template>
  <el-drawer
    v-model="drawer"
    :title="
      'span' +
      $t('details') +
      '（SpanID：' +
      this.$props.detailData.spanID +
      '）'
    "
    :direction="direction"
    :before-close="handleClose"
    custom-class="span-detail"
    size="60%"
    :append-to-body="true"
  >
    <el-tabs v-model="activeName">
      <!-- Tag -->
      <el-tab-pane
        :label="'Tag(' + (detailData.tags ? detailData.tags.length : 0) + ')'"
        name="tag"
      >
        <div class="tab-item-container">
          <div
            class="item-module"
            v-if="detailData.tags && detailData.tags.length"
          >
            <div
              class="item-list"
              v-for="(item, index) in detailData.tags"
              :key="index"
            >
              <span class="item-title">{{ item.key }}</span>
              <span class="item-content">
                {{ item.value }}
              </span>
            </div>
          </div>
          <el-empty :image-size="200" v-else></el-empty>
        </div>
      </el-tab-pane>
      <!-- Process -->
      <el-tab-pane
        :label="
          'Process(' +
          (detailData?.process?.tags ? detailData?.process?.tags.length : 0) +
          ')'
        "
        name="process"
      >
        <div class="tab-item-container">
          <div
            class="item-module"
            v-if="detailData?.process?.tags && detailData?.process?.tags.length"
          >
            <div
              class="item-list"
              v-for="(item, index) in detailData?.process?.tags"
              :key="index"
            >
              <span class="item-title">{{ item.key }}</span>
              <span class="item-content">
                {{ item.value }}
              </span>
            </div>
          </div>
          <el-empty :image-size="200" v-else></el-empty></div
      ></el-tab-pane>
      <!-- Log -->
      <el-tab-pane
        :label="'Event(' + (detailData.logs ? detailData.logs.length : 0) + ')'"
        name="log"
      >
        <div class="tab-item-container">
          <div
            class="item-module"
            v-if="detailData.logs && detailData.logs.length"
          >
            <div
              v-for="(item, index) in detailData.logs"
              :key="index"
              class="event-module"
            >
              <div
                v-for="(content, contentIndex) in item.fields"
                :key="contentIndex"
                class="item-list"
              >
                <span class="item-title">{{ content.key }}</span>
                <span class="item-content">
                  {{ content.value }}
                </span>
              </div>
            </div>
          </div>
          <el-empty :image-size="200" v-else></el-empty>
        </div>
      </el-tab-pane>
      <!-- Warnings -->
      <el-tab-pane
        :label="
          'Warnings(' +
          (detailData.warnings ? detailData.warnings.length : 0) +
          ')'
        "
        name="warnings"
      >
        <div class="tab-item-container">
          <div
            class="item-module"
            v-if="detailData.warnings && detailData.warnings.length"
          >
            <div
              class="item-list"
              v-for="(item, index) in detailData.warnings"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
          <el-empty :image-size="200" v-else></el-empty></div
      ></el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script>
export default {
  name: "SpanDetail",
  props: {
    showSpanDetail: {},
    closeSpanDetail: {},
    detailData: {},
  },
  data() {
    return {
      drawer: this.$props.showSpanDetail,
      direction: "rtl",
      activeName: "tag",
    };
  },
  watch: {
    showSpanDetail: {
      handler(newValue) {
        this.drawer = newValue;
        this.activeName = "tag";
      },
    },
  },
  methods: {
    // 关闭抽屉
    handleClose() {
      this.$props.closeSpanDetail();
    },
  },
};
</script>

<style lang="scss">
@import "../../style/theme.scss";
.span-detail {
  height: 100%;
  .el-drawer__header {
    font-size: 16px;
    padding-top: 15px;
    padding-bottom: 15px;
    margin-bottom: 0px;
    font-weight: bold;
    color: $deep-black-color;
  }
  .el-drawer__body {
    border-top: 1px solid #ddd;
    height: calc(100% - 54px);
  }
  .el-tabs {
    height: 100%;
  }
  .el-tabs__content {
    height: calc(100% - 45px);
    overflow: auto;
  }
  .item-module {
    padding-bottom: 10px;
  }
  .item-list {
    line-height: 20px;
    display: flex;
    padding: 5px 10px;
    &:nth-of-type(2n) {
      background-color: #f2f2f2;
    }
  }
  .item-title {
    width: 19%;
    color: $lighter-black-color;
    word-wrap: break-word;
    margin-right: 1%;
  }
  .item-content {
    width: 80%;
    color: $themeColor;
    word-wrap: break-word;
    white-space: pre-wrap;
  }
  // event
  .event-module {
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 4px;
    margin: 6px 6px 20px 6px;
    &:hover {
      //box-shadow: offset-x offset-y blur spread color inset;
      // box-shadow: X轴偏移量 Y轴偏移量 [阴影模糊半径] [阴影扩展] [阴影颜色] [投影方式];
      box-shadow: 1px 1px 5px 2px #eee;
    }
  }
}
</style>
