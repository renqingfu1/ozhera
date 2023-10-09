<template>
  <div class="url-alarm">
    <AlarmTitle :strategyType="strategyType"/>
    <p class="tips-content">{{ $t('policyPage.ruleTips') }}</p>
    <el-form :model="formInline" ref="urlForm"  class="detail" inline>
      <el-form-item v-for="(item,index) in formInline.rules" :key="item.index"
         class="item-box"
      >
        <el-form-item label="if" label-width="30px" :prop="'rules.' + index + '.alert'" :rules="rulesObj" v-if="strategyType!=2">
          <StrategySelectGroup v-if="strategyType==1" v-model="item.alert" style="width:270px" :options="presetMetrics.filter(item=>item.strategyType==strategyType)" 
          groupBy="metricType" :groupOptions="groupOptions"
          :defaultGroup="(presetMetrics.find(p=>p.value === item.alert) || {metricType:'error_times'}).metricType"/>
          <StrategySelect v-else v-model="item.alert" style="width:205px" :options="presetMetrics.filter(item=>item.strategyType==strategyType)" />
        </el-form-item>
        <el-form-item :prop="'rules.' + index + '.op'" :rules="rulesObj" v-if="strategyType!=2">
          <StrategySelect v-model="item.op" style="width:55px" :options="operatorOption" placeholder=""/>
        </el-form-item>
        <el-form-item  :prop="'rules.' + index + '.value'" :rules="rulesObj" v-if="strategyType!=2">
          <el-input-number v-model.number="item.value" 
          :controls="false" style="width: 100px;"
          :precision="2" :min="0.01" size="mini" />
          <span class="unit-span" v-if="presetMetrics.filter(filteI=>filteI.value === item.alert).length>0 && presetMetrics.filter(filteI=>filteI.value === item.alert)[0].unit.length>0">
            {{
              (presetMetrics.filter(filteI=>filteI.value === item.alert))[0].unit ||'' 
            }}
          </span>
        </el-form-item>
        <PromqlTitle 
          v-model="item.alert" :index="index" :strategyType="strategyType" 
          :disabled="item.id?true:false"/>
        <ManualBtns v-model="item.expr" v-if="strategyType==2"/>
        <el-form-item :prop="'rules.' + index + '.expr'"  :rules="rulesObj"  v-if="strategyType==2" class="manual-input">
          <div class="text-area-box">
            <el-input v-model.trim="item.expr" style="width:100%;" type="textarea" :rows="4" placeholder="请输入自定义PromQL表达式"/>
            <el-button type="text" style="font-weight:normal;" v-if="item.expr && item.expr.length>0" @click="testPromQL(item.expr)" class="test-promql">{{ $t('metricPage.testPromQL') }}</el-button>
          </div>
        </el-form-item>
        <el-form-item :prop="'rules.' + index + '.dataCount'"  :rules="rulesObj" 
        :label="strategyType==2?'if 自定义PromQL表达式':''" >
          <StrategySelect v-model="item.dataCount" style="width:110px" :options="checkDataCount"/>
        </el-form-item>
        <span class="then-span">then</span>
        <el-form-item :prop="'rules.' + index + '.priority'" :rules="rulesObj">
          <StrategySelect v-model="item.priority" style="width:70px" :options="alarmLevels"/>
        </el-form-item>
        <el-form-item :prop="'rules.' + index + '.sendInterval'" :rules="rulesObj">
          <StrategySelect v-model="item.sendInterval" style="width:140px" :options="sendInterval"/>
        </el-form-item>
        <el-form-item v-if="formInline.rules.length!=1">
          <el-button type="text" @click="removeItem(index)" style="padding:0;vertical-align:middle;" >
            <i class="el-icon-remove-outline" style="font-size: 20px;color:#b3b3b3;" />
          </el-button>
        </el-form-item>
        <!-- URL部分 -->
        <div v-if="item.showURLInput &&  httpArr.indexOf(item.alert)>=0" class="add-box"> 
          <AndSpan/>
          <span class="rule-title">URL</span>
          <IfInclude v-model="item.includeUrl" class="if-inclucde"/>
          <el-form-item :prop="'rules.' + index + '.urls'" class="strategy-input" :rules="rulesObj">
            <el-input placeholder="请输入要配置的URL地址，多个请换行分隔（支持通配符，如配置通配符请使用 .* 替代 *，如/abc/def.* ，不可直接写/abc*，否则无法通配）"
              class="strategy-input-box"  type="textarea" :rows="5" v-model="item.urls">
            </el-input>
          </el-form-item>
          <RemoveBtn @click="addURL(item)"/>
        </div>
        <!-- ErrorCode部分 -->
        <div v-if="item.showErrCodeInput  && httpHasErrorCodeArr.indexOf(item.alert)>=0 " class="add-box"> 
          <AndSpan/>
          <span class="rule-title">errorCode</span>
          <IfInclude v-model="item.includeErrCode" class="if-inclucde"/>
          <el-form-item :prop="'rules.' + index + '.errCode'" class="strategy-input line-height-28" :rules="rulesObj">
            <el-select v-model="item.errCode" multiple :placeholder="$t('pleaseSel')" class="err-code-select"
             size="mini" style="width:500px">
              <el-option v-for="item in ErrCodeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <RemoveBtn @click="addErrCode(item)"/>
        </div>
        <!-- dubbo服务名 -->
        <div v-if="item.showDobboServiceInput && dobboArr.indexOf(item.alert)>=0" class="add-box">
          <AndSpan/>
          <span class="rule-title">服务名称</span>
          <IfInOut v-model="item.includeDobboService" class="if-inclucde" />
          <el-form-item :prop="'rules.' + index + '.dobboService'" class="strategy-input line-height-28" :rules="rulesObj">
            <el-input placeholder="请输入服务名，多个请用英文逗号分隔" size="mini" 
              class="strategy-input-box"  v-model="item.dobboService" style="width:500px">
            </el-input>
          </el-form-item>
          <RemoveBtn @click="addService(item)"/>
        </div>
        <!-- dubbo服务名-方法名 -->
        <div v-if="item.showDobboServiceMethodInput && dobboArr.indexOf(item.alert)>=0" class="add-box"> 
          <AndSpan/>
          <span class="rule-title">服务方法名</span>
          <IfInOut v-model="item.includeDobboServiceMethod" class="if-inclucde" />
          <el-form-item :prop="'rules.' + index + '.dobboServiceMethod'" class="strategy-input line-height-28" :rules="rulesObj">
            <el-input placeholder="请输入服务名，多个请用英文逗号分隔" size="mini" 
              class="strategy-input-box"  v-model="item.dobboServiceMethod" style="width:500px;">
            </el-input>
          </el-form-item>
          <RemoveBtn @click="addServiceMethod(item)"/>
        </div>
        <div class="jump-url" v-if="strategyType==2">
          <el-form-item label="跳转URL" :prop="'rules.' + index + '.alarmDetailUrl'" class="jump-url-item">
            <el-input v-model.trim="item.alarmDetailUrl" style="width:100%;" type="textarea" :rows="2" placeholder="请输入跳转URL"/>
          </el-form-item>
          <div></div>
          <el-form-item label="规则描述" :prop="item.remark" class="jump-url-item">
            <el-input v-model.trim="item.remark" placeholder="请输入规则描述"/>
          </el-form-item>
        </div>
        <div class="extra-options"> 
          <div v-if="httpArr.indexOf(item.alert)>=0">
            <div class="btn-div"   v-if="!item.showURLInput">
              <el-button type="text" @click="addURL(item)">+ 添加URL</el-button>
              <span class="tips">，如不添加则对所有URL生效</span>
            </div>
            <div class="btn-div" v-if="!item.showErrCodeInput && httpHasErrorCodeArr.indexOf(item.alert)>=0">
              <el-button type="text" @click="addErrCode(item)">+ 添加errorCode</el-button>
            </div>
          </div>
          <div class="btn-div" v-if="dobboArr.indexOf(item.alert)>=0">
            <el-button type="text" @click="addService(item)" v-if="!item.showDobboServiceInput">+ 添加服务名称</el-button>
          </div>
          <div class="btn-div" v-if="dobboArr.indexOf(item.alert)>=0">
            <el-button type="text" @click="addServiceMethod(item)" v-if="!item.showDobboServiceMethodInput">+ 添加服务名称.方法名</el-button>
          </div>
        </div>
        <DubboTips v-if="dobboArr.indexOf(item.alert)>=0 && (item.showDobboServiceMethodInput && item.showDobboServiceInput)"/>

        <div class="gateway-box" style="margin-top:20px">
          <el-form-item :label="$t('policyPage.callbackAdd')" :prop="'rules.' + index + '.alarmCallbackUrl'" size="mini">
            <el-input v-model.trim="item.alarmCallbackUrl" 
            :placeholder="$t('policyPage.enterCallback')" style="width: 480px;"/>
          </el-form-item>
        </div>
      </el-form-item>
    </el-form>
    <el-button type="text" @click="addTarget">{{$t('addMetrics')}}</el-button>
  </div>
