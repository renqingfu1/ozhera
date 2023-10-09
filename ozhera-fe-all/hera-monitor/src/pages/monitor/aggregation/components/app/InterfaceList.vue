<script>
import CommonMetricList from "../common/CommonMetricList.vue"
import server from "@/api/service/aggregation"

export default {
  extends: CommonMetricList,
  data() {
    return {
      searchMeta: {
        paramName: "methodName",
        label: "方法名",
        valueKey: "function_name",
      },
      api: {
        fn: server.getAppTable,
        getExtraParams: () => ({
          appId: this.curApp.id,
          appName: this.curApp.name,
        }),
      },
    }
  },
  methods: {
    canSearch() {
      return !!this.curApp
    },
  },
}
</script>
