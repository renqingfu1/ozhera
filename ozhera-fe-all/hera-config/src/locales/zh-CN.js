export default {
  selApp: '请选择应用',
  confirm: '确定',
  cancle: '取消',
  traceConfig: {
    title: '过滤配置',
    add: '新建过滤配置',
    table: {
      name: '应用名称',
      creator: '创建人',
      createTime: '创建时间',
      operation: '操作',
      edit: '编辑',
      del: '删除',
      detail: '详情',
    },
    edit: {
      filterMetrics: '监控指标过滤设置',
      tips1: '满足过滤条件的监控指标不会被展示在监控中',
      excludeMethodTips:
        '按链路追踪中的应用操作内容排除，可以按某一个，支持模糊匹配',
      excludeHttpserverMethodTips:
        '按链路追踪中的应用操作内容排除，仅仅限制http server端，支持模糊匹配',
      excludeThreadTips: '按线程名称排除，支持模糊匹配',
      excludeSqlTips: '按sql排除，支持模糊匹配',
      excludeHttpUrlTips: '按http url排除，支持模糊匹配',
      excludeUaTips: '按http user agent排除，支持模糊匹配',
      httpSlowThresholdTips:
        '超过阈值的http请求，会被认为是慢查询，展示在http慢查询列表中',
      dubboSlowThresholdTips:
        '超过阈值的dubbo请求，会被认为是慢查询，展示在dubbo consumer/provider慢查询列表中',
      mysqlSlowThresholdTips:
        '超过阈值的mysql请求，会被认为是慢查询，展示在mysql慢查询列表中',
      traceFilterTips: '需要保留下来的trace数据的百分比',
      traceDurationThresholdTips:
        '只要trace中出现了耗时超过该阈值的节点，则会保存整个trace',
      traceDebugFlagTips:
        'trace中任意节点的hera context中，包含这些key的链路数据都会被保留。不支持模糊匹配。',
      httpStatusErrorTips: 'http状态码不显示在异常列表',
      grpcCodeErrorTips: 'grpc code不算做异常请求',
      exceptionTips: '包含以下Exception的请求不算做异常请求',
      exceptOp: '排除操作内容',
      exceptThread: '排除线程名称',
      excpetsql: '排除SQL',
      exceptUrl: '排除URL',
      excpetUA: '排除User Agent',
      tracefilter: '链路追踪过滤设置',
      tracefilterTips: '这些设置决定了链路追踪数据是否会被保存下来。目前优先保存包含错误、包含"trace debug标识"、耗时超过"trace耗时阈值"的链路数据，其余链路数据按照“trace保留百分比”随机保留。',
      traceDebug: 'trace debug标识',
      traceSavePer: 'trace保留百分比',
      traceTime: 'trace耗时阈值',
      slowTable: '异常、慢查询列表设置',
      slowTableTips: '这些设置会影响异常、慢查询列表的数据展示',
      rpcTime: 'RPC耗时阈值',
      dbTime: 'DB耗时阈值',
      httpTime: 'HTTP耗时阈值',
      exceptErrCode: '排除Http异常码',
    },
  },
  menuLayout: {
    过滤配置: '过滤配置',
  },
  appName: '应用名称',
  tipsAppEnv: '请先选择应用名称，再选择应用环境',
};
