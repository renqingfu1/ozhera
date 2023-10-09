<template>
  <div class="error-list">
    <div class="list-content">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="inner-tabs">
        <el-tab-pane
          v-for="item in activeList"
          :key="item.value"
          :label="`${item.label} (${statistics[item.statistics]>99?'99+':statistics[item.statistics]})`"
          :name="item.value"
          >
          <div slot="label" class="inner-tab-label">
            {{`${item.label} (${statistics[item.statistics]>99?'99+':statistics[item.statistics]})`}}
          </div>
          <IndexBox :item="item" :type="type" :activeName="activeName"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>

import IndexBox from '@/pages/slowquery-exception/IndexBox.vue';
import {mapState} from 'vuex';
export default {
  props: {
    type: {
      require: true,
      type: String,
    },
  },
  components: {IndexBox },
  computed:{
    ...mapState({
      statistics: (state) => state.slowquery.nums, 
    }),
  },
  data() {
    return {
      activeList:[],
      activeName: "dubbo",
      listArr: [
        {
          type: "exception",
          labelArr: [
            {
              label: "httpClient异常",
              statistics:'httpClientExceptionNum', // store中获取统计总数的参数
              value: "httpClientError", // 列表查询条件
              detailType:'http_client', // 跳转到详情需要
              tableKey: [{
                value:'methodName',
                label:'方法名',
              },{
                value:'serverIp',
                label:'服务IP',
              },
              {
                value:'value',
                label:'次数',
                sortable:true,
              }],
              methods: [{
                name:'toDetail',
                label:'详情'
              }],
            },
            {
              label: "http异常列表",
              statistics:'httpExceptionNum', // 统计总数
              value: "httpError", // 查询条件
              detailType:'http',
              tableKey: [{
                value:'methodName',
                label:'方法名',
              },{
                value:'serverIp',
                label:'服务IP',
              },
              {
                value:'value',
                label:'次数',
                sortable:true,
              }],
              methods: [{
                name:'toDetail',
                label:'详情'
              }],
            },
            {
              label: "DubboConsumer异常",
              statistics:'dubboExceptionNum',// 统计总数
              value: "dubboConsumerError",// 查询条件
              detailType:'dubbo_consumer',
              tableKey:  [{
                value:'methodName',
                label:'方法名',
              },{
                value:'serviceName',
                label:'所属服务',
                width:'450px'
              },{
                value:'serverIp',
                label:'服务IP',
              },
              {
                value:'value',
                label:'次数',
                sortable:true
              }],
              methods: [{
                name:'toDetail',
                label:'详情'
              }],
            },
            {
              label: "DubboProvider异常",
              statistics:'dubboPExceptionNum',// 统计总数
              value: "dubboProviderError",// 查询条件
              detailType:'dubbo_provider',
              tableKey:  [{
                value:'methodName',
                label:'方法名',
              },{
                value:'serviceName',
                label:'所属服务',
                width:'450px'
              },{
                value:'serverIp',
                label:'服务IP',
              },
              {
                value:'value',
                label:'次数',
                sortable:true,
              }],
              methods: [{
                name:'toDetail',
                label:'详情'
              }],
            },
            {
              label: "DB异常列表",
              statistics:'sqlExceptionNum',// 统计总数
              value: "dbError",// 查询条件
              detailType:'mysql',
              tableKey: [{
                value:'sqlMethod',
                label:'方法名',
                width:'120px'
              },{
                value:'sql',
                label:'SQL',
              },{
                value:'dataSource',
                label:'数据源',
              },{
                value:'serverIp',
                label:'服务IP',
                width:'120px'
              },
              {
                value:'value',
                label:'次数',
                width:'90px',
                sortable:true,
              }],
              methods: [{
                name:'toDetail',
                label:'详情'
              }],
            },
            
          ],
        },
        {
          type: "slowQuery",
          labelArr: [
            {
              label: "DubboProvider慢查询列表",
              statistics:'dubboProviderSlowQueryNum',// 统计总数
              value: "dubboProviderSlowQuery",// 查询条件
              detailType:'dubbo_provider',
              tableKey: [{
                value:'methodName',
                label:'方法名',
                width:'120px'
              },{
                value:'serviceName',
                label:'所属服务',
              },{
                value:'serverIp',
                label:'服务IP',
                width:'120px'
              },
              {
                value:'value',
                label:'次数',
                width:'90px',
                sortable:true
              }],
              methods: [{
                name:'toDetail',
                label:'详情'
              }],
            },
            {
              label: "DubboConsumer慢查询列表",
              statistics:'dubboCSlowQueryNum',// 统计总数
              value: "dubboConsumerSlowQuery", // 查询条件
              detailType:'dubbo_consumer',
              tableKey: [{
                value:'methodName',
                label:'方法名',
                width:'120px'
              },{
                value:'serviceName',
                label:'所属服务',
              },{
                value:'serverIp',
                label:'服务IP',
                width:'120px'
              },
              {
                value:'value',
                label:'次数',
                width:'90px',
                sortable:true,

              }],
              methods: [{
                name:'toDetail',
                label:'详情'
              }],
            },
            {
              label: "DB慢查询列表",
              statistics:'sqlSlowQueryNum',// 统计总数
              value: "dbSlowQuery",// 查询条件
              detailType:'mysql',
              tableKey: [{
                value:'sqlMethod',
                label:'方法名',
                width:'120px'
              },{
                value:'sql',
                label:'SQL',

              },{
                value:'dataSource',
                label:'数据源',
              },
              {
                value:'serverIp',
                label:'服务IP',
                width:'120px'
              },
              {
                value:'value',
                label:'次数',
                width:'90px',
                sortable:true,
              }],
              methods: [{
                name:'toDetail',
                label:'详情'
              }],
            },
          ],
        },
      ],
    }
  },
  methods: {
    handleClick(tab) {
      let params = {
        ...this.$route.query,
        ...{
          metric:tab.name,
          start_time:'',
          end_time:'',
          method_name:''
        }
      }
      this.$router.push({
        query:params,
      })
    },
    onSubmit() {
      console.log("报警规则!")
    },
  },
  mounted(){
    let res = this.listArr.filter(item => {
      return item.type === this.type
    })
    this.activeList =  res[0].labelArr
    let secondTab = this.$route.query.metric;
    let isInclude = this.activeList.some(item=>item.value===secondTab);
    this.activeName = (isInclude && secondTab ) ||this.activeList[0].value;
  }
}
</script>
<style scoped lang="less">
.error-list{
  padding-bottom: 20px;
  .list-content {
    padding: 20px;
    padding-top: 0;
    margin-right: 16px;
    background: #fff;
    .el-tabs__content .el-tab-pane{
      padding-top:4px;
      padding-left:0;
    }
  }
  .inner-tabs{
    /deep/ .el-tabs__active-bar{
      display: none;
    }
    /deep/ .el-tabs__item.is-active .inner-tab-label{
      border-bottom: solid 2px #1890ff;
      box-sizing: border-box;
      height: 49px;
    }
  }
}

</style>
