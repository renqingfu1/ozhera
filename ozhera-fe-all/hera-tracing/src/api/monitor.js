import service from "./service";

const getServerEnvList = function (params) {
  return service({
    method: "post",
    contentType: "application/json",
    url: "/api-monitor/prometheus/serverEnvList",
    params,
  });
};

export { getServerEnvList };
