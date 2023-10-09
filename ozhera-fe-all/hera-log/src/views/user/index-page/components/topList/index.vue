<template>
  <div class="top" v-loading="loading">
    <div class="top__item"
      v-for="(item, index) in list"
      :key="item.tail"
      :class="'top__item-'+index">
      <ItemBox :index="index"/>
      <div class="top__item__name">
        {{item.tail}}
      </div>
      <div class="top__item__number">
        {{item.number}}
      </div>
    </div>
    <div v-if="!hasData" class="top__no-data">{{ $t('noData') }}</div>
  </div>
</template>
<script>
import { getLogtailTopN } from '@/common/req/list/user/index';
import ItemBox from './ItemBox.vue';
import './common.css';

export default {
  components: {
    ItemBox,
  },
  data() {
    return {
      loading: false,
      list: [],
      hasData: true,
    };
  },
  mounted() {
    this.loading = true;
    getLogtailTopN()
      .then(({ code, data }) => {
        if (code !== 0) {
          return;
        }
        this.list = data ?? [];
        this.hasData = this.list.length > 0;
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>
