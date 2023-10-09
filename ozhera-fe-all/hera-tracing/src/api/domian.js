/*
 * @Description:
 * @Date: 2022-03-02 18:30:51
 * @LastEditTime: 2022-03-03 15:50:40
 */
//云平台
let domian = {
  development: "/api-trace", //开发
  test: "/api-trace", //测试
  production: "/api-trace", //线上
};
export default domian[process.env.VUE_APP_ENV];
