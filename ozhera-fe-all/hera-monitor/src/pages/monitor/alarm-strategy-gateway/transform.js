
export function transformRes(list) {
  console.log('list', list);
  let tableData = list.map(item => {
    item.alarmRulesArr = this.returnStr(item,true) || '';
    item.alarmRulesArrNoBr = this.returnStr(item,false) ||'';
    return item
  })
  return tableData
}
export function returnStr(item, hasBr){
  let _this = this
  let {teslaOptions} = this.$store.state.moduleStrategyGateway;
  let presetOptions = teslaOptions.filter((filterItem)=>{
    return filterItem.projectKey === item.appName
  })
  let presetArr = presetOptions[0]?.rules||[];

  return (item.alarmRules?.map(rule => {
      let alertStr =_this.transformStr(presetArr, rule.alert)
      let fuhao = rule.op
      let value = rule.value
      let unit =_this.transformStr(presetArr, rule.alert, "unit")
      let level =`${hasBr?'<br/>':''}then [${rule.priority}]`
      let chixu = _this.transformStr(_this.checkDataCount, rule.dataCount) // 持续多久
      let interval = _this.transformStr(
        _this.sendInterval,
        rule.sendInterval
      ) // 多久报警
      return `if ${alertStr} ${fuhao} ${value}${unit} and ${chixu} ${level}，${interval}`
    })) ||""
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
  let keyName = key || "label"
  return (
    (arr.filter(every => every.value == value).length > 0 &&
      arr.filter(every => every.value == value)[0][keyName]) ||
    ""
  )
}
