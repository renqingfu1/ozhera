
const tableKeysArr = {
  method:{
    value: "method",
    label: "方法",
  },
  methodName:{
    value: "methodName",
    label: "方法名",
  },
  methodName120:{
    value: "methodName",
    label: "方法名",
    width: "120px",
  },
  sqlMethod:{
    value: "sqlMethod",
    label: "方法名",
  },
  sqlMethod120:{
    value: "sqlMethod",
    label: "方法名",
    width: "120px",
  },
  serverEnv:{
    value: "serverEnv",
    label: "服务环境",
  },
  serverIp:{
    value: "serverIp",
    label: "服务IP",
  },
  serverIp120:{
    value: "serverIp",
    label: "服务IP",
    width: "120px",
  },
  valueSort:{
    value: "value",
    label: "次数",
    sortable: true,
  },
  valueSort90:{
    value: "value",
    label: "次数",
    sortable: true,
    width: "90px",
  },
  dataSource:{
    value: "dataSource",
    label: "数据源",
  },
  sql:{
    value: "sql",
    label: "SQL",
  },
  serviceName:{
    value: "serviceName",
    label: "所属服务",
  },
  serviceName450:{
    value: "serviceName",
    label: "所属服务",
    width: "450px",
  }
}
const {serverEnv,serverIp120,valueSort,valueSort90,serverIp,methodName,method,methodName120,sqlMethod120,sql,dataSource,serviceName450,serviceName} = tableKeysArr;

const commonArr1 = [ serverEnv,serverIp120,valueSort90]
const serenvSeripValsort = [serverEnv,serverIp,valueSort]
const mnSenvSipValSort = [methodName,...serenvSeripValsort]
const redisKey = [method,...serenvSeripValsort]
const sm12SqDsSeSip12Vs9=[sqlMethod120,sql,dataSource,...commonArr1]
const rpcTableKeys4Exception = [methodName,serviceName450,...serenvSeripValsort]
const rpcTableKeys4SlowQuery = [methodName120,serviceName,...commonArr1]

