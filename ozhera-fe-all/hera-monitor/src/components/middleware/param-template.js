const paramTemplate = {
    tableColumns: [
        {
            title:'项目名称',
            key:'projectName'
        },
        {
            title: '用户名',
            key: 'userName'
        },
        {
            title: '数据库名称',
            key: 'dataBaseName',
            isShow: ['db']
        },
        {
            title: '域名端口',
            key: 'domainPort'
        },
        {
            title: '跳转url',
            key: 'url',
            width: 120,
            slot: 'url'
        }
    ]
}

export default paramTemplate;
