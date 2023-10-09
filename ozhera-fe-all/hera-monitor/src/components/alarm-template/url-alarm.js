const alarmCommon = {
  returnUrlDefault(){
    return {
      alert: '', // 规则名称
      priority: '', // 报警优先级
      op: '', // 比较运算符> < =
      value: 0, // 阈值
      sendInterval: '', // 报警频率
      dataCount: '', // 最近n个数据点
      urls:'',
      includeUrl:true,
      showURLInput:false, // 是否展示url input
      errCode:'',
      includeErrCode:true,
      showErrCodeInput:false,
      dobboService:'',
      includeDobboService:true,
      showDobboServiceInput:false, // 是否展示服务的input
      showDobboServiceMethodInput:false, // 是否展示服务方法的input
      dobboServiceMethod:'', // 服务方法名
      includeDobboServiceMethod: true, // 选择服务方法名
      alarmDetailUrl:'', // 跳转url
      alarmCallbackUrl:'', // 回调url
      remark:'', // 规则备注
      includeDomain:true,
      containDomain:[],
    }
  },
  returnUrlDetail(item){ // 获取详情
    let {httpArr} = this.$store.state.moduleStrategyList;
    let {dobboArr} = this.$store.state.moduleStrategyList;
    let labels = item.labels && JSON.parse(item.labels) ||{};
    let returnReg = new RegExp(',','g');
    const {type} = this.$route.query;
    let domainArr = labels.includeHttpDomains|| labels.exceptHttpDomains;
    return {
      alert: item.alert, // 规则名称
      expr:item.expr,
      priority: item.priority, // 报警优先级
      op: item.op, // 比较运算符> < =
      value: item.value, // 阈值
      sendInterval: item.sendInterval, // 报警频率
      dataCount: item.dataCount, // 最近n个数据点
      urls:(httpArr.indexOf(item.alert)>=0 && (labels.includeMethods || labels.exceptMethods || '').replace(returnReg,'\n'))||'',
      includeUrl:(httpArr.indexOf(item.alert)>=0 && labels?.exceptMethods?.length!==0)?false:true,
      showURLInput:labels?.includeMethods?.length>0 || labels?.exceptMethods?.length>0 ,
      errCode:(labels?.includeErrorCodes?.length>0 && labels?.includeErrorCodes?.split(',')) ||(labels?.exceptErrorCodes?.length>0 && labels?.exceptErrorCodes?.split(',')) ||[],
      includeErrCode:labels?.exceptErrorCodes?.length!==0?false:true,
      showErrCodeInput:labels?.includeErrorCodes?.length>0 ||labels?.exceptErrorCodes?.length>0,
      dobboService:labels.includeDubboServices || labels.exceptDubboServices || '',
      includeDobboService:labels?.exceptDubboServices?.length!==0?false:true,
      showDobboServiceInput:labels.includeDubboServices && labels.includeDubboServices.length>0 ||labels.exceptDubboServices && labels.exceptDubboServices.length>0,
      dobboServiceMethod: labels.includeMethods|| labels.exceptMethods,
      showDobboServiceMethodInput: labels?.includeMethods?.length>0||labels?.exceptMethods?.length>0,
      includeDobboServiceMethod:(dobboArr.indexOf(item.alert)>=0 && labels?.exceptMethods?.length!==0)?false:true,
      // httpclient 排除或包含
      includeDomain:labels.exceptHttpDomains?false:true,
      containDomain:((domainArr && domainArr.length>0)&& domainArr.split(','))||[],
      remark: item.remark,
      alarmDetailUrl:labels.alarmDetailUrl,
      alarmCallbackUrl: labels.alarmCallbackUrl,
      active: false,
      id:type=='copy'?null:item.id,
      projectId:type=='copy'?null:item.projectId,
      strategyId:type=='copy'?null:item.strategyId,
      // iamId:type=='copy'?null:item.iamId,
      loading: false,
      checked:false
    }
  },
  returnStr(str){ // 请求封装数组为字符串
    if(!str ||str && str.length ==0) return '';
    let reg= new RegExp('\\n','g');
    let newStr = str.replace(reg,',');
    console.log('new',newStr);
    return newStr;
  },
  returnCode(codes){ // 请求封装codes
    if(!codes || codes &&  codes.length==0) return '';
    return codes.join(',');
  },
  returnReqLabels(item){ // 请求装配labels
    let {httpHasErrorCodeArr,httpArr,dobboArr,httpClientArr} = this.$store.state.moduleStrategyList;
    let hasErrorCode = httpHasErrorCodeArr.indexOf(item.alert)>=0;
    let hasHttpUrl = httpArr.indexOf(item.alert)>=0 && item.showURLInput
    let dobboAv = dobboArr.indexOf(item.alert)>=0;
    let httpClientClass = httpClientArr.indexOf(item.alert)>=0;
    let methodObj = this.retrunIncludeMethod(item);
    let httpClientDomain = this.returnCode(item.containDomain);
    return JSON.stringify({
      alarmDetailUrl:item.alarmDetailUrl,
      alarmCallbackUrl:item.alarmCallbackUrl,
      includeMethods:((dobboAv && item.showDobboServiceMethodInput)?(item.includeDobboServiceMethod?methodObj.methods:''):'')||((hasHttpUrl && item.includeUrl)?methodObj.methods:'')||'',
      exceptMethods:((dobboAv && item.showDobboServiceMethodInput)?(!item.includeDobboServiceMethod?methodObj.exceptMethods:''):'')||((hasHttpUrl && !item.includeUrl)?methodObj.exceptMethods:'')||'',
      includeErrorCodes:(hasErrorCode && item.showErrCodeInput)?(item.includeErrCode?this.returnCode(item.errCode):''):'',
      exceptErrorCodes:(hasErrorCode && item.showErrCodeInput)?(!item.includeErrCode?this.returnCode(item.errCode):''):'',
      includeDubboServices:(dobboAv && item.showDobboServiceInput) ?(item.includeDobboService?this.returnStr(item.dobboService):''):'',
      exceptDubboServices:(dobboAv && item.showDobboServiceInput)?(!item.includeDobboService?this.returnStr(item.dobboService):''):'',
      includeHttpDomains:(httpClientClass && item.includeDomain)?httpClientDomain:'',
      exceptHttpDomains:(httpClientClass && !item.includeDomain)?httpClientDomain:'',
    })
  },
  retrunIncludeMethod(item){
    let {httpArr} = this.$store.state.moduleStrategyList;
    let {dobboArr} = this.$store.state.moduleStrategyList;
    let methods = '';
    let exceptMethods='';
    if(httpArr.indexOf(item.alert)>=0){ // http类型
      methods =item.showURLInput && (item.includeUrl?this.returnStr(item.urls):'') || '';
      exceptMethods =item.showURLInput &&  (!(item.includeUrl)?this.returnStr(item.urls):'')||'';
    }else if(dobboArr.indexOf(item.alert)>=0){ // dubbo类型
      methods =(item.showDobboServiceMethodInput && item.includeDobboServiceMethod)?item.dobboServiceMethod:'';
      exceptMethods =(item.showDobboServiceMethodInput && ( !item.includeDobboServiceMethod?item.dobboServiceMethod:'')) || '';
    }else{
      methods = '';
      exceptMethods =''
    }
    return {methods,exceptMethods}
  },
  returnTeslaUrlDetail(item){ // 获取详情
    let labels = item.labels && JSON.parse(item.labels) ||{};
    if(!labels.excludeTeslaUrls){ // 兼容历史数据
      labels.excludeTeslaUrls ='';
    }
    const {alert,expr,priority,op,value,sendInterval,dataCount,remark,id,iamId,projectId, strategyId,} = item;
    const {teslaGroup,alarmDetailUrl,teslaUrls,excludeTeslaUrls,teslaPreviewEnv,alarmCallbackUrl,basicNum} = labels;
    return {
      // alert:规则名称 ; priority:报警优先级 ; op:比较运算符> < = ; value:阈值;sendInterval: 报警频率;  dataCount: 最近n个数据点
      alert, 
      expr,
      priority,
      op,
      value,
      sendInterval, 
      dataCount,
      teslaGroup:(teslaGroup && teslaGroup?.split('|') )||[],
      remark,
      alarmDetailUrl,
      teslaUrls:teslaUrls || excludeTeslaUrls || '',
      includeTeslaUrls :excludeTeslaUrls?.length !== 0?false:true,
      teslaPreviewEnv,
      active: false,
      id, 
      projectId, 
      strategyId, 
      iamId,
      loading: false,
      checked:false,
      alarmCallbackUrl,
      basicNum: basicNum || undefined
    }
  },
  returnTeslaReqLabels(item){ // 请求装配labels
    const basicNumObj = item.alert.endsWith('availability')?{basicNum:item.basicNum}:{}
    return JSON.stringify({
      ...basicNumObj,
      teslaGroup:item.teslaGroup.join('|'),
      teslaUrls:item.includeTeslaUrls?item.teslaUrls:'',
      excludeTeslaUrls: !item.includeTeslaUrls?item.teslaUrls:'',
      teslaPreviewEnv:item.teslaPreviewEnv,
      alarmCallbackUrl:item.alarmCallbackUrl
    })
  },
  returnTeslaUrlDefault(){ // 默认
    return {
      alert: '', // 规则名称
      priority: '', // 报警优先级
      op: '', // 比较运算符> < =
      value: 0, // 阈值
      sendInterval: '', // 报警频率
      dataCount: '', // 最近n个数据点
      teslaGroup:[],
      remark:'', // 规则备注
      includeTeslaUrls: true, // tesla url
      teslaUrls:''
    }
  },
  returnSingleRule(item,strategyType,otherData){ // strategyType:3 tesla
    //0 预置指标 （基础类、接口类）1 用户自定义promql
    let metricType = strategyType === 3?0:(strategyType ==2?1:0);
    let labels = strategyType === 3? this.returnTeslaReqLabels(item):this.returnReqLabels(item)
    let itemIndex=  {
      ...item,
      ...otherData,
      labels,
      metricType,
    }
    delete itemIndex.teslaGroup;
    delete itemIndex.includeDobboService;
    delete itemIndex.includeDobboServiceMethod;
    delete itemIndex.includeErrCode;
    delete itemIndex.includeUrl;
    delete itemIndex.loading;
    delete itemIndex.loading;
    delete itemIndex.containDomain;
    delete itemIndex.basicNum;
    if(strategyType=='2'){ //  2 用户自定义
      delete itemIndex.value;
    }
    return itemIndex;
  },
};
export default alarmCommon;
