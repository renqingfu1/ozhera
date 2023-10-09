
export function transformRes(list) {
  let tableData = list.map(item => {
    item.alarmRulesArr = this.returnStr(item,true) || '';
    item.alarmRulesArrNoBr = this.returnStr(item,false) ||'';
    return item
  })
  return tableData
}
export function returnStr(item, hasBr){
  let _this = this
  let options = _this.presetMetrics;
  return (item.alarmRules?.map(rule => {
    let filterData = options.filter(option => option.value == rule.alert);
      let switchHideOpValue = (filterData && filterData[0]?.hideValueConfig==true) ?true:false
      let alertStr =
        item.strategyType != 2
          ? _this.transformStr(_this.presetMetrics, rule.alert)
          : rule.expr // 报警指标
      let fuhao = (item.strategyType != 2 && !switchHideOpValue) ? rule.op : ""
      let value =( item.strategyType != 2 && !switchHideOpValue)  ? rule.value : ""
      let unit =
        (item.strategyType != 2 && !switchHideOpValue)
          ? _this.transformStr(_this.presetMetrics, rule.alert, "unit")
          : "" //单位
      let level =
        item.strategyType != 1
          ? `${hasBr?'<br/>':''}then [${rule.priority}]`
          : `then [${rule.priority}]`
      let chixu = _this.transformStr(_this.checkDataCount, rule.dataCount) // 持续多久
      let interval = _this.transformStr(
        _this.sendInterval,
        rule.sendInterval
      ) // 多久报警
      let httpURLAndCodeAndDubbo =this.transformURL(rule,rule.alert) || "";
      return `if ${alertStr} ${fuhao} ${value}${unit} and ${chixu} ${httpURLAndCodeAndDubbo} ${level}，${interval}`
    })) ||""
}
export function transformURL(rule,alert) {
  let {dobboArr} = this.$store.state.moduleStrategyList;
  if(!rule.labels) return '';
  if (rule.labels.substr(0, 1) != '{' || rule.labels.substr(-1) != '}') return '';
  let labels = JSON.parse(rule.labels)
  let dubboStr = this.retrunDetail(
    labels,
    "includeDubboServices",
    "exceptDubboServices",
    "Service"
  )
  let urlStr = this.retrunDetail(
    labels,
    "includeMethods",
    "exceptMethods",
    dobboArr.indexOf(alert)>=0?"ServiceMethod":"URL"
  )
  let codeStr = this.retrunDetail(
    labels,
    "includeErrorCodes",
    "exceptErrorCodes",
    "Code"
  )
  return ` ${dubboStr ? "，and " + dubboStr : ""}${
    urlStr ? "，and " + urlStr : ""
  }${codeStr ? "，and " + codeStr : ""}`
}
export function retrunDetail(labels, include, except, label) {
  let str = ""
  if ((labels[include] && labels[include].length > 0) ||(labels[except] && labels[except].length > 0) ) {
    let fuhao = labels[include].length > 0 ? "=" : "!="
    str = `${label} ${fuhao} ${labels[include] || labels[except]}`
  }
  return str
}
export function transformStr(arr, value, key) {
  let keyName = key || "label";
  return (
    (arr.filter(every => every.value == value).length > 0 &&
      arr.filter(every => every.value == value)[0][keyName]) ||
    ""
  )
}
