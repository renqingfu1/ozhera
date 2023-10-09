
import LodashBoard from '@/pages/monitor/dash-board/index';
import AppUnusualDetail from '@/pages/slowquery-exception/detail/index';
import WarnStrategy from '@/pages/monitor/alarm-strategy/index.vue';
import WarnStrategyCreate from '@/pages/monitor/alarm-strategy/create/index.vue';
import WarnStrategyGateway from '@/pages/monitor/alarm-strategy-gateway/index.vue';
import WarnStrategyGatewayCreate from '@/pages/monitor/alarm-strategy-gateway/create/index.vue';
import AppAlarmTemplate from '@/pages/monitor/alarm-template/index';
import CreateAppAlarmTemplate from '@/pages/monitor/alarm-template/create';

// 报警设置
const application = [
  {
    path: '/application/dash-board',
    name: 'lodashBoard',
    component: LodashBoard,
    // meta: {
    //   keepAlive: true
    // }
  },
  {
    path: '/app/detail',
    name: 'appUnusualDetail',
    component: AppUnusualDetail
  },
  {
    path: '/alarm-strategy',
    name: 'warnStrategy',
    component: WarnStrategy
  },
  {
    path: '/gateway-alarm-strategy',
    name: 'WarnStrategyGateway',
    component: WarnStrategyGateway
  },
  {
    path: '/gateway-alarm-strategy/create',
    name: 'WarnStrategyGatewayCreate',
    component: WarnStrategyGatewayCreate
  },
  {
    path: '/alarm-strategy/create',
    name: 'warnStrategyCreate',
    component: WarnStrategyCreate
  },
  { // 应用报警模板
    path: '/alarm-template',
    name: 'appAlarmTemplate',
    component: AppAlarmTemplate
  },
  { // 新建应用报警模板
    path: '/alarm-template/create',
    name: 'createAppAlarmTemplate',
    component: CreateAppAlarmTemplate
  },
  { // 应用大盘
    path: '/market',
    name: 'Market',
    component: () => import('@/pages/monitor/market/project-market'),
    meta: {
      keepAlive: true
    }
  },
  { // 应用大盘详情页
    path: '/market-details',
    alias: '/quality-market-details',
    name: 'MarketDetails',
    component: () => import('@/pages/monitor/market/components/details')
  },
  { // 自定义指标
    path: '/manual-target',
    name: 'ManualTarget',
    component: () => import('@/pages/monitor/manual-target/index')
  },
  { // 质量大盘
    path: '/quality-market',
    name: 'qualityMarket',
    component: () => import('@/pages/monitor/market/quality-market'),
    meta: {
      keepAlive: true
    }
  },
]
export default application;
