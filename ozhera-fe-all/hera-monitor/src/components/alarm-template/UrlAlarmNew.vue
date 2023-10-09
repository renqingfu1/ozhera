<template>
  <div
    class="url-alarm-box"
  >
    <AlarmTitle :strategyType="ruleType" />
    <p class="tips-content">{{ $t('policyPage.ruleTips') }}</p>
    <el-form :model="formInline" ref="urlForm" class="detail" inline>
      <el-form-item
        v-for="(item, index) in formInline.rules"
        :key="`${index}-${item.id}`"
        class="item-box" 
        :class="(item.id && item.active) ? 'item-actvie-class' : 'item-inactive-class'"
      >
        <div class="options-box-left big-check-box" v-if="!item.loading">
          <el-checkbox v-model="item.checked"></el-checkbox>
        </div>
        <div 
          class="item-box-inner"
          v-loading="item.loading"
          element-loading-text="加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.5)">
          <el-form-item
            label="if"
            label-width="30px"
            :prop="'rules.' + index + '.alert'"
            :rules="rulesObj"
            v-if="ruleType != 2"
          >
            <StrategySelectGroup
              v-if="ruleType == 1"
              v-model="item.alert"
              :disabled="item.id?true:false"
              style="width:270px"
              :options="
                presetMetrics.filter(item => item.strategyType == ruleType)
              "
              groupBy="metricType"
              :groupOptions="groupOptions"
              :defaultGroup="
                (
                  presetMetrics.find(p => p.value === item.alert) || {
                    metricType: 'error_times',
                  }
                ).metricType
              "
            />
            <StrategySelect
              v-else
              v-model="item.alert"
              style="width: 205px"
              :disabled="item.id?true:false"
              :options="
                presetMetrics.filter(item => item.strategyType == ruleType)
              "
            />
          </el-form-item>
          <el-form-item
            :prop="'rules.' + index + '.op'"
            :rules="rulesObj"
            v-if="ruleType != 2 && !switchHideInput(item.alert)"
          >
            <StrategySelect
              v-model="item.op"
              style="width: 55px"
              :options="operatorOption"
              placeholder=""
            />
          </el-form-item>
          <el-form-item
            :prop="'rules.' + index + '.value'"
            :rules="rulesObj"
            v-if="ruleType != 2 && !switchHideInput(item.alert)"
          >
            <el-input-number
              v-model.number="item.value"
              :controls="false" 
              style="width: 100px"
              :precision="2"
              :min="0.01"
              size="mini"
            />
            <span
              class="unit-span"
              v-if="
                presetMetrics.filter(filteI => filteI.value === item.alert)
                  .length > 0 &&
                presetMetrics.filter(filteI => filteI.value === item.alert)[0]
                  .unit.length > 0
              "
            >
              {{
                presetMetrics.filter(filteI => filteI.value === item.alert)[0]
                  .unit || ""
              }}
            </span>
          </el-form-item>
          <PromqlTitle v-model="item.alert" :index="index" :strategyType="ruleType" 
          :disabled="item.id?true:false"/>
          <ManualBtns v-model="item.expr" v-if="ruleType == 2" />
          <el-form-item
            :prop="'rules.' + index + '.expr'"
            :rules="rulesObj"
            v-if="ruleType == 2"
            class="manual-input"
          >
            <div class="text-area-box">
              <el-input
                v-model.trim="item.expr"
                style="width: 100%"
                type="textarea"
                :rows="4"
                placeholder="请输入自定义PromQL表达式"
              />
              <el-button
                type="text"
                style="font-weight: normal"
                v-if="item.expr && item.expr.length > 0"
                @click="testPromQL(item.expr)"
                class="test-promql"
                >{{ $t('metricPage.testPromQL') }}</el-button
              >
            </div>
          </el-form-item>
          <el-form-item
            :prop="'rules.' + index + '.dataCount'"
            :rules="rulesObj"
            :label="ruleType == 2 ? 'if 自定义PromQL表达式' : ''"
          >
            <StrategySelect
              v-model="item.dataCount"
              style="width: 100px"
              :options="checkDataCount"
            />
          </el-form-item>
          <span class="then-span">then</span>
          <el-form-item
            :prop="'rules.' + index + '.priority'"
            :rules="rulesObj"
          >
            <StrategySelect
              v-model="item.priority"
              style="width: 62px"
              :options="alarmLevels"
            />
          </el-form-item>
          <el-form-item
            :prop="'rules.' + index + '.sendInterval'"
            :rules="rulesObj"
          >
            <StrategySelect
              v-model="item.sendInterval"
              style="width: 130px"
              :options="sendInterval"
            />
          </el-form-item>
          <!-- URL部分 -->
          <div
            v-if="item.showURLInput && httpArr.indexOf(item.alert) >= 0"
            class="add-box"
          >
            <AndSpan />
            <span class="rule-title">URL</span>
            <IfInclude v-model="item.includeUrl"  />
            <el-form-item
              :prop="'rules.' + index + '.urls'"
              class="strategy-input"
              :rules="rulesObj"
            >
              <el-input
                placeholder="请输入要配置的URL地址，多个请换行分隔（支持通配符，如配置通配符请使用 .* 替代 *，如/abc/def.* ，不可直接写/abc*，否则无法通配）"
                class="strategy-input-box"
                type="textarea"
                :rows="5"
                v-model="item.urls"
                style="width:500px"
              >
              </el-input>
            </el-form-item>
            <RemoveBtn @click="addURL(item)" />
          </div>
          <!-- ErrorCode部分 -->
          <div
            v-if="
              item.showErrCodeInput &&
              httpHasErrorCodeArr.indexOf(item.alert) >= 0
            "
            class="add-box"
          >
            <AndSpan />
            <span class="rule-title">errorCode</span>
            <IfInclude v-model="item.includeErrCode"  />
            <el-form-item
              :prop="'rules.' + index + '.errCode'"
              class="strategy-input line-height-28"
              :rules="rulesObj"
            >
              <el-select
                v-model="item.errCode"
                multiple
                :placeholder="$t('pleaseSel')"
                class="err-code-select"
                size="mini"
                style="width:500px"
              >
                <el-option
                  v-for="item in ErrCodeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <RemoveBtn @click="addErrCode(item)" />
          </div>
          <!-- dubbo服务名 -->
          <div
            v-if="
              item.showDobboServiceInput && dobboArr.indexOf(item.alert) >= 0
            "
            class="add-box"
          >
            <AndSpan />
            <span class="rule-title">服务名称</span>
            <IfInOut v-model="item.includeDobboService" />
            <el-form-item
              :prop="'rules.' + index + '.dobboService'"
              class="strategy-input line-height-28"
              :rules="rulesObj"
            >
              <el-input
                placeholder="请输入服务名，多个请用英文逗号分隔"
                size="mini"
                class="strategy-input-box"
                v-model="item.dobboService"
                style="width:500px;"
              >
              </el-input>
            </el-form-item>
            <RemoveBtn @click="addService(item)" />
          </div>
          <!-- dubbo服务名-方法名 -->
          <div
            v-if="
              item.showDobboServiceMethodInput &&
              dobboArr.indexOf(item.alert) >= 0
            "
            class="add-box"
          >
            <AndSpan />
            <span class="rule-title">服务方法名</span>
            <IfInOut
              v-model="item.includeDobboServiceMethod"
              
            />
            <el-form-item
              :prop="'rules.' + index + '.dobboServiceMethod'"
              class="strategy-input line-height-28"
              :rules="rulesObj"
            >
              <el-input
                placeholder="请输入服务名，多个请用英文逗号分隔"
                size="mini"
                style="width:500px;"
                class="strategy-input-box"
                v-model="item.dobboServiceMethod"
              >
              </el-input>
            </el-form-item>
            <RemoveBtn @click="addServiceMethod(item)" />
          </div>
          <div class="jump-url" v-if="ruleType == 2">
            <el-form-item
              label="跳转URL"
              :prop="'rules.' + index + '.alarmDetailUrl'"
              class="jump-url-item"
            >
              <el-input
                v-model.trim="item.alarmDetailUrl"
                style="width: 100%"
                type="textarea"
                :rows="2"
                placeholder="请输入跳转URL"
              />
            </el-form-item>
            <div></div>
            <el-form-item
              label="规则描述"
              :prop="item.remark"
              class="jump-url-item"
            >
              <el-input
                v-model.trim="item.remark"
                placeholder="请输入规则描述"
              />
            </el-form-item>
          </div>
          <div class="extra-options">
            <div v-if="httpArr.indexOf(item.alert) >= 0">
              <div class="btn-div" v-if="!item.showURLInput">
                <el-button type="text" @click="addURL(item)"
                  >+ 添加URL</el-button
                >
                <span class="tips">，如不添加则对所有URL生效</span>
              </div>
              <div
                class="btn-div"
                v-if="
                  !item.showErrCodeInput &&
                  httpHasErrorCodeArr.indexOf(item.alert) >= 0
                "
              >
                <el-button type="text" @click="addErrCode(item)"
                  >+ 添加errorCode</el-button
                >
              </div>
            </div>
            <div class="btn-div" v-if="dobboArr.indexOf(item.alert) >= 0">
              <el-button
                type="text"
                @click="addService(item)"
                v-if="!item.showDobboServiceInput"
                >+ 添加服务名称</el-button
              >
            </div>
            <div class="btn-div" v-if="dobboArr.indexOf(item.alert) >= 0">
              <el-button
                type="text"
                @click="addServiceMethod(item)"
                v-if="!item.showDobboServiceMethodInput"
                >+ 添加服务名称.方法名</el-button
              >
            </div>
          </div>
          <DubboTips
            v-if="
              dobboArr.indexOf(item.alert) >= 0 &&
              item.showDobboServiceMethodInput &&
              item.showDobboServiceInput
            "
          />
          <div class="gateway-box rule-item-box" >
            <el-form-item
              :label="$t('policyPage.callbackAdd')"
              :prop="'rules.' + index + '.alarmCallbackUrl'"
              size="mini"
            >
              <el-input
                v-model.trim="item.alarmCallbackUrl"
                :placeholder="$t('policyPage.enterCallback')"
                style="width: 480px"
              />
            </el-form-item>
          </div>
          <div class="gateway-box rule-item-box" v-if="httpClientArr.indexOf(item.alert) >= 0">
            <el-form-item label="过滤域名" size="mini">
              <IncludeOrExcept v-model="item.includeDomain"  />
              <ContainDomain v-model="item.containDomain" :app="appProp"/>
              <span class="tips mini-tips">若此下拉选项无数据，请检查报警应用是否填写</span>
            </el-form-item>
          </div>
          <div v-if="!item.active && item.id" 
          class="item-inner-inactive" @click="clickItem(item)"></div>
        </div>
        <ul class="options-box" v-show="!item.loading">
          <li @click="removeItem(item, index)"> 
            <i class="options-btn el-icon-circle-close"/>
            <span class="options-text">
              {{ $t('remove') }}
            </span>  
          </li>
          <li v-if="!item.active && item.id" @click="editItem(item,index)">
            <i class="options-btn el-icon-edit" />
            <span class="options-text">{{ $t('edit') }}</span>  
          </li>
          <li  v-if="item.active && item.id" @click="saveItem(item,index)">
            <i class="options-btn  el-icon-success"/>
            <span class="options-text">保存</span>  
          </li>
        </ul>
      </el-form-item>
    </el-form>
    <div class="big-check-box multiple-delete" >
      <el-checkbox v-model="checkedAll" @change="changeCheckAll" style="z-index:10">{{ $t('selectAll') }}</el-checkbox> 
      <el-button 
        type="text" 
        @click="deleteMultiple" 
        style="margin-left:15px;" 
        v-loading="loadingMultiple"
      >{{$t('bulkDel')}}</el-button>
      <el-button type="text" @click="addTarget">{{$t('addMetrics')}}</el-button>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex"