const toDetailMethod = {
  name: "toDetail",
  label: "详情",
}
const tabsContainer = {
  exception: [
    {
      category: "HTTP",
      innerTabs: [
        {
          label: "HttpClient",
          statistics: "httpClientExceptionNum", // store中获取统计总数的参数
          value: "httpClientError", // 列表metric查询条件 在store中配置 num reqParam
          detailType: "http_client", // 跳转到详情需要 
          tableKey: mnSenvSipValSort,
          methods: [toDetailMethod],
        },
        {
          label: "HttpServer",
          statistics: "httpExceptionNum", // 统计总数
          value: "httpError", // 查询条件
          detailType: "http",
          tableKey:mnSenvSipValSort,
          methods: [toDetailMethod],
        },
      ],
    },
    {
      category: "Dubbo",
      innerTabs: [
        {
          label: "DubboConsumer",
          statistics: "dubboExceptionNum", // 统计总数
          value: "dubboConsumerError", // 查询条件
          detailType: "dubbo_consumer",
          tableKey: rpcTableKeys4Exception,
          methods: [toDetailMethod],
        },
        {
          label: "DubboProvider",
          statistics: "dubboPExceptionNum", // 统计总数
          value: "dubboProviderError", // 查询条件
          detailType: "dubbo_provider",
          tableKey: rpcTableKeys4Exception,
          methods: [toDetailMethod],
        },
      ],
    },
    {
      category: "gRPC",
      innerTabs: [
        {
          label: "gRPC调入",
          statistics: "grpcServerErrorNum", // 统计总数
          value: "grpcServerError", // 查询条件
          detailType: "grpc_server",
          tableKey: rpcTableKeys4Exception,
          methods: [toDetailMethod],
        },
        {
          label: "gRPC调出",
          statistics: "grpcClientErrorNum", // 统计总数
          value: "grpcClientError", // 查询条件
          detailType: "grpc_client",
          tableKey: rpcTableKeys4Exception,
          methods: [toDetailMethod],
        },
      ],
    },
    {
      category: "Thrift",
      innerTabs: [
        {
          label: "Thrift调入",
          statistics: "thriftServerErrorNum", // 统计总数
          value: "thriftServerError", // 查询条件
          detailType: "thrift_server",
          tableKey: rpcTableKeys4Exception,
          methods: [toDetailMethod],
        },
        {
          label: "Thrift调出",
          statistics: "thriftClientErrorNum", // 统计总数
          value: "thriftClientError", // 查询条件
          detailType: "thrift_client",
          tableKey: rpcTableKeys4Exception,
          methods: [toDetailMethod ],
        },
      ],
    },
    {
      category: "Apus",
      innerTabs: [
        {
          label: "Apus调入",
          statistics: "apusServerErrorNum", // 统计总数
          value: "apusServerError", // 查询条件
          detailType: "apus_server",
          tableKey: rpcTableKeys4Exception,
          methods: [toDetailMethod],
        },
        {
          label: "Apus调出",
          statistics: "apusClientErrorNum", // 统计总数
          value: "apusClientError", // 查询条件
          detailType: "apus_client",
          tableKey: rpcTableKeys4Exception,
          methods: [toDetailMethod],
        },
      ],
    },
    {
      category: "DB",
      innerTabs: [
        {
          label: "MySQL",
          statistics: "sqlExceptionNum", // 统计总数
          value: "dbError", // 查询条件
          detailType: "mysql",
          tableKey: sm12SqDsSeSip12Vs9,
          methods: [toDetailMethod],
        },{
          label: "Oracle",
          statistics: "oracleExceptionNum", // 统计总数
          value: "oracleError", // 列表查询条件
          detailType: "oracle", // 获取详情接口字段
          labelMethodName:'sqlMethod',
          tableKey: sm12SqDsSeSip12Vs9,
          methods: [toDetailMethod],
        },
        {
          label: "ES",
          statistics: "esExceptionNum", // 统计总数
          value: "elasticsearchClientError", // 列表查询条件
          detailType: "elasticsearch", // 获取详情接口字段
          labelMethodName:'sqlMethod',
          tableKey: sm12SqDsSeSip12Vs9,
          methods: [toDetailMethod],
        },
      ],
    },{
      category: "Redis",
      innerTabs: [
        {
          label: "Redis异常",
          statistics: "redisExceptionNum", // 统计总数
          value: "redisError", // 列表查询条件
          detailType: "redis", // 获取详情接口字段
          tableKey: redisKey,
          methods: [toDetailMethod],
        },
      ],
    }
  ],
  slowQuery: [
    {
      category: "HTTP ",
      innerTabs: [
        {
          label: "HttpClient",
          statistics: "httpClientSlowNum", // 统计总数
          value: "httpClientSlowQuery", // 查询条件
          detailType: "http_client",
          tableKey: mnSenvSipValSort,
          methods: [toDetailMethod],
        },
        {
          label: "HttpServer",
          statistics: "httpSlowNum", // 统计总数
          value: "httpSlowQuery", // 查询条件
          detailType: "http",
          tableKey: mnSenvSipValSort,
          methods: [toDetailMethod],
        },
      ],
    },
    {
      category: "Dubbo",
      innerTabs: [
        {
          label: "DubboProvider",
          statistics: "dubboProviderSlowQueryNum", // 统计总数
          value: "dubboProviderSlowQuery", // 查询条件
          detailType: "dubbo_provider",
          tableKey: rpcTableKeys4SlowQuery,
          methods: [toDetailMethod],
        },
        {
          label: "DubboConsumer",
          statistics: "dubboCSlowQueryNum", // 统计总数
          value: "dubboConsumerSlowQuery", // 查询条件
          detailType: "dubbo_consumer",
          tableKey: rpcTableKeys4SlowQuery,
          methods: [toDetailMethod],
        },
      ],
    },
    {
      category: "gRPC",
      innerTabs: [
        {
          label: "gRPC调入",
          statistics: "grpcServerSlowQueryNum", // 统计总数
          value: "grpcServerSlowQuery", // 查询条件
          detailType: "grpc_server",
          tableKey: rpcTableKeys4SlowQuery,
          methods: [toDetailMethod],
        },
        {
          label: "gRPC调出",
          statistics: "grpcClientSlowQueryNum", // 统计总数
          value: "grpcClientSlowQuery", // 查询条件
          detailType: "grpc_client",
          tableKey: rpcTableKeys4SlowQuery,
          methods: [toDetailMethod],
        },
      ],
    },
    {
      category: "Thrift",
      innerTabs: [
        {
          label: "Thrift调入",
          statistics: "thriftServerSlowQueryNum", // 统计总数
          value: "thriftServerSlowQuery", // 查询条件
          detailType: "thrift_server",
          tableKey: rpcTableKeys4SlowQuery,
          methods: [toDetailMethod],
        },
        {
          label: "Thrift调出",
          statistics: "thriftClientSlowQueryNum", // 统计总数
          value: "thriftClientSlowQuery", // 查询条件
          detailType: "thrift_client",
          tableKey: rpcTableKeys4SlowQuery,
          methods: [toDetailMethod],
        },
      ],
    },
    {
      category: "Apus",
      innerTabs: [
        {
          label: "Apus调入",
          statistics: "apusServerSlowQueryNum", // 统计总数
          value: "apusServerSlowQuery", // 查询条件
          detailType: "apus_server",
          tableKey: rpcTableKeys4SlowQuery,
          methods: [toDetailMethod],
        },
        {
          label: "Apus调出",
          statistics: "apusClientSlowQueryNum", // 统计总数
          value: "apusClientSlowQuery", // 查询条件
          detailType: "apus_client",
          tableKey: rpcTableKeys4SlowQuery,
          methods: [toDetailMethod],
        },
      ],
    },
    {
      category: "DB",
      innerTabs: [
        {
          label: "MySQL",
          statistics: "sqlSlowQueryNum", // 统计总数
          value: "dbSlowQuery", // 查询条件
          detailType: "mysql",
          tableKey:sm12SqDsSeSip12Vs9,
          methods: [toDetailMethod],
        },{
          label: "Oracle",
          statistics: "oracleSlowNum", // 统计总数
          value: "oracleSlowQuery", // 查询条件对应store中的配置
          detailType: "oracle",
          labelMethodName:'sqlMethod',
          tableKey: sm12SqDsSeSip12Vs9,
          methods: [toDetailMethod],
        },
         {
          label: "ES", // 慢查询
          statistics: "esSlowNum", // 统计总数
          value: "elasticsearchClientSlowQuery", // 列表查询条件
          detailType: "elasticsearch", // 获取详情接口字段
          labelMethodName:'sqlMethod',
          tableKey:sm12SqDsSeSip12Vs9,
          methods: [toDetailMethod],
        },
      ],
    },
    {
      category: "Redis",
      innerTabs: [
        {
          label: "Redis",
          statistics: "redisSlowNum", // 统计总数
          value: "redisSlowQuery", // 查询条件
          detailType: "redis",
          labelMethodName:'method',
          tableKey:redisKey,
          methods: [toDetailMethod],
        },
      ],
    },
  ],
}
export default tabsContainer;