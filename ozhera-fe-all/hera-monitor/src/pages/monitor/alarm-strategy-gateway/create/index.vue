<template>
  <div class="create-template">
    <MiBack :text="$route.query.iamId?'编辑网关报警策略':'新建网关报警策略'" @click="goPageName"/>
    <div class="content">
      <el-form ref="form"
        :model="form" label-width="80px" size="small" label-position="left" class="create-template-form">
        <ITitle :title="$t('policyPage.basiceInfo')" style="padding: 0 0 10px 0" />
        <el-form-item :label="$t('policyPage.policyName')" prop="strategyName" 
        :rules="{required: true,message:$t('policyPage.enterName'),trigger: 'blur',}">
          <el-input :placeholder="$t('policyPage.enterName')" v-model.trim="form.strategyName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('remark')">
          <el-input type="textarea" v-model="form.strategyDesc" 
          :placeholder="$t('policyPage.enterRemark')" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="报警应用" prop="appDetail" :rules="{required: true, message: '报警应用不能为空', trigger: 'blur'}">
          <el-select v-model="form.appDetail" 
            :placeholder="$t('selectAlarmAppPlaceholder')"
           value-key="projectKey"
           filterable :disabled="$route.query.id?true:false">
            <el-option
              v-for="item in teslaOptions"
              :key="item.projectKey"
              :label="item.projectCName"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <ITitle :title="$t('policyPage.configRules')" style="padding: 0 0 10px 0" />
        <el-form-item  :label="$t('trigger')" >
          <div class="template-box">
            <GatewayUrlAlarm  v-model="form.alarmRules"  ref="3AlarmDom" :strategyType="form.strategyType" title="指标报警" :targetOptions="targetOptions"
            :baseEditData="baseEditData"/>
          </div>
        </el-form-item>
        <ITitle :title="$t('policyPage.configNotify')" style="padding: 0 0 10px 0" />
        <el-form-item label="报警通知" prop="alertTeam">
          <AlarmGroup v-model="form.alertTeam" :appDetail="form.appDetail"/>
        </el-form-item>
        <el-form-item  :label="$t('policyPage.NotifiRecipient')" class="notice-member">
          <MemberSelect v-model="form.alertMembers" />
          <AddAtMmbers @click="addPMToAM" style="margin-left: 10px"/>
        </el-form-item>
        <el-form-item :label="`@${$t('personnel')}`" class="notice-member">
          <MemberSelect v-model="form.atMembers" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="loading">{{$t('confirm')}}</el-button>
          <el-button @click="goPageName">{{ this.$t('cancle'), }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import ITitle from '@/components/i-title/index';
  import server from "@/api/service/alarm-srategy";
  import GatewayUrlAlarm from '@/components/alarm-template/gateway-url-alarm/index.vue';
  import {mapActions,mapState} from 'vuex'; 
  import alarmCommon from '@/components/alarm-template/url-alarm';
  import MiBack from '@/components/mi-back.vue';
  import { getSingleEditData } from '@/components/alarm-template/rule-item/rule-item.js';
  import MemberSelect from '@/components/MemberSelect.vue';
  import AddAtMmbers from '@/pages/monitor/alarm-strategy/create/components/AddAtMmbers.vue';

  export default {
    name: 'create-alarm-template',
    components: {
      AddAtMmbers,
      MemberSelect,
      ITitle,
      GatewayUrlAlarm,
      MiBack
    },
    data() {
      return {
        baseEditData:{}, // 单条编辑数据
        loading:false,
        onCallOptions:[],
        form: {
          strategyType:'3',
          saveTemplate:false,
          appDetail:{},
          alertTeam:[],
          type:'oncall', // 报警组类型
          alarmRules: [], // 指标报警规则模板
          atMembers:[],
          alertMembers:[]
        },
      }
    },
    computed:{
      ...mapState({
        teslaOptions: (state) => state.moduleStrategyGateway.teslaOptions, // 指标
      }),
      targetOptions(){
        let filter = this.teslaOptions.filter(item=>item.projectKey===this.form.appDetail.projectKey);
        let res = filter.length ===1?filter[0].rules:[]
        return res;
      }
    },
    methods: {
      ...mapActions('moduleStrategyGateway', ['GETTESLAOPTIONS']), // 获取基础指标
      ...mapActions('moduleStrategyList', ['GETRUlESOPTION']), // 获取tesla指标
      AddAtMembers(names){
        let atMembers = this.form.atMembers ||[];
        let newArr = atMembers.concat(names);
        let arr = Array.from(new Set(newArr));
        this.form.atMembers = arr;
      },
      addPMToAM(){
        this.AddAtMembers(this.form.alertMembers);
      },
      // 确定提交事件
      onSubmit () {
        let _this = this;
        this.$refs.form.validate((valid) => {
          if(valid){
            if(!_this.otherValidate()) return;
            this.$refs[`${this.form.strategyType}AlarmDom`].validateFn(()=>{
              this.submitFn();
            },(err)=>{
              console.log('校验失败',err);
            }); 
          }
        },(outerr)=>{
          console.log('outerr',outerr);
        });
      },
      otherValidate(){
        // let data = this.form;
        // if(!data?.appDetail?.iamTreeId){
        //   this.$message.warning(this.$t('selectApplicationPlaceholder'))
        //   return false;
        // }
        if(this.form.alertTeam.length >5){
          this.$message.warning('报警通知组最多设置5组,请移除!')
          return false;
        }
        if(this.form.alertTeam.length==0 && this.form.alertMembers.length==0){
          this.$message.warning('请选择报警通知组或者报警通知人!')
          return false;
        }
        if(this.form.alarmRules.filter(item=>item.active).length>0){
          this.$message.warning('您有未保存的报警报警规则，请先保存！')
          return false;
        }
        return true;
      },
      // type : req || res 如果需要返回res,则必传res
      transformAppData(type ,res){
        let retData = type =='req'?{
          // iamId:this.form.appDetail?.iamTreeId,
          projectId:this.form.appDetail?.projectId,
          appAlias:this.form.appDetail?.projectKey,
        }:{
          projectId:res.appId,
          projectKey:res.appName,
          // iamTreeId:res.iamId,
        }
        return retData;
      },
      // 提交保存
      submitFn() {
        this.loading = true;
        let alertTeam = JSON.stringify(this.form.alertTeam.map(item=>{
          return {
            id:item.id,
            name:item.name,
            type:'alert'
          }
        }))
        let appData = this.transformAppData('req')
        let reqParams = {
          strategyName:this.form.strategyName,
          strategyType:this.form.strategyType,
          strategyDesc:this.form.strategyDesc,
          strategyId: this.form.id,
          ...{...appData},
          includeFunctions:[],
          exceptFunctions:[],
          alertTeam,
          alarmRules:this.form.alarmRules.map((item)=>{
            let itemIndex =  {
              ...item,
              alertTeam,
              ...{labels:this.returnTeslaReqLabels(item)},
              ...{metricType:0}
            }
            delete itemIndex.teslaGroup;
            return itemIndex;
          }),
          atMembers:this.form.atMembers,
          alertMembers:this.form.alertMembers
        }
        this.addAlarmStrategy(reqParams).then(()=>{
          this.loading =false;
          this.goPageName();
        }).catch(()=>{
          this.loading =false;
        })
      },
      addAlarmStrategy(reqParams){
        let routeQuery = this.$route.query;
        if(routeQuery.id && routeQuery.type!='copy'){ // 编辑
          return server.editStrategy(reqParams)
        }
        return server.addAlarmStrategry(reqParams) // 新增和复制
      },
      defaultRules:alarmCommon.returnTeslaUrlDefault,
      returnTeslaUrlDetail:alarmCommon.returnTeslaUrlDetail,
      returnTeslaReqLabels:alarmCommon.returnTeslaReqLabels,
      goPageName() { // 跳转页面
        this.$router.push({name: 'WarnStrategyGateway'}); // 跳转到报警策略
      },
      getDetailData(id){ // 编辑回显
        let _this = this;
        server.getStrategyDetail({id}).then((res)=>{
        let appData = this.transformAppData('res',res);
          let resData= {
            ...res,
            ...{alertTeam:JSON.parse(res.alertTeam)},
            ...{appDetail:{...appData}}
          };
          let alarmRules = resData.alarmRules.map((item)=>_this.returnTeslaUrlDetail(item))
          let copyData = _this.$route.query.type ==='copy'
            ?{id:'',strategyName:`${this.$t('copy')}-${resData.strategyName}`}
            :{}
          _this.form={
            ..._this.form,...resData,...copyData,...{alarmRules},
            alertMembers: res.alertMembers || []
          };
          this.getSingleEditData(res);
        }).catch((err)=>{
          console.log('获取详情失败', err)
        })
      },
      getSingleEditData,
    },
    mounted(){
      this.GETRUlESOPTION(); // 获取指标
      this.GETTESLAOPTIONS(); // 获取规则options
      if(this.$route.query.id){ // 编辑回显
        this.getDetailData(this.$route.query.id);
      }
    }
  }
</script>

<style scoped>
.content {
  margin: 20px;
  padding: 20px;
  color: #666;
  background: #fff;
}
.create-template >>> .el-input--small,.create-template >>> .el-textarea__inner{
  width: 300px;
  max-width: 100%;
}
.create-template >>> .el-form-item__label{
  color:#aaa;
}
.create-template-form >>> .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
  content:'';
}
.template-box >>> .item-box{
  width: 100%;
}
.template-box >>> .item-box::-webkit-scrollbar{
    height: 8px;
    width:6px
}
.template-box >>> .item-box::-webkit-scrollbar-thumb{
    background-color: #999;
    border-radius: 10px;
}
.template-box >>> .item-box::-webkit-scrollbar-track{
    border-radius: 10px;
}
.template-box >>> .item-box>.el-form-item__content{
  width: 100%;
}
</style>
<style lang="less" scoped>
.notice-member {
  ::v-deep .el-form-item__content{
    display: flex;
    align-items: start;
  }
}
</style>
