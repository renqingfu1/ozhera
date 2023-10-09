import UserAccess from '@/views/user/access/index.vue';
import ResourceManage from '@/views/user/resource-manage/index.vue';
import CollectProgress from '@/views/user/collect-progress/CollectProgress.vue';
import UserMenu from '../components/layout/UserMenu.vue';
import UserIndex from '../views/user/index-page/index.vue';
import UserSpaceTree from '../views/user/tree/index.vue';
import CreateChart from '../views/user/tree/analysis/create/create-chart.vue';
import QueryLogByTraceId from '../views/user/query-log-by-traceid/index.vue';
import NotFound from '../views/not-found.vue';
/* eslint-disable */
const routes = [
  {
    name: 'Index', // 用户
    path: '/',
    redirect: '/user/index',
  },
  {
    name: 'User', // 用户
    component:  UserMenu,
    path: '/user',
    redirect: '/user/index',
    children: [{
      path: '/user/index',
      name: 'User-userIndex',
      component: UserIndex,
      meta: { title: '首页' }
    }, {
      path: '/user/space-tree',
      name: 'User-SpaceTree',
      component: UserSpaceTree,
      meta: { title: 'space tree' }
    }, {
      name:'CreateChart',
      path:'/user/create-chart/:spaceId/:storeId',
      component: CreateChart,
    },{
      path: '/user/access',
      name: 'User-Access',
      component:UserAccess,
      meta: { title: '应用日志接入' }
    },{
      path: '/user/resource',
      name: 'ResourceManage',
      component: ResourceManage,
      meta: { title: '资源管理' }
    },{
      path: '/user/collect-progress',
      name: 'CollectProgress',
      component: CollectProgress,
      meta: { title: '收集进度' }
    }],
  }, {
    name: 'queryLogByTraceId',
    path:'/user/queryLogByTraceId',
    component: QueryLogByTraceId,
    meta: { title: 'QueryLogByTraceId' }
  },{
    name:'404',
    path:'/404',
    component: NotFound,
  },{
    path:'*',
    redirect:{
      name: '404'
    }
  }
];

export default routes;