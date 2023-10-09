<template>
  <div class="change-tail">
    <el-tag v-for="(item,index) in tails" :key="item.tail"
    class="tail-tag"
    size="small"
    closable
    @close="(item)=>{
      closeTail(item,index)
    }">{{item.tail}}</el-tag>
    <el-select
      v-model="addTailItem"
      filterable
      :placeholder="$t('logQuery.selAppAlias')"
      clearable
      width="300px"
      value-key="id"
      @change="addTail"
      size="mini"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.tail"
        :value="item"
        :disabled="item.disabled"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    tailsOptions: {
      type: Array,
    },
    value: {
      type: Array,
    },
  },
  computed: {
    tails: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    options() {
      return this.tailsOptions.map((item) => {
        const hasSelect = this.tails.find((tailsItem) => tailsItem.tail === item.tail);
        return {
          ...item,
          disabled: !!hasSelect,
        };
      });
    },
  },
  data() {
    return {
      showpop: false,
      addTailItem: '',
    };
  },
  methods: {
    addTail(tail) {
      if (!this.tails.find((item) => item.tail === tail.tail)) {
        this.tails.push(tail);
      }
      this.addTailItem = '';
    },
    closeTail(item, index) {
      this.tails.splice(index, 1);
    },
  },
};
</script>
<style lang="scss">
.tail-tag{
  margin-right:3px;
}
.change-tail{
  line-height: 28px;
}
</style>
