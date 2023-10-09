<template>
  <div class="unlink">
    <div class="unlink__item" v-for="item in showList" :key="item.link">
      <div class="unlink__item__title">
        {{ item.appName }}
      </div>
      <div class="unlink__item__access" @click="$emit('on-access', item)">
        立即接入
      </div>
    </div>
    <div
      v-if="showList.length !== list.length"
      class="unlink__item unlink__item--more"
      @click="onMore"
    >
      查看更多应用
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      require: true,
    },
  },
  watch: {
    list(newVal) {
      this.showList = newVal.length > this.baseLength ? newVal.slice(0, this.baseLength) : newVal;
    },
  },
  data() {
    return {
      baseLength: 7,
      showList: this.list,
    };
  },
  methods: {
    onMore() {
      this.showList = this.list.slice(0, this.showList.length + this.baseLength + 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.unlink {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: -12px;
  margin-left: -12px;
  &__item {
    width: 178px;
    height: 72px;
    border: 1px solid #d9d7d7;
    margin: 0 5px 14px;
    display: flex;
    flex-direction: column;
    &--more {
      justify-content: center;
      align-items: center;
      color: #1890ff;
      font-size: 14px;
      cursor: pointer;
    }
    &__title {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: bold;
      line-height: 40px;
      margin: 0 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &__access {
      color: #1890ff;
      font-size: 14px;
      align-self: flex-end;
      margin-right: 12px;
      cursor: pointer;
    }
  }
}
</style>
