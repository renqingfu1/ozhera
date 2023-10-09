<template>
  <div v-loading="loading" class="detail">
    <div v-if="!loading">
      <div v-if="data.code === 200">
        <div v-if="data.type === 'node'">
          <el-descriptions size="large">
            <el-descriptions-item label="服务名:">
              <a
                class="link"
                v-if="showLink().show"
                :href="showLink().url"
                target="_blank"
                >{{ data.node?.name }}</a
              >
              <span v-else>
                {{ data.node?.name }}
              </span>
            </el-descriptions-item>
          </el-descriptions>
          <LineChart
            title="QPS"
            :showYaxisTitle="false"
            :data="data.data.serviceThroughput"
            :interval-time="data.intervalTimes"
          />
          <LineChart
            title="调入可用性"
            unit="%"
            :showYaxisTitle="false"
            :data="data.data.serviceSLA"
            :interval-time="data.intervalTimes"
          />
          <LineChart
            title="响应时长"
            unit="ms"
            :showYaxisTitle="false"
            :data="data.data.serviceResponseTime"
            :interval-time="data.intervalTimes"
          />
          <LineChart
            v-if="shouldShowPercent"
            title="响应时长分位值"
            :isPercentChart="true"
            :showYaxisTitle="false"
            :data="data.data.servicePercentile"
            :interval-time="data.intervalTimes"
          />
        </div>
        <div v-else>
          <el-descriptions size="large">
            <el-descriptions-item label="调用关系:">
              {{ getCallName(data.node?.name) }}
            </el-descriptions-item>
          </el-descriptions>
          <LineChart
            title="调用QPS"
            :showYaxisTitle="false"
            :data="data.data.serviceThroughput"
            :interval-time="data.intervalTimes"
          />
          <LineChart
            title="调用可用性"
            unit="%"
            :showYaxisTitle="false"
            :data="data.data.serviceSLA"
            :interval-time="data.intervalTimes"
          />
          <LineChart
            title="调用耗时"
            unit="ms"
            :showYaxisTitle="false"
            :data="data.data.serviceResponseTime"
            :interval-time="data.intervalTimes"
          />
          <LineChart
            title="调用耗时分位值"
            :isPercentChart="true"
            :showYaxisTitle="false"
            v-if="shouldShowPercent"
            :data="data.data.servicePercentile"
            :interval-time="data.intervalTimes"
          />
        </div>
      </div>
      <el-empty style="margin-top: 180px" description="暂无数据" v-else />
    </div>
  </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import LineChart from "../lineChart/index.vue";
const props = defineProps({
  data: Object,
  loading: Boolean,
  form: Object,
});
const { data, loading, form } = toRefs(props);

const getCallName = (name) => {
  if (name) {
    return name.replace("#", " → ");
  }
};

const showLink = () => {
  const { service } = form.value || {};
  const { node } = data.value;
  if (!service) {
    // app级别
    const reg = /^\d+_.*/;
    if (reg.test(node.name)) {
      const [appId] = node.name.split("_");
      const appName = node.name.replace(new RegExp(`^${appId}_`), "");
      return {
        show: true,
        url: `/project-target-monitor/application/dash-board?id=${appId}&name=${appName}&activeTab=dashboard`,
      };
    } else {
      return {
        show: false,
        url: "",
      };
    }
  } else {
    // service级别
    if (node.extra) {
      const extra = JSON.parse(node.extra);
      const { appId, appName } = extra;
      return {
        show: true,
        url: `/project-target-monitor/application/dash-board?id=${appId}&name=${appName}&activeTab=dashboard&heraService=${node.name}`,
      };
    } else {
      return {
        show: false,
        url: "",
      };
    }
  }
};

const shouldShowPercent = computed(() => {
  const servicePercentile = data.value?.data?.servicePercentile;
  let show = false;
  if (servicePercentile) {
    show = Object.keys(servicePercentile).some(
      (k) => servicePercentile[k] && servicePercentile[k].length
    );
  }
  return show;
});
</script>

<style lang="scss" scoped>
.detail {
  height: 100%;
  overflow: auto;
  .node-name {
    font-size: 16px;
  }
  .link {
    color: #1890ff;
  }
}
</style>
