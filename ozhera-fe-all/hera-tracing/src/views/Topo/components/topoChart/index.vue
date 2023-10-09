<template>
  <div class="chart">
    <div id="g6"></div>
    <div class="toolbar">
      <el-space>
        <el-tooltip content="上下布局" placement="top">
          <el-button
            size="small"
            @click="() => onLayout(1)"
            :icon="ArrowUp"
            circle
          ></el-button>
        </el-tooltip>
        <el-tooltip content="左右布局" placement="top">
          <el-button
            size="small"
            @click="() => onLayout(2)"
            :icon="ArrowLeft"
            circle
          ></el-button>
        </el-tooltip>
        <el-tooltip content="同心圆布局" placement="top">
          <el-button
            size="small"
            @click="() => onLayout(3)"
            :icon="Help"
            circle
          ></el-button>
        </el-tooltip>
        <el-tooltip content="放大" placement="top">
          <el-button
            size="small"
            @click="() => onZoom(0.2)"
            :icon="Plus"
            circle
          ></el-button>
        </el-tooltip>
        <el-tooltip content="缩小" placement="top">
          <el-button
            size="small"
            @click="() => onZoom(-0.2)"
            :icon="Minus"
            circle
          ></el-button>
        </el-tooltip>
      </el-space>
    </div>
  </div>
</template>

<script setup>
import {
  onMounted,
  createApp,
  defineProps,
  defineEmits,
  watch,
  ref,
} from "vue";
import { Graph, Markup } from "@antv/x6";
import { DagreLayout, ConcentricLayout } from "@antv/layout";
import "@antv/x6-vue-shape";
import Node from "../node/index.vue";
import Label from "../label/index.vue";
import { ArrowLeft, ArrowUp, Help, Plus, Minus } from "@element-plus/icons-vue";

const emit = defineEmits(["onNodeClick", "onBlankClick", "onEdgeClick"]);

const propData = defineProps({
  values: Object,
  form: Object,
});

const layoutType = ref(1);

watch(
  () => propData.values,
  () => {
    renderChart();
  }
);

let graph = null;

const onZoom = (num) => {
  if (graph) {
    graph.zoom(num);
  }
};

onMounted(() => {
  Graph.registerVueComponent(
    "VueNode",
    {
      template: `<Node />`,
      components: {
        Node,
      },
    },
    true
  );
  renderChart();
});
const formatData = (result) => {
  if (!result) {
    return {
      edges: [],
      node: [],
    };
  }
  const { nodes, edges } = result;
  return {
    edges: edges.map((edge) => {
      return {
        ...edge,
        data: edge,
        connector: { name: "rounded" },
        defaultLabel: {
          markup: Markup.getForeignObjectMarkup(),
          attrs: {
            fo: {
              width: 60,
              height: 24,
              x: -25,
              y: -12,
            },
          },
        },
        label: {
          position: 0.5,
        },
        attrs: {
          line: {
            stroke: Number(edge.sla) < 99.9 ? "#ff4d4f" : "#A2B1C3",
            // strokeDasharray: 6,
            targetMarker: "classic",
            // style: {
            //   animation: "ant-line 30s infinite linear",
            // },
          },
        },
      };
    }),
    nodes: nodes.map((node) => {
      return {
        ...node,
        shape: "vue-shape",
        component: "VueNode",
        label: node.name,
        data: {
          ...node,
          form: propData.form,
        },
        width: 120,
        height: 60,
      };
    }),
  };
};

const onLayout = (type) => {
  layoutType.value = type;
  renderChart();
};
const renderChart = () => {
  const values = formatData(propData.values);
  const container = document.getElementById("g6");
  if (!container) return;
  if (graph) {
    graph.dispose();
  }

  graph = new Graph({
    container,
    grid: true,
    autoResize: true,
    panning: true,
    mousewheel: {
      enabled: true,
    },
    selecting: {
      enabled: true,
      rubberband: false,
    },
    connecting: {
      highlight: true,
      allowBlank: true,
    },
    onEdgeLabelRendered: (args) => {
      const { selectors, edge } = args;
      const eleContent = selectors.foContent;

      eleContent.style.display = "flex";
      eleContent.style.alignItems = "center";
      if (eleContent) {
        createApp(Label, {
          value: edge.data,
        }).mount(eleContent);
      }
    },
  });
  let chartLayout;
  if (layoutType.value === 1) {
    chartLayout = new DagreLayout({
      type: "dagre",
      rankdir: "TB",
      ranksep: 80,
      nodesep: 60,
    });
  } else if (layoutType.value === 2) {
    chartLayout = new DagreLayout({
      type: "dagre",
      rankdir: "LR",
      align: "DL",
      ranksepFunc: (d) => {
        const { nodes } = values;
        const { id } = d;
        const order = nodes.findIndex((e) => e.id === id);
        if (order % 2 === 0) {
          return 120;
        } else {
          return 240;
        }
      },
      // nodesepFunc: (d) => {
      //   const { nodes } = values;
      //   const { id } = d;
      //   const order = nodes.findIndex((e) => e.id === id);
      //   if (order % 2 === 0) {
      //     return 50;
      //   } else {
      //     return 120;
      //   }
      // },
    });
  } else {
    chartLayout = new ConcentricLayout({
      type: "concentric",
      linkDistance: 200,
      preventOverlap: true,
      nodeSize: 140,
    });
  }
  const model = chartLayout.layout(values);
  graph.fromJSON(model);
  graph.centerContent();
  graph.on("node:mouseenter", ({ node }) => {
    node.addTools({
      name: "boundary",
      args: {
        attrs: {
          fill: "#7c68fc",
          stroke: "#9254de",
          strokeWidth: 1,
          fillOpacity: 0.1,
          rc: 4,
          ry: 4,
        },
      },
    });
  });
  graph.on("node:mouseleave", ({ node }) => {
    node.removeTools();
  });
  graph.on("node:click", (e) => {
    const { node } = e;
    emit("onNodeClick", node.data);
  });
  graph.on("edge:click", (e) => {
    const { edge } = e;
    emit("onEdgeClick", edge.data);
  });

  graph.on("blank:click", () => {
    emit("onBlankClick");
  });
};
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  :deep(body) {
    min-width: initial;
  }

  #g6 {
    width: 100% !important;
    height: 100% !important;
    flex: 1;
  }

  .toolbar {
    top: 10px;
    left: 10px;
    z-index: 100;
    position: absolute;
  }
}
</style>
