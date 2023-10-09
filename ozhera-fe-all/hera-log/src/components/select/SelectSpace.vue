<template>
  <el-select
    v-model="spaceId"
    filterable
    placeholder="请输入space名称"
    @change="changeSpace"
    v-bind="$attrs"
  >
    <el-option
      v-for="item in spaceOptions"
      :key="item.id"
      :label="item.spaceName"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>
<script>
import { getSpaceList } from '@/common/req/list/logConfig';

export default {
  props: {
    value: {},
  },
  data() {
    return {
      spaceOptions: [],
      params: {
        page: 1,
        pageSize: 1000,
        spaceName: '',
      },
    };
  },
  computed: {
    spaceId: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  mounted() {
    this.getInitData();
  },
  methods: {
    getInitData() {
      this.getOptions(this.params);
    },
    getOptions(params) {
      getSpaceList(params).then(({ data }) => {
        this.spaceOptions = data.list;
      });
    },
    remoteMethod(query) {
      const params = { ...this.params, ...{ spaceName: query } };
      this.getOptions(params);
    },
    changeSpace(val) {
      this.$emit('change', val);
    },
  },
};
</script>
