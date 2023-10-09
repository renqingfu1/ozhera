<template>
  <el-select v-model="val" placeholder="请选择space" filterable>
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :disabled="item.value == $route.query.spaceId"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import { getAllSpace } from '@/common/req/list/user/index';

export default {
  props: {
    value: {},
  },
  computed: {
    val: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  data() {
    return {
      options: [],
    };
  },
  mounted() {
    this.getOptions();
  },
  methods: {
    getOptions() {
      getAllSpace().then(({ data }) => {
        this.options = data || [];
      });
    },
  },
};
</script>