import StrategySelect from "@/components/form-item/StrategySelect.vue"
import StrategySelectGroup from "@/components/form-item/StrategySelectGroup.vue"
import alarmCommon from "@/components/alarm-template/url-alarm"
import IfInclude from "@/components/alarm-template/IfInclude.vue"
import IfInOut from "@/components/alarm-template/IfInOut.vue"
import ManualBtns from "@/components/alarm-template/ManualBtns.vue"
import AlarmTitle from "@/components/alarm-template/AlarmTitle.vue"
import { testPromQL } from "@/pages/monitor/manual-target/test-proql.js"
import RemoveBtn from "@/components/alarm-template/RemoveBtn.vue"
import DubboTips from "@/components/alarm-template/DubboTips.vue"
import AndSpan from "@/components/alarm-template/AndSpan.vue"
 import '@/components/alarm-template/rule-item/rule.less'; //公共rule样式
import {
  changeCheckAll,
  deleteMultiple,
  editItem,
  saveItem,
  removeItem,
  clickItem,
} from '@/components/alarm-template/rule-item/rule-item.js';
import PromqlTitle from './components/PromqlTitle.vue';
import ContainDomain from './components/ContainDomain.vue';
import IncludeOrExcept from '@/components/alarm-template/components/IncludeOrExcept.vue';

