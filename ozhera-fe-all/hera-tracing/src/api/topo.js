/**
 * 接口文档：https://test
 *
 */

import request from "./service";
import domian from "./domian";

const prefix = `${domian + "/tracing/v1"}`;

/**
 * 查询过去一段时间拓扑图的点和边
 * @param {*} params
 */
export const getTopoGraph = (params) => {
  return request({
    method: "post",
    url: prefix + "/topo/graph",
    params,
  });
};

/**
 * 查询拓扑图调用关系聚合值
 * @param {*} params
 * @returns
 */
export const getTopoCallValue = (params) => {
  return request({
    method: "post",
    url: prefix + "/topo/calls/value",
    params,
  });
};

/**
 * 查询拓扑图服务聚合值
 */
export const getTopoNodeValue = (params) => {
  return request({
    method: "post",
    url: prefix + "/topo/nodes/value",
    params,
  });
};

/**
 * 查询拓扑图服务时序数据
 * @param {*} params
 */
export const getTopoNodeValues = (params) => {
  return request({
    method: "post",
    url: prefix + "/topo/node/values",
    params,
  });
};

/**
 * 查询拓扑图调用关系时序数据
 * @param {*} params
 * @returns
 */
export const getTopoCallValues = (params) => {
  return request({
    method: "post",
    url: prefix + "/topo/call/values",
    params,
  });
};
