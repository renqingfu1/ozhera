/*
 * @Description:
 * @Date: 2021-11-19 17:45:30
 * @LastEditTime: 2022-02-09 17:11:13
 */
/*
 * @Description:方法
 */
import axios from "axios";
import { ElMessage } from "element-plus";

axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    ElMessage.error({ message: "请求超时!" });
    return Promise.resolve(err);
  }
);
axios.interceptors.response.use(
  (data) => {
    if (data.status && data.status == 200 && data.data.status == "error") {
      ElMessage.error({ message: data.data.msg });
      return;
    }
    return data;
  },
  (err) => {
    if (err?.response?.status === 401) {
      const { tpc_token, loginUrl } = err.response.headers;
      if (tpc_token === "1") {
        window.location.href = `${loginUrl}?redirectUrl=${window.location.href}`;
      }
    }
    if (err.response.status == 504) {
      ElMessage.error({ message: "服务器被吃了⊙﹏⊙∥" });
    } else if (err.response.status == 404) {
      ElMessage.error({ message: "trace找不到了!" });
    } else if (err.response.status == 403) {
      ElMessage.error({ message: "权限不足,请联系管理员!" });
    } else {
      ElMessage.error({ message: "未知错误!" });
    }
    return Promise.resolve(err);
  }
);

let base = "";

const postRequest = (config) => {
  if (!config.contentType) {
    // 默认是application/json
    config.contentType = "application/json";
  }
  return axios({
    method: "post",
    url: `${base}${config.url}`,
    data: config.params || config.data,
    transformRequest: [
      function (data) {
        if (config.contentType === "application/json") {
          return JSON.stringify(data);
        }
        let ret = "";
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        return ret;
      },
    ],
    headers: {
      "Content-Type": config.contentType || "application/x-www-form-urlencoded",
    },
  });
};
// const putRequest = (config) => {
//   return axios({
//     method: "put",
//     url: `${base}${config.url}`,
//     data: config.params || config.data,
//     transformRequest: [
//       function (data) {
//         let ret = "";
//         for (let it in data) {
//           ret +=
//             encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
//         }
//         return ret;
//       },
//     ],
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//   });
// };
// const deleteRequest = (config) => {
//   return axios({
//     method: "delete",
//     url: `${base}${config.url}`,
//   });
// };
const getRequest = (config) => {
  return axios({
    method: "get",
    url: `${base}${config.url}`,
    params: config.params || config.data,
  });
};

function service(config) {
  let request;
  if (!config.method) {
    // 默认是get
    request = getRequest;
  }
  if (config.method === "post" || config.method === "POST") {
    request = postRequest;
  }
  if (config.method === "get" || config.method === "GET") {
    request = getRequest;
  }
  return request(config).then((res) => {
    return res.data;
  });
}
export default service;
