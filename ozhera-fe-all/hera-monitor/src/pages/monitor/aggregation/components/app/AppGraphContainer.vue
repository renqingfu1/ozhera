<template>
  <div>
    <div class="section-title">应用可用性详情</div>
    <AppGraph
      :curDept="curDept"
      :curApp="curApp"
      metricType="可用性指标"
      :metricOptions="availabilityMetricOptions"
      defaultMetricName="server_availability"
      :pointClicked="pointClicked"
    />
    <div class="section-title">应用报警详情</div>
    <AppGraph
      :curDept="curDept"
      :curApp="curApp"
      metricType="报警指标"
      :metricOptions="alertMetricOptions"
      defaultMetricName="alert_total"
      :pointClicked="pointClicked"
    />
  </div>
</template>

<script>
import AppGraph from "./AppGraph.vue"
export default {
  props: {
    curDept: {},
    curApp: {},
    availabilityMetricOptions: {},
    alertMetricOptions: {},
    pointClicked: {},
  },
  components: {
    AppGraph,
  },
  data() {
    return {}
  },
  methods: {
  },
}
</script>

<style lang="less" scoped>
.section-title {
  font-size: large;
  font-weight: bold;
  margin: 30px 0 10px 0;
}
</style>
