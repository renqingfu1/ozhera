<template>
  <div class="container">
    <el-select
      v-if="groupBy"
      v-model="currentGroup"
      v-bind="$attrs"
      size="mini"
      style="width:95px;"
      @change="changeGroup"
      :placeholder="$t('policyPage.selectType')"
      class="group"
    >
      <el-option
        v-for="item in groupOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-select
      v-model="selVal"
      v-bind="$attrs"
      size="mini"
      @change="changeSelect"
      placeholder="请选择策略"
    >
      <el-option
        v-for="item in listOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    value: {},
    options: {
      require: true,
    },
    groupBy: String,
    groupOptions: [],
    defaultGroup: String,
  },
  data() {
    return {
      currentGroup: this.defaultGroup,
    }
  },
  watch: {
    defaultGroup(val) {
      this.currentGroup = val
    }
  },
  computed: {
    selVal: {
      get() {
        return this.value
      },
      set(newV) {
        return newV
      },
    },
    listOptions() {
      if (this.groupBy) {
        return this.options.filter(
          item => item[this.groupBy] === this.currentGroup
        )
      }
      return this.options
    },
  },
  methods: {
    changeGroup(){
      this.$emit("input", '')
    },
    changeSelect(val) {
      this.$emit("input", val)
    },
  },
}
</script>
<style scoped>
.container {
  display: flex;
}
.group {
  width: 120px;
}
</style>
