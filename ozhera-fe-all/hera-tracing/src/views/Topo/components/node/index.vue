<template>
  <div>
    <div class="node" ref="nodeRef">
      <div class="header">
        <img class="icon" :src="Icon" alt="" />
      </div>
      <div class="content">
        <div class="content-name">{{ nodeData.name }}</div>
      </div>
    </div>
    <el-popover
      :visible="isHover"
      trigger="hover"
      ref="popoverRef"
      :virtual-ref="nodeRef"
      virtual-triggering
      :title="nodeData.name"
      width="300px"
    >
      <div class="info">
        <p>每分钟请求量：{{ nodeValue?.cpm }}</p>
        <p>延迟：{{ nodeValue?.latency }}</p>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import { inject, onMounted, ref, watch } from "vue";
import { useElementHover } from "@vueuse/core";
import Icon from "./icon.svg";
import { ElPopover } from "element-plus";
import moment from "moment";
import { getTopoNodeValue } from "@/api/topo";
const popoverRef = ref();
const nodeRef = ref();

const getNode = inject("getNode");
const nodeData = ref({});
const nodeValue = ref({});

const isHover = useElementHover(nodeRef);

watch(isHover, (val) => {
  if (val) {
    getNodeValue();
  }
});

const getNodeValue = async () => {
  const { service, dates } = nodeData.value.form;
  const { code, data } = await getTopoNodeValue({
    names: [nodeData.value.name],
    start: moment(dates[0]).valueOf(),
    end: moment(dates[1]).valueOf(),
    scope: service ? "service" : "app",
    metrics: ["cpm", "sla", "latency"],
  });
  if (code === 200) {
    const map = {
      cpm: "",
      sla: "",
      latency: "",
    };
    data?.map((item) => {
      const { name, values } = item;
      if (name === "cpm") {
        map.cpm = values[0] ? Math.floor(values[0].value) : "";
      }
      if (name === "sla") {
        map.sla = values[0] ? values[0].value * 100 : "";
      }
      if (name === "latency") {
        map.latency = values[0] ? Math.floor(values[0].value) : "";
      }
    });
    nodeValue.value = map;
  }
};

onMounted(() => {
  const node = getNode();
  nodeData.value = node.data;
  node.on("change:data", ({ current }) => {
    nodeData.value = current;
  });
});
</script>

<style scoped lang="scss">
.node {
  background-color: #1890ff;
  color: #fff;
  border-radius: 4px;
  padding: 10px 15px;
  height: 60px;
  cursor: pointer;
  width: 120px;
  .header {
    text-align: center;
    .icon {
      width: 20px;
      height: 20px;
    }
  }
  .content {
    font-size: 14px;
    font-weight: 600;

    &-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }
  }
}

.info {
  p {
    padding: 5px 0;
  }
}
</style>
