
import service from '../http/index';
const server = {
    // tesla网关级联数据
    getTeslaCascade(params) {
        return service({
            url: '/alarm/tesla/metric',
            method: 'get',
            params,
        });
    },
};
export default server;
