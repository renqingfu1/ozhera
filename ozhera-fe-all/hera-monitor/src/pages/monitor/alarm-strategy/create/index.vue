<template>
  <div class="create-template">
                  
    <MiBack :text="($route.query.id? $t('policyPage.editApplyAlarmPolicy') :$t('policyPage.createApplyAlarmPolicy'))" @click="goPageName"/>
    <div class="content">
      <el-form ref="form"
        :model="form" label-width="80px" size="small" label-position="left" class="create-template-form">
        <ITitle :title="$t('policyPage.basiceInfo')" style="padding: 0 0 10px 0" />
        <el-form-item :label="$t('policyPage.policyName')" prop="strategyName"
          :rules="{
            required: true,
            message: $t('policyPage.enterName'),
            trigger: 'blur',
          }"
          >
          <el-input :placeholder="$t('policyPage.enterName')" v-model.trim="form.strategyName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('remark')">
          <el-input type="textarea" v-model="form.strategyDesc" :placeholder="$t('policyPage.enterRemark')" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="报警应用" prop="appDetail" :rules="{required: true, message: '报警应用不能为空', trigger: 'blur'}">
          <el-select v-model="form.appDetail" 
          :placeholder="$t('selectAlarmAppPlaceholder')"
           value-key="projectId"
           filterable remote :remote-method="remoteApps"
           :disabled="$route.query.id && $route.query.type!=='copy' ?true:false"
           @change="changeApp"
          >
            <el-option
              v-for="item in appOptions"
              :key="item.projectId"
              :label="item.projectName"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('policyPage.monitoringType')" prop="strategyType">
          <StrateryTypes v-model="form.strategyType"
          :disabled="$route.query.id?true:false" @changeType="changeStrategyType"/>
        </el-form-item >
        <el-form-item label="环境选择"
          v-if="form.appDetail && form.strategyType ==1 && form.appDetail.projectId">
          <EnvComponent :app="form.appDetail"
            v-model="formEnv"
            @setEnvOptions="setEnvOptions"
            :switchChoose="switchChooseEnv"
            @changeBoolean="changeChooseEnv"
            @change="changeEnv"/>
        </el-form-item>
        <el-form-item label="Service" 
          v-if="form.appDetail && form.strategyType ==1 && form.appDetail.projectId && serviceOptions.length>0">
          <ServiceComponent :app="form.appDetail"
            v-model="formService"
            :options="serviceOptions"
            :switchChoose="switchChooseService" @changeBoolean="changeChooseService"/>
        </el-form-item>
        <!-- <el-form-item label="函数"  v-if="this.appType==2">
          <ModuleComponent :app="form.appDetail"
            v-model="formFuns"
            :switchChoose="switchChooseFuns" @changeBoolean="changeChooseModule"/>
        </el-form-item> -->
        <ITitle :title="$t('policyPage.configRules')" style="padding: 0 0 10px 0" />
        <el-form-item :label="$t('trigger')" v-if="!$route.query.id && form.strategyType !=2">
          <el-radio-group v-model="form.trigger">
            <el-radio v-for="item in triggerOption"
                      :key="item.value"
                      :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
          <el-select v-if="form.trigger === 1"
                     v-model="templateId"
                     filterable
                     clearable
                     remote
                     reserve-keyword
                     style="margin-left: 10px;"
                     placeholder="请选择常用基础模板"
                     :remote-method="remoteMethod"
                     :loading="templateLoading"
                     @change="getTemplateData">
            <el-option
                v-for="item in templateOptions"
                :key="item.template.id"
                :label="item.template.name"
                :value="item.template.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  :label="form.strategyType!=2?'':$t('trigger')" >
          <div class="template-box"  >
            <UrlAlarmNew 
            v-model="form.alarmRules" 
            ref="alarmDom" 
            :strategyType="form.strategyType"
            :baseEditData="baseEditData"
            :app="form.appDetail"/>
          </div>
        </el-form-item>
        <ITitle :title="$t('policyPage.configNotify')" style="padding: 0 0 10px 0" />
        <el-form-item  :label="$t('policyPage.NotifiRecipient')" class="notice-member">
          <MemberSelect v-model="form.alertMembers" />
          <el-tooltip  effect="dark" :content="$t('policyPage.projectMemTips')" placement="top">
            <el-button  @click="addDepart"  :disabled="!form.appDetail.projectId" :loading="loadingDepart"
            style="margin-left:10px">+{{ $t('policyPage.projectMem') }}</el-button>
          </el-tooltip>
          <AddAtMmbers @click="addPMToAM"/>
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
  import serverApp from "@/api/service/application";
  import serverTemplate from "@/api/service/alarm-template";
  import StrateryTypes from '@/components/form-item/StrateryTypes.vue';
  import UrlAlarmNew from '@/components/alarm-template/UrlAlarmNew.vue';
  import {mapActions} from 'vuex';
  import alarmCommon from '@/components/alarm-template/url-alarm';
  import MiBack from '@/components/mi-back.vue'
  import EnvComponent from './EnvComponent.vue';
  import ServiceComponent from './ServiceComponent.vue';
  // import ModuleComponent from './ModuleComponent.vue';
  import MemberSelect from '@/components/MemberSelect.vue';
  import serverMember from '@/api/service/alarm-member.js';
  import { getSingleEditData } from '@/components/alarm-template/rule-item/rule-item.js';
  import AddAtMmbers from '@/pages/monitor/alarm-strategy/create/components/AddAtMmbers.vue';
  import axios from 'axios'
