<template>
  <div>
    <div class="section-title">部门可用性详情</div>
    <DepartmentGraph
      :curDept="curDept"
      metricType="可用性指标"
      :metricOptions="availabilityMetricOptions"
      defaultMetricName="server_availability"
      :pointClicked="pointClicked"
    />
    <div class="section-title">部门报警详情</div>
    <DepartmentGraph
      :curDept="curDept"
      metricType="报警指标"
      :metricOptions="alertMetricOptions"
      defaultMetricName="alert_total"
      :pointClicked="pointClicked"
    />
  </div>
</template>

<script>
import DepartmentGraph from "./DepartmentGraph.vue"

export default {
  props: {
    curDept: {},
    availabilityMetricOptions: {},
    alertMetricOptions: {},
    pointClicked: {},
  },
  components: {
    DepartmentGraph,
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
