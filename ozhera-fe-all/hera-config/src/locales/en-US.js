export default {
  selApp: 'Please select an application',
  confirm: 'Confirm',
  cancle: 'Cancle',
  traceConfig: {
    title: 'Filter Config',
    add: 'Create',
    table: {
      name: 'Name',
      creator: 'Creator',
      createTime: 'Creating Time',
      operation: 'Opration',
      edit: 'Edit',
      del: 'Delete',
      detail: 'Detail',
    },
    edit: {
      filterMetrics: 'Monitoring Metrics Filtering Configuration',
      tips1: 'Monitoring metrics that meet the filtering criteria will not be displayed in the monitoring',
      excludeMethodTips:
        'Exclude based on application operation content in the trace, can be filtered by a specific one, and supports fuzzy matching',
      excludeHttpserverMethodTips:
        'Exclude based on application operation content in the trace, limited to the HTTP server-side only, and supports fuzzy matching',
      excludeThreadTips: 'Exclude by thread name, with support for fuzzy matching',
      excludeSqlTips: 'Exclude by SQL, with support for fuzzy matching',
      excludeHttpUrlTips: 'Exclude by HTTP URL, with support for fuzzy matching.',
      excludeUaTips: 'Exclude by HTTP User Agent, with support for fuzzy matching',
      httpSlowThresholdTips:
        'HTTP requests that exceed the threshold are considered slow queries and will be displayed in the HTTP slow query list',
      dubboSlowThresholdTips:
        'Dubbo requests that exceed the threshold are considered slow queries and will be displayed in the Dubbo Consumer/Provider slow query list',
      mysqlSlowThresholdTips:
        'MySQL requests that exceed the threshold are considered slow queries and will be displayed in the MySQL slow query list',
      traceFilterTips: 'Percentage of trace data to be retained',
      traceDurationThresholdTips:
        'If any node in the trace exceeds the specified threshold, the entire trace will be saved',
      traceDebugFlagTips:
        'Any chain data in the Hera context of any node in the trace that contains these keys will be retained. Fuzzy matching is not supported',
      httpStatusErrorTips: 'HTTP status codes will not be displayed in the exception list.',
      grpcCodeErrorTips: 'GRPC code is not considered an exceptional request',
      exceptionTips: 'Requests containing the following Exceptions are not considered exceptional requests',
      exceptOp: 'Exclude Operations',
      exceptThread: 'Exclude Thread Name',
      excpetsql: 'Exclude SQL',
      exceptUrl: 'Exclude URL',
      excpetUA: 'Exclude User Agent',
      tracefilter: 'Trace Filtering Settings',
      tracefilterTips: 'These settings determine whether trace data will be retained. Currently, trace data that includes errors, contains the "trace debug flag," or exceeds the "trace duration threshold" is prioritized for retention. The remaining trace data is retained randomly based on the "trace retention percentage.',
      traceDebug: 'trace debug flag',
      traceSavePer: 'trace retention percentage',
      traceTime: 'trace duration threshold',
      slowTable: 'Exception and Slow Query List Settings',
      slowTableTips: 'These settings will affect the display of data in the exception and slow query lists.',
      rpcTime: 'RPC duration threshold',
      dbTime: 'Database duration threshold',
      httpTime: 'HTTP duration threshold',
      exceptErrCode: 'Exclude HTTP error codes',

    },
  },
  menuLayout: {
    过滤配置: 'Filter Config',
  },
  appName: 'Application Name',
  tipsAppEnv: 'Please select the application name first, and then select the application environment',
};