export default {
  components: {
    StrategySelect,
    StrategySelectGroup,
    IfInclude,
    IfInOut,
    ManualBtns,
    AlarmTitle,
    RemoveBtn,
    DubboTips,
    AndSpan,
    PromqlTitle,
    ContainDomain,
    IncludeOrExcept
  },
  props: {
    value: {},
    strategyType: {
      require: true,
    },
    baseEditData:{
      require: true,
    },
    app:{}
  },
  data() {
    return {
      loadingMultiple:false,
      checkedAll:false,
      groupOptions: [
        {
          label: "异常数",
          value: "error_times",
        },
        {
          label: "可用性",
          value: "availability",
        },
        {
          label: "qps",
          value: "qps",
        },
        {
          label: "平均耗时",
          value: "time_cost",
        },
        {
          label: "慢查询",
          value: "slow_times",
        },
      ],
      operatorOption: [
        {
          label: ">",
          value: ">",
        },
        {
          label: "<",
          value: "<",
        },
        {
          label: "=",
          value: "==",
        },
      ],
      ErrCodeOptions: [
        {
          label: "4XX",
          value: "4xx",
        },
        {
          label: "5XX",
          value: "5xx",
        },
      ],
      formInline: {
        rules: [],
      },
      rulesObj: { required: true, message: " ", trigger: "blur" },
      
    }
  },
  computed: {
    ...mapState({
      presetMetrics: state => state.moduleStrategyList.presetMetrics, // 指标
      checkDataCount: state => state.moduleStrategyList.checkDataCount, // 持续时间
      alarmLevels: state => state.moduleStrategyList.alarmLevels, // 报警级别
      sendInterval: state => state.moduleStrategyList.sendInterval, // 报警频率
      httpArr: state => state.moduleStrategyList.httpArr,
      dobboArr: state => state.moduleStrategyList.dobboArr,
      httpHasErrorCodeArr: state =>state.moduleStrategyList.httpHasErrorCodeArr,
      httpClientArr: state =>state.moduleStrategyList.httpClientArr,
    }),
    rules: {
      get() {
        return this.value
      },
      set(newV) {
        return newV
      },
    },
    ruleType(){
      return this.strategyType;
    },
    appProp(){
      return this.app;
    }
  },
  watch: {
    rules(newVal) {
      this.formInline = {
        ...this.formInline,
        ...{ rules: newVal },
      }
    },
  },
  methods: {
    retrunIncludeMethod:alarmCommon.retrunIncludeMethod,
    returnReqLabels:alarmCommon.returnReqLabels,
    returnTeslaReqLabels:alarmCommon.returnTeslaReqLabels,
    returnSingleRule:alarmCommon.returnSingleRule,
    returnCode:alarmCommon.returnCode,
    testPromQL,
    returnStr:alarmCommon.returnStr,
    // 默认指标判断条件数据
    defaultForm: alarmCommon.returnUrlDefault,
    switchHideInput(alert){
      let options = this.presetMetrics;
      let filterData = options.filter(option => option.value == alert);
      return  (filterData && filterData[0]?.hideValueConfig==true) ?true:false
    },
    addTarget() {
      this.formInline.rules.push(this.defaultForm())
      this.updateModel()
    },
    validateFn(sucFn, failFn) {
      this.$refs["urlForm"].validate(valid => {
        if (valid) {
          sucFn && sucFn()
          return true
        } else {
          failFn && failFn()
          return false
        }
      })
    },
    updateModel() {
      this.$emit("input", this.formInline.rules)
    },
    addURL(item) {
      item.showURLInput = !item.showURLInput
      this.formInline.rules = [].concat(this.formInline.rules)
    },
    addErrCode(item) {
      item.showErrCodeInput = !item.showErrCodeInput
      this.formInline.rules = [].concat(this.formInline.rules)
    },
    addService(item) {
      item.showDobboServiceInput = !item.showDobboServiceInput
      this.formInline.rules = [].concat(this.formInline.rules)
    },
    addServiceMethod(item) {
      // 点击服务方法名
      item.showDobboServiceMethodInput = !item.showDobboServiceMethodInput
      this.formInline.rules = [].concat(this.formInline.rules)
    },
    clickItem,
    editItem,
    saveItem,
    removeItem,
    changeCheckAll,
    deleteMultiple,
  },
  mounted() {
    this.addTarget();
    // this.
  },
}
</script>
<style scoped>
.el-form .el-form-item {
  margin-bottom: 0px;
}
.el-form .el-form-item.item-box {
  background: #f5f7fa;
  padding: 0px;
  margin-bottom: 18px;
  width: 100%;
  box-sizing: border-box;
}


