<template>
  <div>
    <div id="接口可用性详情" class="section-title">接口可用性详情</div>
    <InterfaceList
      ref="接口可用性详情"
      :curDept="curDept"
      :curApp="curApp"
      metricType="可用性指标"
      :metricOptions="availabilityMetricOptions"
      :selectedMetricOptions="selectedAvailabilityMetricOptions"
      defaultOrderBy="http_error_total"
      :selectedChanged="selectedChanged"
    />
    <div id="接口报警详情" class="section-title">接口报警详情</div>
    <InterfaceList
      ref="接口报警详情"
      :curDept="curDept"
      :curApp="curApp"
      metricType="报警指标"
      :metricOptions="alertMetricOptions"
      :selectedMetricOptions="selectedAlertMetricOptions"
      defaultOrderBy="alert_total"
      :selectedChanged="selectedChanged"
    />
  </div>
</template>

<script>
import SelectedMetricOptionsManager from "../common/SelectedMetricOptionsManager"
import InterfaceList from "./InterfaceList.vue"

export default {
  props: {
    curDept: {},
    curApp: {},
    availabilityMetricOptions: {},
    alertMetricOptions: {},
  },
  components: {
    InterfaceList,
  },
  data() {
    return {
      selectedAvailabilityMetricOptions:
        SelectedMetricOptionsManager.loadSelectedAvailability(),
      selectedAlertMetricOptions:
        SelectedMetricOptionsManager.loadSelectedAlert(),
    }
  },
  mounted() {},
  methods: {
    selectedChanged(metricType, selections) {
      SelectedMetricOptionsManager.saveSelections(metricType, selections)
    },
    search(id, date) {
      this.$refs[id].search(date)
    },
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
