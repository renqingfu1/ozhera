<template lang="">
  <el-select v-model="val" filterable placeholder="请选择space">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.spaceName"
      :value="item.id">
    </el-option>
  </el-select>
</template>
<script>
import { getSpaceList } from '@/common/req/list/logConfig';

export default {
  data() {
    return {
      options: [],
    };
  },
  props: {
    value: {
      type: Number,
    },
  },
  computed: {
    val: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
        this.$emit('change', val);
      },
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      getSpaceList({
        page: 1,
        pageSize: 300,
      }).then(({ data }) => {
        this.options = data.list;
        this.$emit('changeOptions', data.list);
      });
    },
  },
};
</script>
<style lang="">

</style>
