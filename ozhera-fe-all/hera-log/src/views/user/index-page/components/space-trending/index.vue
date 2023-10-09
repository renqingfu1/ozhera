<template>
  <div class="trending" v-loading="loading">
    <div class="trending__header">
      <SelectSpace
        v-model="spaceId"
        @changeOptions="changeSpaceOptions"
        @change="changeSpace"
      />
    </div>
    <div class="trending__body">
      <VChart v-if="trendingList.length > 0" :option="options" :autoresize="true"/>
      <div v-else class="trending__body__text">
        {{ $t('noData') }}
      </div>
    </div>
  </div>
</template>
<script>
import {
  getSpaceTrend,
} from '@/common/req/list/user/index';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import SelectSpace from '@/components/SelectSpace.vue';

use([CanvasRenderer, LineChart, GridComponent]);

export default {
  components: {
    VChart,
    SelectSpace,
  },
  data() {
    return {
      loading: false,
      trendingList: [],
      spaceId: null,
    };
  },
  computed: {
    options() {
      const [xAxis, series] = this.trendingList.reduce(
        (arr, item) => {
          arr[0].push(item.day);
          arr[1].push(item.number);
          return arr;
        },
        [[], []],
      );
      const ret = {
        grid: {
          show: false,
          borderColor: 'red',
          width: '90%',
          rigth: '0',
          height: '290px',
          top: 30,
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          data: xAxis,
        },
        yAxis: {
          axisLabel: {
            formatter(val) {
              function formate(number, base, desc) {
                return (number / base).toFixed(2) + desc;
              }
              if (val >= 10000 * 100 * 100) {
                return formate(val, 10000 * 100 * 100, '亿');
              }
              if (val >= 10000 * 100) {
                return formate(val, 10000 * 100, '百万');
              }
              if (val >= 10000) {
                return formate(val, 10000, '万');
              }
              return val;
            },
          },
          splitLine: {
            lineStyle: {
              type: [5, 5],
            },
          },
        },
        series: {
          type: 'line',
          data: series,
          showSymbol: false,
          itemStyle: {
            color: '#6fd35a',
          },
        },
      };

      return ret;
    },
  },
  methods: {
    changeSpace(spaceId) {
      getSpaceTrend({ spaceId }).then(({ code, data }) => {
        if (code !== 0) {
          return;
        }
        this.trendingList = data ?? [];
      });
      return 1;
    },
    changeSpaceOptions(options) {
      if (options.length > 0) {
        this.spaceId = options[0]?.id;
        this.changeSpace(this.spaceId);
      }
    },
  },

};
</script>
<style lang="scss" scoped>
.trending {
  display: flex;
  flex-direction: column;
  &__header {
    display: flex;
    align-items: center;
    &__title {
      font-weight: bold;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      flex: 1;
    }
    &__select {
      width: 340px;
      ::v-deep > div.el-input {
        width: 100%;
      }
    }
  }
  &__body {
    height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
    &__text {
      font-size: 14px;
      color: #5e5e5e;
    }
  }
}
</style>
