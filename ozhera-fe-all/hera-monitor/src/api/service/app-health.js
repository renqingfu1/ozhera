import service from "../http/index"

const server = {
  getAppHealthList(params) {
    return service({
      url: "/mimonitor/appAlarmHealth",
      method: "post",
      params,
    })
  },
  getTeslaHealthList(params) {
    return service({
      url: "/tesla/alarmHealth",
      method: "get",
      params,
    })
  },
  getDilatationRecord(params) {
    return service({
      url: "/mimonitor/capacityAdjustRecord",
      method: "post",
      params,
    })
  },
}
export default server
