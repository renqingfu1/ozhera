/**
 * 基于axios库的HTTP请求 -> milog接口直接调用[支持跨域]
 */
 import axios from 'axios'

 const baseURL = process.env.NODE_ENV === 'production' ? '/' : 'http://devurl'
 const service = axios.create({
   baseURL,
   timeout: 10000
 })
 
 // 响应拦截器
 service.interceptors.response.use(response => {
   const { code,data,message } = response.data;
   switch(code) {
     case 0:
         return data;
     default:
         showError(`${response.config.url}:${message}`);
         break
   }
 },error => {
  if (error?.response?.status === 401) {
    const { loginurl } = error.response.headers;
    window.location.href = `${loginurl}?redirectUrl=${window.location.href}`;
  } else if (error.message && !error.message.startsWith('timeout') && error.response.status !== 404) {
    console.log(error.message);
  }
 })
 
 // 输出错误信息
 function showError(msg) {
   this.$message.error(msg)
 }
 
 export default service