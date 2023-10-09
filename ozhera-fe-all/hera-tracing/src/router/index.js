import { createRouter, createWebHistory } from "vue-router";
import ApplicationLink from "../views/ApplicationLink.vue";
const TraceId = () => import("../views/TraceId.vue");
const Topology = () => import("../views/Topo/index.vue");

const routes = [
  {
    path: "/",
    name: "ApplicationLink",
    component: ApplicationLink,
  },
  {
    path: "/traceid",
    component: TraceId,
    name: "TraceId",
  },
  {
    path: "/traceid/:traceid",
    component: TraceId,
    name: "TraceIdChild",
  },
  {
    path: "/topology",
    component: Topology,
    name: "Topology",
  },
];

let baseUrl = window.__POWERED_BY_QIANKUN__
  ? `/${process.env.VUE_APP_PROJECT_NAME}/`
  : "/";
const router = createRouter({
  history: createWebHistory(baseUrl),
  routes,
});

export default router;