import { getSelectStorage } from '@/utils/localStorage';

  export default {
    name: 'create-alarm-template',
    components: {
      ITitle,
      StrateryTypes,
      UrlAlarmNew,
      MiBack,
      EnvComponent,
      MemberSelect,
      ServiceComponent,
      // ModuleComponent,
      AddAtMmbers
    },
    data() {
      return {
        cancelTemListReq:()=>{},
        cancelTemDetailReq:()=>{},
        LoadingTepDetail:false, // 加载模板详情
        loadingDepart:false,
        templateLoading: false, // 模板下拉框搜索loading
        baseEditData:{}, // 单条编辑数据
        loading:false,
        appType : null,
        searchAppParams:{
          viewType:0
        },
        appOptions:[],
        onCallOptions:[],
        switchChooseEnv:true, // 是否包含环境
        switchChooseService: true, //是否包含service
        switchChooseFuns: true, // 是否包含模块
        formEnv:[],  // 环境
        formService:[],
        formFuns:[],
        form: {
          strategyType:'0',
          saveTemplate:false,
          appDetail:{},
          alertTeam:[],
          type:'oncall', // 报警组类型
          template:{
            name:'',
            remark:'',
          },
          alarmRules: [], // 指标报警规则模板
          trigger:1,
          alertMembers:[],
          atMembers:[],
        },
        triggerOption: [{ // 触发条件选项数据
          value: 2,
          label: this.$t('policyPage.manConfig')
        }, {
          value: 1,
          label:this.$t('policyPage.selectTemp') 
        }],
        templateId: '', // 选中集成模板
        templateOptions: [], // 常用基础模板
        envOptions:[],
        templateParam: { // 模板下拉框搜索参数
          name: "",
          page: 1,
          pageSize: 1000,
        }
      }
    },
    computed:{
      serviceOptions(){
        let filterList = this.envOptions.filter((item)=>this.formEnv.indexOf(item.key) >=0)
        let res = filterList.map(item=>item.serviceList||{});
        let options = [];
        res.forEach((item)=>{
          let keys = Object.keys(item);
          for(let i=0;i<keys.length;i++){
            options.push({
              label: keys[i],
              value: keys[i],
            })
          }
        })
        return options;
      },
    },
    methods: {
      ...mapActions('moduleStrategyList', ['GETRUlESOPTION','GETSTRATEGYOPTION']),
      changeApp(){
        this.formEnv = [];
        this.getAPPTypeApi();
      },
      getAPPTypeApi(){
        serverApp.getAPPType({
          projectId: this.form.appDetail.projectId,
          projectName: this.form.appDetail.projectName
        }).then((data)=>{
          this.appType = data.type;
        })
      },
      changeChooseEnv(val){
        this.switchChooseEnv = val;
      },
      changeChooseService(val){
        this.switchChooseService = val;
      },
      changeChooseModule(val){
        this.switchChooseFuns = val;
      },
      validateName(rule, value, callback){
        if (this.form.saveTemplate === true) {
          if(!value){
            callback(new Error(this.$t('policyPage.enterTempName')));
          }
        } else {
          callback();
        }
      },
      validateRemark(rule, value, callback){
        if (this.form.saveTemplate === true) {
          if(!value){
            callback(new Error('请输入模板备注'));
          }
        } else {
          callback();
        }
      },
      // 确定提交事件
      onSubmit () {
        this.loading = true;
        let _this = this;
        this.$refs.form.validate((valid) => {
          if(valid){
            if(!_this.otherValidate()){
              this.loading = false;
              return;
            }
            this.$refs.alarmDom.validateFn(()=>{
              this.submitFn();
            },()=>{
              this.loading = false;
            });
          }else{
            this.loading = false;
          }
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
      // 提交保存
      submitFn() {
        this.loading = true;
        let alertTeam = JSON.stringify(this.form.alertTeam.map(item=>{
          return {id:item.id,name:item.name,type:'alert'}
        }))
        let {strategyType,strategyName,strategyDesc,appDetail,id,
          alertMembers,atMembers,alarmRules} = this.form;
        let {iamTreeId,projectId} = appDetail;
        let reqParams = {
          includeEnvs:strategyType==1?(this.switchChooseEnv?this.formEnv:[]):[],
          exceptEnvs:strategyType==1?(!this.switchChooseEnv?this.formEnv:[]):[],
          includeFunctions:this.appType==2?(this.switchChooseFuns?this.formFuns:[]):[],
          exceptFunctions:this.appType==2?(!this.switchChooseFuns?this.formFuns:[]):[],
          includeServices:strategyType==1?(this.switchChooseService?this.formService:[]):[],
          exceptServices:strategyType==1?(!this.switchChooseService?this.formService:[]):[],
          strategyName,strategyType,strategyDesc, alertMembers,atMembers,alertTeam,
          strategyId:id,
          iamId:iamTreeId,
          projectId,
          alarmRules:alarmRules.map((item)=>this.returnSingleRule(item,this.form.strategyType,{alertTeam})),
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
      setAppFromStorage(){ // 从session storage获取app详情
        const param = getSelectStorage('projectSelect');
        if(!param) return; 
        const isMyDeparted = this.appOptions.find((item)=>item.projectId==param.id);
        if(!isMyDeparted || !param.iamTreeId) return; // 不在我参与的应用中或者如果没有iamTreeId 则不赋值
        console.log('赋值');
        this.form = {
          ...this.form,
          appDetail:{
            projectId:param.id,
            projectName:param.name,
            iamTreeId:param.iamTreeId
          }
        }
      },
      async remoteApps(param){
        const appRes =await this.getAllApp(param);
        this.appOptions = appRes.list ||[];
      },
      getAllApp(param){
        let params = {...this.searchAppParams,...{appName:param ||''}};
        return serverApp.getAppList(params)
      },
      getTemplateList(query) { // 获取所有模板list
        let _this = this;
        this.templateLoading = true; // 模板下拉框搜索loading
        const params = {
          ...this.templateParam,
          name: query || "",
          strategyType: this.form.strategyType, // 0基础指标，1接口指标
        }
        const CancelToken = axios.CancelToken;
        serverTemplate.getTepList(params, new CancelToken(function executor(c) {
          _this.cancelTemListReq = c;
        })).then(res => {
          this.templateLoading = false; // 模板下拉框搜索loading
          this.templateOptions = res.list || []
          // 默认选中第一条模板数据
          if (!_this.templateId) {
            if( _this.templateOptions.length){
              _this.templateId = Number(_this.templateOptions[0].template.id)
              _this.getTemplateData(_this.templateId) // 获取监控模板详情
            }else{
              _this.setDefaultRules();
            }
          }
        }).catch(() => {
          this.templateLoading = false; // 模板下拉框搜索loading
        });
      },
      getTemplateListEdit(){
        const params = {
          ...this.templateParam,
          strategyType: this.form.strategyType, // 0基础指标，1接口指标
        }
        serverTemplate.getTemplateListIndex(params).then(res => {
          this.templateOptions = res.list || []
        });
      },
      returnSingleRule:alarmCommon.returnSingleRule,
      defaultRules:alarmCommon.returnUrlDefault,
      returnUrlDetail:alarmCommon.returnUrlDetail,
      returnStr:alarmCommon.returnStr,
      returnCode:alarmCommon.returnCode,
      returnReqLabels:alarmCommon.returnReqLabels,
      retrunIncludeMethod:alarmCommon.retrunIncludeMethod,
      // 跳转页面
      goPageName() {
        this.$router.push({name: 'warnStrategy',
          params: {searchParams: this.$route.params.searchParams}}); // 跳转到报警策略
      },
      // 获取监控模板详情
      getTemplateData(id) {
        const _this = this;
        const param = {id} // 模板 id
        const CancelToken = axios.CancelToken;
        this.LoadingTepDetail = true;
        serverTemplate.getTemDetailCancel(param,new CancelToken(function executor(c) {
          _this.cancelTemDetailReq = c;
        })).then(res => {
          this.LoadingTepDetail = false;
          let alarmRules = res?.alarmRules.map((item)=>{
            delete item.id;
            return this.returnUrlDetail(item)
          })
          this.form = {
            ...this.form,
            ...{alarmRules}
          };
        });
      },
      async getInitData(){
        const appRes = await this.getAllApp('');
        this.appOptions = appRes.list || [];
        if(this.$route.query.id){ // 编辑回显
          this.getDetialData(this.$route.query.id);
        }else{
          this.setAppFromStorage(); // 新增的时候如果有storage则给app赋值
          this.getAppHealthParams();
          this.$nextTick(() => {
            let rightBoxDom = document.querySelector('#rightBox')
            rightBoxDom.scrollTop = 0;
          });
        }
      },
      // 从应用健康度跳到报警应用需携带应用名称和类型
      getAppHealthParams(){
        if(this.$route.params && this.$route.params.appDetail){
          this.form = {
            ...this.form ,
            appDetail:this.$route.params.appDetail,
            strategyType:this.$route.params.strategyType
          }
        }
      },
      // 环境回显
      getEnvReshow(res){
        this.formEnv = res.includeEnvs ||res.exceptEnvs;
        if(res.exceptEnvs && res.exceptEnvs.length>0){
          this.switchChooseEnv = false;
        }else {
          this.switchChooseEnv = true;
        }
      },
      // service回显
      getServiceReshow(res){
        this.formService = res.includeServices ||res.exceptServices;
        if(res.exceptServices && res.exceptServices.length>0){
          this.switchChooseService = false;
        }else {
          this.switchChooseService = true;
        }
      },
      getFunsReshow(res){
        this.formFuns = res.includeFunctions ||res.exceptFunctions;
        if(res.exceptFunctions && res.exceptFunctions.length>0){
          this.switchChooseFuns = false;
        }else {
          this.switchChooseFuns = true;
        }
      },
      getSingleEditData,
      getDetialData(id){ // 编辑回显
        let _this = this;
        server.getStrategyDetail({id}).then((res)=>{
          this.appOptions=[{
            projectId:res.appId,
            projectName:res.appName,
            // iamTreeId:res.iamId
          }]
          this.getEnvReshow(res);
          this.getServiceReshow(res);
          this.getFunsReshow(res);
          this.getSingleEditData(res);
          const {type} = _this.$route.query;
          _this.form={
            ..._this.form,
            ...res,
            alertTeam:JSON.parse(res.alertTeam),
            appDetail:{
              projectId:res.appId,
              projectName:res.appName,
              iamTreeId:res.iamId
            },
            alertMembers:res.alertMembers || [],
            alarmRules:res.alarmRules.map((item)=>_this.returnUrlDetail(item)),
            id: type=='copy'?'':res.id,
            strategyName:`${type=='copy'?this.$t('copy'):''}${res.strategyName}`
          };
          this.getAPPTypeApi();
          this.getTemplateListEdit();
        }).catch((err)=>{
          console.log('获取详情失败', err)
        })
      },
      setDefaultRules(){
        this.form={
          ...this.form,
          ...{
            alarmRules :[
              this.defaultRules()
            ],
          }
        };
      },
      changeStrategyType(type){
        this.setDefaultRules();
        this.templateId = null;
        if(this.templateLoading){
          this.cancelTemListReq();
        }
        if(this.LoadingTepDetail){
          this.cancelTemDetailReq();
        }
        if(type ==2) return;
        this.getTemplateList();
      },
      setEnvOptions(envOptions){
        this.envOptions = envOptions;
      },
      changeEnv(val){
        if(val.length == 0){
          this.formService = [];
        }
        this.formService = this.formService.filter(item=>{
          return (this.serviceOptions.findIndex(function(value){return value.value == item}))>-1
        })
      },
      // 选择模板下拉框筛选
      remoteMethod(query) {
        setTimeout(() => {
          this.getTemplateList(query);
        }, 200);
      },
      addDepart(){
        this.loadingDepart = true;
        let {appDetail} = this.form;
        let params = {
          appId: appDetail.projectId,
          platForm: appDetail.appSource,
        }
        serverMember.getAppMember(params).then((res)=>{
          let list = res.list ||[];
          let names = list.map((item)=>item.name);
          let newArr = this.form.alertMembers.concat(names);
          let arr = Array.from(new Set(newArr));
          this.form.alertMembers = arr;
          this.loadingDepart = false;
        }).catch(()=>{
          this.loadingDepart = false;
        })
      },
      AddAtMembers(names){
        let atMembers = this.form.atMembers ||[];
        let newArr = atMembers.concat(names);
        let arr = Array.from(new Set(newArr));
        this.form.atMembers = arr;
      },
      addPMToAM(){
        this.AddAtMembers(this.form.alertMembers);
      },
    },
    mounted(){
      this.GETRUlESOPTION(); // 获取规则options
      this.GETSTRATEGYOPTION(); // 获取策略类型options
      this.getInitData();
      if(!this.$route.query.id){
        this.getTemplateList();
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
.add-by-slef{
  margin-top:10px;
}
.msg-box{
  font-size: 14px;
  color:rgba(0,0,0,0.25);
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
