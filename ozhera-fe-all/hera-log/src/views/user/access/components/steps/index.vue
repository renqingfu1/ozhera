<template>
  <div class="steps">
    <div v-for="(item, index) in list" :key="index" class="steps__item">
      <div
        v-if="index >= step"
        class="steps__item__icon"
        :class="index === step ? 'steps__item__icon--active' : ''"
      >
        {{ index + 1 }}
      </div>
      <div v-else class="steps__item__done">
        <i class="el-icon-check"></i>
      </div>
      <div class="steps__item__title" :class="index === step ? 'steps__item__title--active' : ''">
        {{ item }}
      </div>
      <svg
        class="steps__item__line"
        v-if="index !== list.length - 1"
        version="1.1"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="251px"
        height="2px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="matrix(1 0 0 1 -531 -187 )">
          <path d="M 531 187.5  L 781 187.5  " stroke-width="1" stroke="#e8e8e8" fill="none" />
        </g>
      </svg>
    </div>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'step',
  },
  props: {
    step: {
      type: Number,
      default: 0,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
<style lang="scss" scoped>
.steps {
  display: flex;
  min-width: 900px;
  margin: 10px 0 30px;
  &__item {
    display: flex;
    align-items: center;
    &__icon {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.25);
      height: 32px;
      width: 32px;
      border-radius: 50%;
      border: 1px solid #dfdede;
      &--active {
        background-color: #3590ff;
        border-color: transparent;
        color: white;
      }
    }
    &__done {
      height: 32px;
      width: 32px;
      border: 1px solid #3590ff;
      border-radius: 50%;
      color: #3590ff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
    }
    &__title {
      margin-left: 8px;
      font-size: 16px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      &--active {
        font-weight: bold;
        color: rgba(0, 0, 0, 0.85);
      }
    }
    &__line {
      margin: 0 16px;
    }
  }
}
</style>
