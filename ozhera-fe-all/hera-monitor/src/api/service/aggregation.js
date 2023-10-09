import service from "../http/index"

const server = {
  getDepartmentTree(params) {
    return service({
      url: "/highDim/department",
      method: "get",
      params,
    })
  },

  APP_PAGE_SIZE: 30,

  getSupportMetrics(params) {
    return service({
      url: "/highDim/getSupportMetrics",
      method: "get",
      params,
    })
  },

  getMultiSupportMetrics(params) {
    return service({
      url: "/highDim/getMultiSupportMetrics",
      method: "get",
      params,
    })
  },


  getAppListByDeptId(params) {
    return service({
      url: "/highDim/getAppListByDeptId",
      method: "post",
      params,
    })
  },

  getDepartmentGraph(params) {
    return service({
      url: "/highDim/getDepartmentGraph",
      method: "post",
      params,
    })
  },

  getDepartmentTable(params) {
    return service({
      url: "/highDim/getDepartmentTable",
      method: "post",
      params,
    })
  },

  getAppGraph(params) {
    return service({
      url: "/highDim/getAppGraph",
      method: "post",
      params,
    })
  },

  getAppTable(params) {
    return service({
      url: "/highDim/getAppTable",
      method: "post",
      params,
    })
  },
}

export default server
