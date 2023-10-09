const API = {
    project: {
        getListPath: '/serviceMarket/mimonitor/searchMarketList', // 获取列表数据
        addPath: '/serviceMarket/mimonitor/createMarket', // 添加
        editPath: '/serviceMarket/mimonitor/updateMarket', // 编辑
        delPath: '/serviceMarket/mimonitor/deleteMarket', // 删除
        getMarketGrafanaPath: '/serviceMarket/mimonitor/getServiceMarketGrafana', // 获取大盘地址
    },
    quality: {
        getListPath: '/qualityMarket/mimonitor/searchMarketList', // 获取列表数据
        addPath: '/qualityMarket/mimonitor/createMarket', // 添加
        editPath: '/qualityMarket/mimonitor/updateMarket', // 编辑
        delPath: '/qualityMarket/mimonitor/deleteMarket', // 删除
        getMarketGrafanaPath: '/qualityMarket/mimonitor/searchMarket', // 获取大盘地址
    }
}
export default API;
