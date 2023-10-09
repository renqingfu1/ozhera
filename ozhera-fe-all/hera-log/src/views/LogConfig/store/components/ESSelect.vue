<template lang="">
  <el-select v-model="mq" placeholder="请选择">
    <el-option
      v-for="item in esResourceList"
      :key="item.key"
      :label="item.value"
      :value="item.key">
    </el-option>
  </el-select>
</template>
<script>
import { mapState } from 'vuex';

export default {
  props: {
    value: {},
  },
  computed: {
    ...mapState({
      esResourceList: (state) => state.moduleCreateStoreResource.esResourceList,
    }),
    mq: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>
<style lang="">

</style>
