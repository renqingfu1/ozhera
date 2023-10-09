

import Application from '@/pages/monitor/application';
import Log from '@/pages/log';


// 报警中心
const application = {
  path: '/application',
  name: 'application',
  component: Application
}

const log = {
  path: '/log',
  name: 'log',
  component: Log
}

export {
  application,
  log
}