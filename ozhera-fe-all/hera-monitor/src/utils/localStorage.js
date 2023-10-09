// 存储数据到本地
export const setSelectStorage = function(key, param) {
    window.sessionStorage.setItem(key, typeof param == "object" ? JSON.stringify(param) : param);
}
// 获取本地存储数据
export const getSelectStorage = function(key) {
    const param = window.sessionStorage.getItem(key);
    if (param) {
        const start = param.substr(0, 1)
        const end = param.substr(-1)
        if ((start != '{' || end != '}') && (start != '[' || end != ']')) return param;
        return JSON.parse(param)
    }
    return ''
}
// 删除本地存储数据
export const removeSelectStorage = function(key) {
    window.sessionStorage.removeItem(key);
}
