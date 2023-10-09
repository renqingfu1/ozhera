import service from '../http/index';
import API from "./market-api";

const server = {
    // 获取列表数据
    getListPromise(params, serverType) {
        return service({
            url: API[serverType].getListPath,
            method: 'get',
            params,
        });
    },
    // 添加
    addPromise(params, serverType) {
        return service({
            url: API[serverType].addPath,
            method: 'post',
            params,
        });
    },
    // 编辑
    editPromise(params, serverType) {
        return service({
            url: API[serverType].editPath,
            method: 'post',
            params,
        });
    },
    // 删除
    delPromise(params, serverType) {
        return service({
            url: API[serverType].delPath,
            method: 'post',
            params,
        });
    },
    // 获取大盘地址
    getMarketGrafanaPromise(params, serverType) {
        return service({
            url: API[serverType].getMarketGrafanaPath,
            method: 'get',
            params,
        });
    },
};
export default server;
