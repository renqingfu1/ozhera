import service from '../http/index';

const server = {
    // oncall报警组列表
    getOncallList(params) {
        return service({
            url: '/alarm/alertTeam/query',
            method: 'post',
            params,
        });
    }
};
export default server;
