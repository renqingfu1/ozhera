import home from "./modules/home"
import application from "./modules/application"
import aggregation from "./modules/aggregation"
import authority from "@/pages/monitor/authority/inedex"
import layout from "@/layout"
import Application from "@/pages/monitor/application"
import APPHealth from "@/pages/monitor/app-health/index" // 应用健康
import DilatationRecord from "@/pages/monitor/dilatation-record/index" // 扩容记录
import AppProgressAlarmStrategy from "@/pages/monitor/app-progress-alarm-strategy/index" // 应用进程报警策略
import AppProgressConfig from "@/pages/monitor/app-progress-alarm-strategy/config-list/index.vue"

const routes = [
  {
    path: "/",
    component: layout,
    children: [
      home,
      ...application,
      {
        path: "/app-health",
        name: "APPHealth",
        component: APPHealth,
      },
      {
        path: "/dilatation-record",
        name: "DilatationRecord",
        component: DilatationRecord,
      },
      {
        path: "/app-progress-alarm-strategy",
        name: "AppProgressAlarmStrategy",
        component: AppProgressAlarmStrategy,
      },
      {
        path: "/app-progress-alarm-strategy/:projectId/:projectName",
        name: "AppProgressConfig",
        component: AppProgressConfig,
      },
    ],
  },
  {
    path: "/application",
    name: "application",
    component: Application,
  },
  {
    path: "/authority",
    name: "authority",
    component: authority,
  },
  aggregation,
]

export default routes
