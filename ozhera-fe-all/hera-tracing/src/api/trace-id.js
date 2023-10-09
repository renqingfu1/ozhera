/*
 * @Description:
 * @Date: 2021-11-29 14:38:58
 * @LastEditTime: 2022-03-03 10:53:57
 */
import service from "./service";
import domian from "./domian";

const serviceRouteLine = localStorage.getItem("HeraTracingServiceRouteLine");
let API = {};
if (serviceRouteLine == "1") {
  //api
  API = {
    getTracesUrl: `/api/traces/`, // 获取链路
  };
} else if (serviceRouteLine == "2") {
  API = {
    getTracesUrl: domian + `/tracing/v1/trace/`, // 获取链路
  };
}

/*
 * @Description:方法
 */
// 获取链路具体数据
const getTraces = function (data, query) {
  return service({
    method: "get",
    url: API.getTracesUrl + data.traceId,
    data: query,
  });
};

export { getTraces };
