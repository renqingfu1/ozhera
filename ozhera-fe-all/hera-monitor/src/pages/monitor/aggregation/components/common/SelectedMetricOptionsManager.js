const LS_PREFIX = "hera-aggregation-selected-"
const loadSelected = metricType => {
  const value = localStorage.getItem(LS_PREFIX + metricType)
  if (value) {
    return JSON.parse(value)
  }
  return defaultSelectedMetricOptions[metricType]
}

const listeners = {}
const saveSelections = (metricType, selections) => {
  localStorage.setItem(LS_PREFIX + metricType, JSON.stringify(selections))
  listeners[metricType]?.forEach(l => l(metricType, selections))
}

const addListener = (metricType, l) => {
  if (listeners[metricType]) {
    listeners[metricType].push(l)
  } else {
    listeners[metricType] = [l]
  }
}
const removeListener = (metricType, l) => {
  if (listeners[metricType]) {
    var index = listeners[metricType].indexOf(l)
    if (index > -1) {
      listeners[metricType].splice(index, 1)
    }
  }
}

const metricTypeAvailability = "可用性指标"
const metricTypeAlert = "报警指标"
const defaultSelectedMetricOptions = {
  [metricTypeAvailability]: [
    "http_error_total",
    "dubbo_provider_error_total",
    "http_total",
    "dubbo_provider_total",
    "http_availability",
    "dubbo_provider_availability",
  ],
  [metricTypeAlert]: ["alert_total", "alert_avg_last_time"],
}

export default {
  metricTypeAvailability,
  metricTypeAlert,
  loadSelected,
  loadSelectedAvailability: () => loadSelected(metricTypeAvailability),
  loadSelectedAlert: () => loadSelected(metricTypeAlert),
  saveSelections,
  addListener,
  removeListener,
}
