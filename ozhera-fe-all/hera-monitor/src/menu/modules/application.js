export default {
  index: '2',
  title: 'AlarmSetting',
  icon: 'icon-police',
  children: [
    {
      index: '2.1',
      title: 'AppHealth',
      icon: '',
      path: '/app-health'
    },
    {
      index: '2.2',
      title: 'ApplyAlarmPolicy',
      icon: '',
      path: '/alarm-strategy'
    },
    // {
    //   index: '2.6',
    //   title: '应用进程报警策略',
    //   icon: '',
    //   path: '/app-progress-alarm-strategy',
    //   mode: 'general',
    // },
    // {
    //   index: '2.3',
    //   title: '网关报警策略',
    //   icon: '',
    //   path: '/gateway-alarm-strategy',
    //   mode: 'general',
    // },
    
    {
      index: '2.4',
      title: 'AlarmTemplate',
      icon: '',
      path: '/alarm-template'
    },{
      index: '2.5',
      title: 'PromQLTemplate',
      icon: '',
      path: '/manual-target'
    }
  ]
}