</template>
<script>
  import {mapState} from 'vuex'; 
  import StrategySelect from '@/components/form-item/StrategySelect.vue';
  import StrategySelectGroup from '@/components/form-item/StrategySelectGroup.vue';
  import alarmCommon from '@/components/alarm-template/url-alarm';
  import IfInclude from '@/components/alarm-template/IfInclude.vue';
  import IfInOut from '@/components/alarm-template/IfInOut.vue';
  import ManualBtns from '@/components/alarm-template/ManualBtns.vue'
  import AlarmTitle from '@/components/alarm-template/AlarmTitle.vue'
  import {testPromQL} from '@/pages/monitor/manual-target/test-proql.js';
  import  RemoveBtn from '@/components/alarm-template/RemoveBtn.vue'
  import  DubboTips from '@/components/alarm-template/DubboTips.vue'
  import AndSpan from '@/components/alarm-template/AndSpan.vue';
  import PromqlTitle from './components/PromqlTitle.vue';


export default {
  components:{
    StrategySelect,
    StrategySelectGroup,
    IfInclude,
    IfInOut,
    ManualBtns,
    AlarmTitle,
    RemoveBtn,
    DubboTips,
    AndSpan,
    PromqlTitle
  },
  props:{
    value:{},
    strategyType:{
      require: true
    },
    title:{
      require: true
    }
  },
  data(){
    return {
      groupOptions: [
        {
          label: '异常数',
          value: 'error_times',
        },
        {
          label: '可用性',
          value: 'availability',
        },
        {
          label: 'qps',
          value: 'qps',
        },
        {
          label: '平均耗时',
          value: 'time_cost',
        },
        {
          label: '慢查询',
          value: 'slow_times',
        },
      ],
      operatorOption: [{
          label:'>',
          value:'>'
        },{
          label:'<',
          value:'<'
        },{
          label:'=',
          value:'=='
        }],
        ErrCodeOptions:[{
          label:'4XX',
          value:'4xx'
        },{
          label:'5XX',
          value:'5xx'
        }],
      formInline:{
        rules:[]
      },
      rulesObj :{ required: true, message: ' ', trigger: 'blur'},
    }
  },
  computed:{
    ...mapState({
      presetMetrics: (state) => state.moduleStrategyList.presetMetrics, // 指标
      checkDataCount:  (state) => state.moduleStrategyList.checkDataCount, // 持续时间
      alarmLevels:  (state) => state.moduleStrategyList.alarmLevels, // 报警级别
      sendInterval:  (state) => state.moduleStrategyList.sendInterval, // 报警频率
      httpArr: (state) => state.moduleStrategyList.httpArr, 
      dobboArr: (state) => state.moduleStrategyList.dobboArr, 
      httpHasErrorCodeArr:  (state) => state.moduleStrategyList.httpHasErrorCodeArr, 
    }),
    rules:{
      get(){
        return this.value
      },
      set(newV){
        return newV
      }
    },
  },
  watch:{
    rules(newVal){
      this.formInline = {
        ...this.formInline,
        ...{rules: newVal}
      }
    }
  },
  methods:{
    testPromQL,
    // 默认指标判断条件数据
    defaultForm:alarmCommon.returnUrlDefault,
    addTarget(){
      this.formInline.rules.push(this.defaultForm())
      this.updateModel();
    },
    validateFn(sucFn,failFn){
      this.$refs['urlForm'].validate((valid) => {
        if (valid) {
          sucFn && sucFn();
          return true;
        } else {
          failFn && failFn();
          return false;
        }
      });
    },
    removeItem(index){
      this.formInline.rules.splice(index,1);
      this.updateModel();
    },
    updateModel(){
      this.$emit('input', this.formInline.rules);
    },
    addURL(item){
      item.showURLInput = !item.showURLInput;
      this.formInline.rules = [].concat(this.formInline.rules);
    },
    addErrCode(item){
      item.showErrCodeInput = !item.showErrCodeInput;
      this.formInline.rules = [].concat(this.formInline.rules);
    },
    addService(item){
      item.showDobboServiceInput = !item.showDobboServiceInput;
      this.formInline.rules = [].concat(this.formInline.rules);
    },
    addServiceMethod(item){ // 点击服务方法名
      item.showDobboServiceMethodInput = !item.showDobboServiceMethodInput;
      this.formInline.rules = [].concat(this.formInline.rules);
    }
  },
  mounted(){
    this.addTarget();
  },
}
</script>
<style scoped>
.url-alarm{
  font-size: 12px;
  border:solid 1px #d9d9d9;
  padding:20px;
}
.el-form .el-form-item{
  margin:0;
}
.el-form .el-form-item.item-box{
  background: #f5f7fa;
  padding: 20px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
}
.then-span{
  margin:0 2px;
}
.tips-content{
  line-height: 30px;
  padding-bottom:10px ;
}
.extra-options{
  padding-left:25px;
}
.extra-options >>> .el-button--text{
  padding:0;
  font-weight: 400;
}
.extra-options .btn-div{
  line-height:14px;
  margin-top:20px;
}
.tips{
  color:rgba(0,0,0,0.4);
}
.rule-title{
  display: inline-block;
  box-sizing: border-box;
  width: 126px;
  height:28px;
  line-height:28px;
  padding-left:12px;
  background: #f2f2f2;
  color: #555555;
  border: solid 1px #d9d9d9;
  vertical-align:top;
}
.add-box .strategy-input,.add-box .line-height-28 >>> .el-input--mini,.add-box .strategy-input,.add-box .line-height-28 >>>  .el-form-item__content {
  line-height: 28px;
}
.add-box .strategy-input,.add-box .strategy-input >>> .el-form-item__content,.strategy-input  .strategy-input-box >>> .el-input--small{
  width: 530px;
}

