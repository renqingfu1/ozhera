import MenuLayout from '@/components/layout.vue/menu-layout.vue';
import TraceConfig from '@/views/trace-config/index.vue';
import TraceConfigCreate from '@/views/trace-config/CreateTrace.vue';

const routes = [
  {
    name: 'AlarmConfig', // 指标监控首页
    component: MenuLayout,
    path: '/',
    redirect: '/trace-config',
    children: [
      {
        path: '/trace-config',
        name: 'TraceConfig',
        component: TraceConfig,
        meta: { title: '过滤配置' },
      },
      {
        path: '/config/create',
        name: 'TraceConfigCreate',
        component: TraceConfigCreate,
        meta: { title: '创建过滤配置' },
      },
    ],
  },
];

export default routes;
