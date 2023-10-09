/*
 * @Description:
 * @Date: 2021-11-29 14:38:58
 * @LastEditTime: 2022-03-03 10:53:51
 */
import service from "./service";
import domian from "./domian";

const serviceRouteLine = localStorage.getItem("HeraTracingServiceRouteLine");
let API = {};
let getServicesList; //获取应用名下拉列表
let getOperationsList;
if (serviceRouteLine == "1") {
  //api
  API = {
    getServicesUrl: `/api/services`, // 获取应用名下拉列表
    getOperationsUrl: `/api/services`, // 获取应用名操作下拉列表
    getTracesUrl: `/api/traces`, // 获取链路
  };
  //获取应用名下拉列表
  getServicesList = function () {
    return service({
      method: "get",
      url: API.getServicesUrl,
    });
  };
  //获取应用名操作下拉列表
  getOperationsList = function (data) {
    return service({
      method: "get",
      url: API.getOperationsUrl + "/" + data.service + "/operations",
    });
  };
} else if (serviceRouteLine == "2") {
  API = {
    // getServicesUrl: domian + `/tracing/v1/app/all`, // 获取应用名下拉列表（云平台）
    getServicesUrl: `/api-monitor/mimonitor/listApp`, // 获取应用名下拉列表，应用名改成从 Hera 后台获取
    getOperationsUrl: domian + `/tracing/v1/app/operations`, // 获取应用名操作下拉列表
    getTracesUrl: domian + `/tracing/v1/trace/list`, // 获取链路
  };
  //获取应用名下拉列表
  getServicesList = function () {
    return service({
      method: "post", //使用的POST
      url: API.getServicesUrl,
      contentType: "application/json",
      data: {
        myParticipant: "yes",
      },
    });
  };
  //获取应用名操作下拉列表
  getOperationsList = function (data) {
    return service({
      method: "get",
      url: API.getOperationsUrl,
      data,
    });
  };
}
/*
 * @Description:方法
 */

// 获取链路
const getTracesData = function (data) {
  return service({
    method: "GET",
    url: API.getTracesUrl,
    data: data,
  });
};

export { getServicesList, getOperationsList, getTracesData };
