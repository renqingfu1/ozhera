<template>
  <el-select
    v-model="value"
    multiple
    :placeholder="placeholder"
    :size="size"
    ref="select"
    @change="changeHandle"
    @visible-change="visibleChange"
  >
    <el-option
      :value="checkAll"
      :class="{ selected: checkAll }"
      v-if="
        isShowCheckAll &&
        options &&
        (options.length != 1 ||
          (options.length == 1 && valueKey
            ? options[0][valueKey] != this.mutexOption
            : options[0] != this.mutexOption))
      "
    >
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          padding-left: 20px;
        "
        @change="checkAllChange"
        >全选</el-checkbox
      >
    </el-option>
    <el-option
      v-for="(item, index) in options"
      :key="index"
      :label="labelKey ? item[labelKey] : item"
      :value="valueKey ? item[valueKey] : item"
    >
      <el-checkbox
        :value="value.includes(item)"
        v-if="multiple && isShowCheckAll"
        style="width: 100%"
        @change="handleCheckedChange(item)"
        >{{ item }}</el-checkbox
      >
    </el-option>
  </el-select>
</template>
<script>
export default {
  props: {
    data: null, // 绑定值
    options: {
      // 下拉选项值
      type: Array,
      default: () => [],
    },
    multiple: {
      // 是否多选
      type: Boolean,
      default: false,
    },
    isShowCheckAll: {
      // 是否有全选选项
      type: Boolean,
      default: false,
    },
    size: {
      // 下拉框尺寸
      type: String,
      default: "small",
    },
    placeholder: {
      // 占位符
      type: String,
      default: "请选择",
    },
    labelKey: {
      // 下拉选项label 标识的键名
      type: String,
      default: "label",
    },
    valueKey: {
      // 下拉选项value 标识的键名
      type: String,
      default: "value",
    },
    mutexOption: {
      // 互斥选项
      type: String,
      default: "",
    },
  },
  watch: {
    data: {
      handler(newVal) {
        this.value = newVal;
        this.checkAll = false;
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      value: null,
      checkAll: false, // 实例是否全选
      isIndeterminate: false, // 全选checkbox 的不确定状态
    };
  },
  mounted() {
    this.addCloseEvent();
  },
  unmounted() {
    document.removeEventListener("focusout", this.focuseoutListener);
  },
  methods: {
    // 点击其他地方隐藏下拉选项框
    addCloseEvent() {
      this.focuseoutListener = () => {
        setTimeout(() => {
          const activeElement = document.activeElement;
          const selectVm = this.$refs.select;
          if (activeElement.nodeName === "IFRAME") {
            selectVm.handleClose(); // element-ui 统一命名的关闭下拉框方法
          }
        }, 100);
      };
      document.addEventListener("focusout", this.focuseoutListener);
      // this.$once('hook:beforeDestroy', () => {
      //   document.removeEventListener('focusout', fn)
      // })
    },
    // 实例全选
    checkAllChange(val) {
      this.value = val ? this.getAllOptions() : [];
      this.isIndeterminate = false; // 全选checkbox 的不确定状态
    },
    // 获取实例全选数据
    getAllOptions() {
      const arr = [];
      this.options.forEach((item) => {
        if (this.mutexOption && item != this.mutexOption) {
          arr.push(item);
        }
      });
      return arr;
    },
    changeHandle(val) {
      this.value = this.AllSelectChangeValue(val); // 选中值处理
    },
    // 处理实例选中数据
    visibleChange(visible) {
      if (!visible) {
        this.$emit("changDateFn", this.value);
      }
    },
    // 勾选事件
    handleCheckedChange(val) {
      // 选中互斥选项
      if (val == this.mutexOption) {
        this.value = [this.mutexOption];
        this.checkAll = false; // 实例是否全选
        this.isIndeterminate = false; // 全选checkbox 的不确定状态
        return false;
      }
      const index = this.value.findIndex((item) => item === val);
      if (index === -1) {
        this.value.push(val);
      } else {
        this.value.splice(index, 1);
      }
      // 全选
      let checkedCount = this.value.length;
      let optionCount = this.options.length;
      if (this.mutexOption) {
        optionCount = optionCount - 1;
      }
      this.checkAll = checkedCount === optionCount;
      this.isIndeterminate = checkedCount > 0 && checkedCount < optionCount;
    },
    // 选中值处理
    AllSelectChangeValue(val) {
      // 互斥选项处理
      if (this.mutexOption && this.multiple && val.length) {
        let data = [];
        const index = val.indexOf(this.mutexOption);
        if (index === val.length - 1) {
          data = [this.mutexOption]; // 环境默认All
        } else if (index !== -1) {
          val.splice(index, 1);
          data = val;
        } else {
          data = val;
        }
        return data;
      } else {
        return val;
      }
    },
  },
};
</script>
