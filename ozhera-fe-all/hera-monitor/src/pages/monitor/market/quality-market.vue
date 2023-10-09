<template>
  <div class="unusual-box">
    <lone-module class="title">
      <span class="title-text">质量大盘列表</span>
      <el-popover trigger="hover" placement="bottom">
        可汇总多个应用服务，以项目的维度进行监控
        <em slot="reference" class="el-icon-warning-outline" style="margin: 0 8px; color: #666; cursor: pointer"></em>
      </el-popover>
    </lone-module>
    <el-alert
        :title="$t('marketList.qualityTips')"
        type="warning"
        show-icon>
    </el-alert>
    <MarketList :title="$t('qualityMarket')" serverType="quality" />
  </div>
</template>
<script>
import MarketList from './components';

export default {
  name: 'Market',
  components: {
    MarketList
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {

  }
}
</script>
<style scoped>
.title {
  color: #000;
}
.title-text {
  margin-left: 8px;
}
.unusual-box {
  height: 100%;
  color: rgba(0, 0, 0, 0.85);
}
</style>