.strategy-input  .strategy-input-box >>> .el-textarea__inner{
  width: 100%;
}


.strategy-input .err-code-select >>> .el-input--small{
  width:100%;
}
.err-code-select >>> .el-select__tags .el-tag--light{
  position: relative;
  margin-right: 15px;
}
.err-code-select >>> .el-select__tags .el-tag--light+.el-tag--light::before{
  content:'or';
  position: absolute;
  left: -18px;
}
.add-box{
  margin:20px 0 0 0px;
}
.manual-input {
  padding: 20px 0;
}
.manual-input >>> .el-form-item__content,.manual-input >>> .el-form-item__content .el-textarea__inner,.manual-input {
  width: 100%;
}
.text-area-box{
  position: relative;
}
.test-promql{
  position: absolute;
  right: 5px;
  bottom: 3px;
  padding:0
}
.unit-span{
  display: inline-block;
  padding-left: 5px;
  background: #f3f4f7;
  border: solid 1px #d9d9d9;
  border-left: none;
  border-right: none;
  height: 28px;
  line-height: 28px;
  box-sizing: border-box;
  vertical-align: bottom;
  padding: 0 7px;
}
.gateway-box,.gateway-box >>> .el-form-item__content,.gateway-box >>> .el-form-item__label{
  line-height: 28px;
  height: 28px;
  vertical-align: top;
}
.jump-url >>> .el-form-item__content,.jump-url >>> .el-form-item__content .el-textarea__inner{
  width: 476px;
}
.jump-url-item{
  margin-top: 20px;
}
</style>