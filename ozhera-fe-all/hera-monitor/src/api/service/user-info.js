import service from '../http/index';

const server = {
    // oncall报警组列表
    getUserInfo(params) {
        return service({
            url: '/user/info',
            method: 'post',
            params,
        });
    }
};
export default server;
