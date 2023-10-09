<template>
  <el-select
    v-model="storeId"
    filterable
    placeholder="请输入store名称"
    clearable
  >
    <el-option
      v-for="item in storeOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>
<script>
import { getStoreBySpaceApi } from '@/common/req/list/user/index';

export default {
  props: {
    value: {},
    spaceId: {},
  },
  data() {
    return {
      storeOptions: [],
      spaceIdProps: '',
    };
  },
  computed: {
    storeId: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  watch: {
    spaceId: {
      immediate: true,
      handler(val) {
        this.getOptions(val);
      },
    },
  },
  methods: {
    getOptions(spaceId) {
      getStoreBySpaceApi({ spaceId }).then(({ data }) => {
        this.storeOptions = data || [];
      });
    },
  },
};
</script>
