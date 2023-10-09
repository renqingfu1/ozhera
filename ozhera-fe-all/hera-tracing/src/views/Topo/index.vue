<template>
  <div class="topo">
    <SearchHeader ref="headerRef" @submit="onSubmit" />
    <div class="content">
      <el-card
        v-loading="loading"
        header="拓扑图"
        style="height: 100%; display: flex; flex-direction: column"
        :body-style="{ padding: '0', flex: 1 }"
      >
        <div class="main">
          <el-empty
            style="margin-top: 180px"
            description="暂无数据"
            v-if="chartData.edges.length === 0"
          />
          <Topochart
            @onBlankClick="onBlankClick"
            @onNodeClick="onNodeClick"
            @onEdgeClick="onEdgeClick"
            :values="chartData"
            :form="headerRef?.form"
            v-else
          />
        </div>
      </el-card>
      <el-drawer
        title="时序数据"
        size="50%"
        v-model="serviceShow"
        modal-class="metrics-modal"
      >
        <ServiceDetail
          :data="serviceModalData"
          :loading="detailLoading"
          :form="headerRef?.form"
        />
      </el-drawer>
    </div>
  </div>
</template>

<script setup>
import SearchHeader from "./components/header/index.vue";
import Topochart from "./components/topoChart/index.vue";
import ServiceDetail from "./components/serviceDetail/index.vue";
import {
  getTopoGraph,
  getTopoCallValue,
  getTopoNodeValues,
  getTopoCallValues,
} from "@/api/topo";
import moment from "moment";
import { ref } from "vue";

const formatNodeValues = (data) => {
  const { apdex_score, qps, sla, latency } = data;
  const p50 = data["percentile_0.5"];
  const p75 = data["percentile_0.75"];
  const p90 = data["percentile_0.9"];
  const p95 = data["percentile_0.95"];
  const p99 = data["percentile_0.99"];
  const result = {
    serviceApdexScore: apdex_score
      ? apdex_score.values.map((v) => Number(v.toFixed(2)))
      : [],
    serviceResponseTime: latency ? latency.values.map((v) => v) : [],
    serviceThroughput: qps ? qps.values.map((v) => v) : [],
    serviceSLA: sla ? sla.values.map((v) => v * 100) : [],
    servicePercentile: {
      p50: p50 ? p50.values : [],
      p75: p75 ? p75.values : [],
      p90: p90 ? p90.values : [],
      p95: p95 ? p95.values : [],
      p99: p99 ? p99.values : [],
    },
  };
  return result;
};

const formatIntervalTimes = (times) => {
  const { start, end } = times;
  const interval = 60000;
  const startUnix = start.getTime();
  const endUnix = end.getTime();
  const timeIntervals = [];
  for (let index = 0; index <= endUnix - startUnix; index += interval) {
    timeIntervals.push(
      moment(new Date(startUnix + index)).format("MM-DD HH:mm")
    );
  }
  return timeIntervals;
};
const serviceShow = ref(false);
const serviceModalData = ref({
  node: "",
  data: {},
  intervalTimes: [],
  type: "node",
});
const detailLoading = ref(false);

const headerRef = ref(null);
const chartData = ref({
  edges: [],
  nodes: [],
});
const loading = ref(false);

