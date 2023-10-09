<template>
  <div class="select">
    <div class="select__top">
      <span class="select__title"> {{ title }}: </span>
      <el-select
        :value="value"
        @change="onChange"
        :placeholder="'请选择' + tip"
        size="small"
        filterable
      >
        <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <span class="select__tip"> {{ $t('fastAccess.noText') }}{{ tip }}? </span>
      <el-button class="select__create" type="text" size="medium" @click="onCreate">
        {{ $t('fastAccess.createImmediate') }}
      </el-button>
    </div>
    <div class="select__center">
      <i class="el-icon-warning" />
      {{ desc }}
    </div>
    <div class="select__bottom" :class="value ? 'select__bottom--visible' : ''">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'update:value',
  },
  props: {
    value: {
      type: Number,
      default: undefined,
    },
    title: {
      type: String,
      default: '',
    },
    tip: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default: () => [],
    },
    onSelect: {
      type: Function,
      default: () => {},
    },
    onCreate: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    onChange(val) {
      this.$emit('update:value', val);
      this.onSelect(val);
    },
  },
};
</script>
<style lang="scss" scoped>
.select {
  display: flex;
  flex-direction: column;
  margin-bottom: 28px;
  &__top {
    display: flex;
    align-items: center;
  }
  &__title {
    font-size: 16px;
    font-weight: 650;
    margin-right: 8px;
    width: 120px;
    text-align: right;
  }
  .el-select {
    width: 430px;
  }
  &__tip {
    margin-left: 16px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
  }
  &__create {
    margin-left: 8px;
  }
  &__center {
    max-width: 740px;
    margin-top: 24px;
    display: flex;
    align-items: center;
    padding: 5px 12px;
    background-color: #fefbe6;
    border: 1px solid rgba(255, 229, 143, 1);
    border-radius: 4px;
    font-size: 12px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.65);
    i {
      font-size: 16px;
      margin-right: 6px;
      margin-top: 2px;
      color: #efb700;
      align-self: flex-start;
    }
  }
  &__bottom {
    align-self: center;
    opacity: 0;
    transition: all 0.3s;
    height: 0;
    &--visible {
      opacity: 1;
      height: auto;
    }
  }
}
</style>
