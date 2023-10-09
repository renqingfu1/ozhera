<template>
  <div>
    <div id="应用可用性详情" class="section-title">应用可用性详情</div>
    <AppList
      ref="应用可用性详情"
      :curDept="curDept"
      metricType="可用性指标"
      :metricOptions="availabilityMetricOptions"
      :selectedMetricOptions="selectedAvailabilityMetricOptions"
      defaultOrderBy="http_error_total"
      :selectedChanged="selectedChanged"
      :nameClicked="nameClicked"
    />
    <div id="应用报警详情" class="section-title">应用报警详情</div>
    <AppList
      ref="应用报警详情"
      :curDept="curDept"
      metricType="报警指标"
      :metricOptions="alertMetricOptions"
      :selectedMetricOptions="selectedAlertMetricOptions"
      defaultOrderBy="alert_total"
      :selectedChanged="selectedChanged"
      :nameClicked="nameClicked"
    />
  </div>
</template>

<script>
import SelectedMetricOptionsManager from "../common/SelectedMetricOptionsManager"
import AppList from "./AppList.vue"

export default {
  props: {
    curDept: {},
    availabilityMetricOptions: {},
    alertMetricOptions: {},
    nameClicked: {},
  },
  components: {
    AppList,
  },
  data() {
    return {
      selectedAvailabilityMetricOptions:
        SelectedMetricOptionsManager.loadSelectedAvailability(),
      selectedAlertMetricOptions:
        SelectedMetricOptionsManager.loadSelectedAlert(),
    }
  },
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
