<template lang="">
  <el-select v-model="app" :placeholder="$t('selApp')" filterable style="width:300px"
   @change="$emit('change')">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.projectId+'-'+item.projectName"
      :value="item.projectId+'|'+item.projectName+'|'+item.baseInfoId">
    </el-option>
  </el-select>
</template>
<script>
import { getAppList } from '@/common/server/list/common';

export default {
  props: {
    value: {},
  },
  computed: {
    app: {
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
      getAppList({
        viewType: 0,
        appName: '',
      }).then(({ data }) => {
        this.options = data.list || [];
      });
    },
  },
};
</script>
<style lang="">

</style>
