export default {
    // 中国区
    all: [{
        label: 'Dubbo Provider 接口总览',
        value: 'DubboProviderView',
        appParamName: 'var-application',
        url: '/d/42cpm63nkff/mione-dubbo-provider-zong-lan?orgId=1&kiosk',
        timeRangeP:true
    }, {
        label: 'Dubbo Provider 接口大盘',
        value: 'DubboProvider',
        appParamName: 'var-application',
        url: '/d/fwCTLWJnz/mione-dubbofu-wu-da-pan?orgId=1&kiosk',
        type: 'dubbo'
    }, {
        label: 'Dubbo Consumer 接口总览',
        value: 'DubboConsumerView',
        appParamName: 'var-application',
        url: '/d/42cpm63nk/mione-dubbo-consumer-zong-lan?orgId=1&kiosk',
        timeRangeP:true
    }, {
        label: 'Dubbo Consumer 接口大盘',
        value: 'DubboConsumer',
        appParamName: 'var-application',
        url: '/d/fwCTLWJnzff/mione-dubbo-consumer-fu-wu-da-pan?orgId=1&kiosk',
        type: 'dubboConsumer'
    }, {
        label: 'Http 接口总览',
        value: 'HttpView',
        appParamName: 'var-application',
        url: '/d/42cpm63nkffffqcvv/mione-http-server-zong-lan?orgId=1&kiosk',
        timeRangeP:true
    }, {
        label: 'Http 接口大盘',
        value: 'Http',
        appParamName: 'var-application',
        url: '/d/uXn9oUp7k/httpjie-kou-da-pan?orgId=1&kiosk&var-timeRange=$__auto_interval_timeRange&var-url=%2Fredis'
    }],
    // 非中国区
    general: [{
        label: 'http client 接口总览',
        value: 'httpClientView',
        appParamName: 'var-application',
        url: '/d/CMrsNKvVz/mione-http-client-zong-lan?orgId=1&kiosk',
        productionUrl: '/d/EXaVN2v4z/http-consumer-zong-lan?orgId=1&kiosk',
        timeRangeP:true
    }, {
        label: 'http client 接口大盘',
        value: 'httpClient',
        appParamName: 'var-application',
        url: '/d/o-_EZFv4z/http-clientjie-kou-da-pan?orgId=1&kiosk&var-timeRange=1m&var-methodName=HTTP%20POST&var-query0=10800&var-hostName=kfs-crm-web-cn-test-c6d4s',
        productionUrl: '/d/iDbYS2v4z/http-consumerjie-kou-da-pan?orgId=1&kiosk&var-timeRange=$__auto_interval_timeRange&var-url=&var-query0=21600',
    },  {
        label: 'grpc client 接口总览',
        value: 'grpcClientView',
        appParamName: 'var-application',
        url: '/d/a7J6OKD4z/mione-grpc-consumer-zong-lan?orgId=1&kiosk&var-query0=10800',
        productionUrl: '/d/inFxNhDVk/grpc-consumer-zong-lan?orgId=1&kiosk&var-query0=10800',
        timeRangeP:true

    }, {
        label: 'grpc client 接口大盘',
        value: 'grpcClient',
        appParamName: 'var-application',
        url: '/d/2P0DSpD4k/grpc-consumer-fu-wu-da-pan?orgId=1&kiosk&var-timeRange=1m',
        type: 'grpcClient',
        productionUrl: '/d/1fmZv2vVk/grpc-consumer-fu-wu-da-pan?orgId=1&kiosk',
    }, {
        label: 'grpc server 接口总览',
        value: 'grpcServerView',
        appParamName: 'var-application',
        url: '/d/hHVNdFD4z/grpc-provider-zong-lan?orgId=1&kiosk&var-query0=10800',
        productionUrl: '/d/Y0WbDhv4k/grpc-provider-zong-lan?orgId=1&kiosk&var-query0=10800',
        timeRangeP:true
    }, {
        label: 'grpc server 接口大盘',
        value: 'grpcServer',
        appParamName: 'var-application',
        url: '/d/GUOjEFvVz/mione-grpcfu-wu-da-pan?orgId=1&kiosk',
        type: 'grpcServer',
        productionUrl: '/d/Jy0qDhv4k/grpc-provider-fu-wu-da-pan?orgId=1&kiosk',
    }, {
        label: 'thrift client 接口总览',
        value: 'thriftClientView',
        appParamName: 'var-application',
        url: '/d/wXLFpFvVk/thrift-consumer-zong-lan?orgId=1&kiosk',
        productionUrl: '/d/DBLBO2DVk/thrift-consumer-zong-lan?orgId=1&kiosk&var-query0=10800',
        timeRangeP:true
    }, {
        label: 'thrift client 接口大盘',
        value: 'thriftClient',
        appParamName: 'var-application',
        url: '/d/kCGS5pvVz/thrift-consumer-fu-wu-da-pan?orgId=1&kiosk&var-timeRange=1m',
        type: 'thriftClient',
        productionUrl: '/d/Jy0qDhv4k/grpc-provider-fu-wu-da-pan?orgId=1&kiosk',
    }, {
        label: 'thrift server 接口总览',
        value: 'thriftServerView',
        appParamName: 'var-application',
        url: '/d/IMEvcKDVz/thrift-provider-jie-kou-zong-lan?orgId=1&kiosk',
        productionUrl: '/d/kq2TK2DVz/thrift-provider-zong-lan?orgId=1&kiosk&var-query0=10800',
        timeRangeP:true
    }, {
        label: 'thrift server 接口大盘',
        value: 'thriftServer',
        appParamName: 'var-application',
        url: '/d/4ceLKtv4k/thrift-provider-fu-wu-da-pan?orgId=1&kiosk',
        type: 'thriftServer',
        productionUrl: '/d/Zhqod2D4k/thrift-provider-fu-wu-da-pan?orgId=1&kiosk',
    }, {
        label: 'apus client 接口总览',
        value: 'apusClientView',
        appParamName: 'var-application',
        url: '/d/abVVDtDVz/apus-consumer-zong-lan?orgId=1&kiosk',
        productionUrl: '/d/GEpkc2vVk/apus-consumer-zong-lan?orgId=1&kiosk&var-query0=10800',
        timeRangeP:true
    }, {
        label: 'apus client 接口大盘',
        value: 'apusClient',
        appParamName: 'var-application',
        url: '/d/HSyjOtv4z/apus-consumer-fu-wu-da-pan?orgId=1&kiosk&var-timeRange=1m',
        type: 'apusClient',
        productionUrl: '/d/M_-r5hD4z/apus-consumer-fu-wu-da-pan?orgId=1&kiosk',
    }, {
        label: 'apus server 接口总览',
        value: 'apusServerView',
        appParamName: 'var-application',
        url: '/d/oJ5UpKD4k/apus-provider-zong-lan?orgId=1&kiosk',
        productionUrl: '/d/EM_fc2v4z/apus-provider-zong-lan?orgId=1&kiosk',
        timeRangeP:true
    }, {
        label: 'apus server 接口大盘',
        value: 'apusServer',
        appParamName: 'var-application',
        url: '/d/8oA1HpDVz/apus-provider-fu-wu-da-pan?orgId=1&kiosk',
        type: 'apusServer',
        productionUrl: '/d/n62kt2vVz/apus-provider-fu-wu-da-pan?orgId=1&kiosk',
    }]
}
