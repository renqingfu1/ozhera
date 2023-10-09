<template>
  <el-select v-model="sel" placeholder="请选择索引" class="sel-keys">
    <el-option
      v-for="item in options"
      :key="item.key"
      :label="item.label"
      :value="item.key">
    </el-option>
  </el-select>
</template>
<script>
import getManualKeys from '@/common/req/list/create-store';

export default {
  data() {
    return {
      options: [],
      regionCodePro: null,
      logTypeCodePro: null,
      resData: [],
    };
  },
  props: {
    value: {},
    regionCode: {
      required: true,
    },
    logTypeCode: {
      required: true,
    },
  },
  computed: {
    sel: {
      get() {
        return this.value;
      },
      set(val) {
        console.log('val', val);
        this.$emit('input', val);
      },
    },
    reqParams() {
      return {
        regionCode: this.regionCode,
        logTypeCode: this.logTypeCode,
      };
    },
  },
  watch: {
    reqParams: {
      handler(val, oldV) {
        if (val === oldV) return;
        this.getOptions();
      },
    },
  },
  mounted() {
    this.getOptions();
  },
  methods: {
    async getOptions() {
      if (!this.reqParams.regionCode || !this.reqParams.logTypeCode) return;
      const { data } = await getManualKeys(this.reqParams);
      this.resData = data;
      this.options = this.transformRes(this.resData);
    },
    transformRes(data) {
      const arr = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.children?.length > 0) {
          const child = item.children;
          // eslint-disable-next-line no-plusplus
          for (let j = 0; j < child.length; j++) {
            const childItem = child[j];
            childItem.key = `${item.key}~${childItem.label}`;
            arr.push(childItem);
          }
        }
      }
      console.log('arr', arr);
      return arr;
    },
  },
};
</script>
<style lang="scss" scoped>
.sel-keys{
  ::v-deep .el-input{
    width: 375px;
  }
}
</style>