.tips-content {
  line-height: 30px;
  padding-bottom: 10px;
}
.extra-options {
  padding-left: 25px;
}
.extra-options >>> .el-button--text {
  padding: 0;
  font-weight: 400;
}
.extra-options .btn-div {
  line-height: 14px;
  margin-top: 20px;
}
.tips {
  color: rgba(0, 0, 0, 0.4);
}
.mini-tips{
  font-size: 12px;
  margin-left: 3px;
}
.rule-title {
  display: inline-block;
  box-sizing: border-box;
  width: 126px;
  height: 28px;
  line-height: 28px;
  padding-left: 12px;
  background: #f2f2f2;
  color: #555555;
  border: solid 1px #d9d9d9;
  vertical-align: top;
}

.strategy-input .strategy-input-box >>> .el-textarea__inner {
  width: 100%;
}
.strategy-input .err-code-select >>> .el-input--small {
  width: 100%;
}
.err-code-select >>> .el-select__tags .el-tag--light {
  position: relative;
  margin-right: 15px;
}
.err-code-select >>> .el-select__tags .el-tag--light + .el-tag--light::before {
  content: "or";
  position: absolute;
  left: -18px;
}
.add-box {
  margin: 20px 0 0 0px;
}
.manual-input {
  padding: 20px 0;
}
.manual-input >>> .el-form-item__content,
.manual-input >>> .el-form-item__content .el-textarea__inner,
.manual-input {
  width: 100%;
}
.text-area-box {
  position: relative;
}
.test-promql {
  position: absolute;
  right: 5px;
  bottom: 3px;
  padding: 0;
}

.gateway-box,
.gateway-box >>> .el-form-item__content,
.gateway-box >>> .el-form-item__label {
  line-height: 28px;
  vertical-align: top;
}
.jump-url >>> .el-form-item__content,
.jump-url >>> .el-form-item__content .el-textarea__inner {
  width: 476px;
}
.jump-url-item {
  margin-top: 20px;
}
.rule-item-box{
  margin-top:15px;
}
</style>