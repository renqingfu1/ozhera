<template>
  <el-select
    v-model="appType"
    placeholder="请选择应用类型"
    @change="changeVal"
    v-bind="$attrs"
    :size="size"
  >
    <el-option
      v-for="item in apptype_options"
      :key="item.value"
      :label="item.value===2?'部署系统':item.label"
      :value="item.value"
      :disabled="shouldDisableOption(item.value)"
    >
    </el-option>
  </el-select>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
    };
  },
  props: {
    value: {
      default() {
        return '';
      },
    },
    size: {
      type: String,
      default: 'mini',
    },
    logType: {
      required: true,
    },
  },
  computed: {
    ...mapState({
      apptype_options: (state) => state.moduleDic.apptype_options,
    }),
    appType: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  methods: {
    ...mapActions('moduleDic', ['GETALLOPTIONSAPI']),
    changeVal(val) {
      this.$emit('input', val);
      this.$emit('change', val);
    },
    shouldDisableOption(value) {
      // 禁用mife应用类型
      // Loki应用日志下禁用[0, 1, 4, 5]这些应用类型
      // matrix es日志下，禁用非matrix应用类型
      return value === 8
        || (this.logType === 6 && [0, 1, 4, 5].indexOf(value) > -1)
        || (this.logType === 7 && value !== 6)
        || ((this.logType !== 6 && this.logType !== 7) && [2, 3, 6].indexOf(value) > -1);
    },
  },
  mounted() {
    this.GETALLOPTIONSAPI(['1004']);
  },
};
</script>
