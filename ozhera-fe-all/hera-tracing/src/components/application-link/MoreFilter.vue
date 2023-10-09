<template>
  <div class="more-filter">
    <el-form :model="form" class="more-filter-container">
      <el-row>
        <!-- traceID -->
        <!-- <el-col :span="colSpan">
          <el-form-item label="traceID：" prop="traceID" label-width="100px">
            <el-input
              v-model.trim="form.traceID"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col> -->
        <!-- 应用操作 -->
        <el-col :span="colSpan">
          <el-form-item
            :label="$t('applicationOperation') + '：'"
            prop="operation"
            label-width="100px"
          >
            <el-select-v2
              v-model="form.operation"
              :options="operationsOptions"
              :placeholder="$t('pleaseSelect')"
              filterable
              popper-class="operations-popper select-v2-popper"
              :disabled="operationsDisabled"
              @change="operationsChange"
            >
              <template #default="{ item }">
                <el-tooltip
                  effect="dark"
                  placement="bottom-start"
                  :show-after="100"
                  popper-class="operations-tooltip"
                >
                  <template #content>
                    {{ item.label }}
                  </template>
                  <span class="operations-list-item">{{ item.label }}</span>
                </el-tooltip>
              </template>
            </el-select-v2>
          </el-form-item>
        </el-col>
        <!-- 标记 -->
        <el-col :span="colSpan">
          <el-form-item label="Tag：" prop="tags" label-width="90px">
            <el-input
              v-model="form.tags"
              placeholder="http.status_code=200 error=true"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 应用环境 -->
        <el-col :span="colSpan">
          <el-form-item
            :label="$t('applicationEnvironment') + '：'"
            label-width="100px"
          >
            <InstanceFilter v-model="filterInstance" />
          </el-form-item>
        </el-col>
        <!-- 持续时间 -->
        <el-col :span="colSpan">
          <el-form-item :label="$t('duration') + '：'" label-width="100px">
            <div class="duration-content">
              <el-input
                v-model="form.minDuration"
                :placeholder="
                  $t('min') + '(' + this.placeholderDurationFields + ')'
                "
                @input="durationChange"
              ></el-input>
              <span class="duration-line"></span>
              <el-input
                v-model="form.maxDuration"
                :placeholder="
                  $t('max') + '(' + this.placeholderDurationFields + ')'
                "
                @input="durationChange"
              ></el-input>
            </div>
          </el-form-item>
        </el-col>
        <!-- 按钮 -->
        <el-col :span="colSpan">
          <el-button
            type="primary"
            class="filter-btn"
            @click="serachBtnClick"
            :disabled="btnDisabled"
          >
            {{ $t("query") }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import InstanceFilter from "./InstanceFilter.vue";
export default {
  name: "MoreFilter",
  props: {
    service: {},
    operation: {},
    tags: {},
    maxDuration: {},
    minDuration: {},
    getTraces: {},
    operationsOptions: {},
    serverEnv: {},
    serviceName: {},
  },
  components: {
    InstanceFilter,
  },
  data() {
    return {
      colSpan: 8, // 分列
      form: {
        traceID: "", //traceID
        operation: this.$props.operation, //应用操作值
        tags: this.$props.tags, // 标记值
        maxDuration: this.$props.maxDuration, // 持续时间值
        minDuration: this.$props.minDuration,
        serverEnv: this.$props.serverEnv,
        serviceName: this.$props.serviceName,
      },
      operationsDisabled: !this.$props.service, // 应用操作禁用
      placeholderDurationFields: "e.g. 1s, 100ms, 500us",
      btnDisabled: false, //按钮是否禁用
      filterInstance: {
        env: this.$props.serverEnv,
        service: this.$props.serviceName,
      },
    };
  },
  watch: {
    service(newValue) {
      this.operationsDisabled = !newValue;
    },
    operation(newValue) {
      this.form.operation = newValue;
    },
    tags(newValue) {
      this.form.tags = newValue;
    },
    maxDuration(newValue) {
      this.form.maxDuration = newValue;
    },
    minDuration(newValue) {
      this.form.minDuration = newValue;
    },
    filterInstance(newValue) {
      this.form.serverEnv = newValue.env;
      this.form.serviceName = newValue.service;
    },
  },
  methods: {
    //操作改变
    operationsChange() {
      this.$emitter.emit("applicationLink", {
        operation: this.form.operation,
      });
    },
    //持续时间校验
    durationChange() {
      if (
        (/^[0-9]*(us|ms|s|m|h)$/.test(this.form.minDuration) ||
          !this.form.minDuration) &&
        (/^[0-9]*(us|ms|s|m|h)$/.test(this.form.maxDuration) ||
          !this.form.maxDuration)
      ) {
        this.btnDisabled = false;
      } else {
        this.btnDisabled = true;
      }
    },
    // 查询按钮点击
    serachBtnClick: function () {
      // 向applicationLink组件传值
      Promise.resolve(this.$emitter.emit("applicationLink", this.form)).then(
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
@import "../../style/theme.scss";
.more-filter {
  padding: 20px 20px 0 20px;
  &-container {
    padding: 20px 20px 0 20px;
    background: #fff;
  }
}
.duration-content {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  .duration-line {
    width: 20px;
    height: 1px;
    background-color: #ddd;
  }
}
.filter-btn {
  margin-left: 90px;
  letter-spacing: 4px;
  padding-top: 0px;
  padding-bottom: 0px;
  font-size: 14px;
  height: 30px;
}
</style>
<style lang="scss">
@import "../../style/common.scss";
// 筛选下拉列表
.filter-item-list {
  max-width: 400px;
}
.duration-content {
  .el-input__inner {
    border: none !important;
    text-align: center;
  }
}
.operations-popper {
  min-width: 400px !important;
}
.operations-list-item {
  @include text-ellipsis;
  max-width: 246px !important;
  width: auto !important;
  display: inline-block;
}
.operations-tooltip {
  min-width: 40px !important;
}
</style>