const onSubmit = async (values) => {
  try {
    loading.value = true;
    const { service, dates, app, depth } = values;
    const { code, data } = await getTopoGraph({
      names: service ? [service] : [app],
      start: moment(dates[0]).valueOf(),
      end: moment(dates[1]).valueOf(),
      scope: service ? "service" : "app",
      depth,
    });
    if (code === 200) {
      if (data.calls.length === 0) {
        loading.value = false;
        chartData.value = {
          edges: [],
          nodes: [],
        };
        return;
      }

      const names = data.calls.map((c) => c.name);
      const nodes = data.nodes;
      const calls = data.calls;
      const { code: resCode, data: resData } = await getTopoCallValue({
        names,
        start: moment(dates[0]).valueOf(),
        end: moment(dates[1]).valueOf(),
        scope: service ? "service" : "app",
        metrics: ["cpm", "sla", "latency"],
      });
      if (resCode === 200) {
        const cpm = resData.find((r) => r.name === "cpm");
        const sla = resData.find((r) => r.name === "sla");
        const latency = resData.find((r) => r.name === "latency");
        for (let i = 0; i < sla.values.length; i += 1) {
          for (let j = 0; j < nodes.length; j += 1) {
            if (nodes[j].id === sla.values[i].id) {
              nodes[j] = {
                ...nodes[j],
                isGroupActive: true,
                sla: sla.values[i].value ? sla.values[i].value * 100 : -1,
                cpm: cpm.values[i] ? Math.floor(cpm.values[i].value) : -1,
                latency: latency.values[i]
                  ? Math.floor(latency.values[i].value)
                  : -1,
              };
            }
          }
        }

        for (let m = 0; m < cpm.values.length; m += 1) {
          for (let n = 0; n < calls.length; n += 1) {
            if (calls[n].id === cpm.values[m].id) {
              calls[n] = {
                ...calls[n],
                cpm: cpm.values[m] ? Math.floor(cpm.values[m].value) : "",
                latency: latency.values[m]
                  ? Math.floor(latency.values[m].value)
                  : "",
              };
            }
          }
        }

        for (let k = 0; k < sla.values.length; k += 1) {
          for (let l = 0; l < calls.length; l += 1) {
            if (calls[l].id === sla.values[k].id) {
              calls[l] = {
                ...calls[l],
                sla: sla.values[k] ? sla.values[k].value * 100 : "0",
              };
            }
          }
        }
        chartData.value = {
          edges: calls,
          nodes,
        };
      }
      loading.value = false;
    } else {
      loading.value = false;
    }
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
};

const onEdgeClick = async (data) => {
  try {
    detailLoading.value = true;
    serviceShow.value = true;
    const { name } = data;
    const { dates, service } = headerRef.value.form;
    const { code, data: res } = await getTopoCallValues({
      names: [name],
      start: moment(dates[0]).valueOf(),
      end: moment(dates[1]).valueOf(),
      metrics: ["qps", "sla", "latency", "percentile"],
      scope: service ? "service" : "app",
    });
    if (code === 200) {
      const resMap = {};
      res.map((item) => {
        resMap[item.name] = {
          values: item.values,
        };
      });

      const result = formatNodeValues(resMap);
      const times = {
        start: moment(dates[0]).toDate(),
        end: moment(dates[1]).toDate(),
      };
      const intervalTimes = formatIntervalTimes(times);
      serviceModalData.value = {
        node: data,
        intervalTimes,
        data: result,
        type: "edge",
        code,
      };
    } else {
      serviceModalData.value = {
        code,
      };
    }
    detailLoading.value = false;
  } catch (error) {
    console.error(error);
    detailLoading.value = false;
  }
};

const onNodeClick = async (data) => {
  try {
    detailLoading.value = true;
    serviceShow.value = true;
    const { name } = data;
    const { dates, service } = headerRef.value.form;
    const { code, data: res } = await getTopoNodeValues({
      names: [name],
      start: moment(dates[0]).valueOf(),
      end: moment(dates[1]).valueOf(),
      metrics: ["qps", "sla", "latency", "apdex_score", "percentile"],
      scope: service ? "service" : "app",
    });
    if (code === 200) {
      const resMap = {};
      res.map((item) => {
        resMap[item.name] = {
          values: item.values,
        };
      });

      const result = formatNodeValues(resMap);
      const times = {
        start: moment(dates[0]).toDate(),
        end: moment(dates[1]).toDate(),
      };
      const intervalTimes = formatIntervalTimes(times);
      serviceModalData.value = {
        node: data,
        intervalTimes,
        data: result,
        type: "node",
        code,
      };
    } else {
      serviceModalData.value = {
        code,
      };
    }
    detailLoading.value = false;
  } catch (error) {
    console.error(error);
    detailLoading.value = false;
  }
};

const onBlankClick = () => {
  serviceShow.value = false;
};
</script>

<style scoped lang="scss">
.topo {
  display: flex;
  height: 100%;
  flex-direction: column;
  .content {
    flex: 1;
    padding: 20px;
  }

  .main {
    position: relative;
    height: 100%;
  }
  .fixed-right {
    position: fixed;
    right: 20px;
    top: 20px;
  }
}
</style>

<style lang="scss">
.metrics-modal {
  .el-drawer__header {
    margin-bottom: 0 !important;
  }
  .el-drawer__body {
    min-height: 0 !important;
  }
}
</style>
