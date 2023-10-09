<template>
  <div class="url-alarm-box">
    <p class="tips-content">{{ $t('policyPage.ruleTips') }}</p>
    <el-form :model="formInline" ref="urlForm"  class="detail" inline>
      <el-form-item v-for="(item,index) in formInline.rules" :key="item.index"
        class="item-box"
        :class="(item.id && item.active) ? 'item-actvie-class' : 'item-inactive-class'"
      >
        <div 
          class="item-box-inner"
          v-loading="item.loading"
          element-loading-text="加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.5)">
          <div class="options-box-left big-check-box" v-if="!item.loading">
            <el-checkbox v-model="item.checked"></el-checkbox>
          </div>
          <el-form-item label="if" label-width="30px" :prop="'rules.' + index + '.alert'" :rules="rulesObj" >
            <StrategySelect v-model="item.alert" style="width:205px" :options="options" 
              :disabled="item.id?true:false" 
            />
          </el-form-item>
          <el-form-item :prop="'rules.' + index + '.op'" :rules="rulesObj" >
            <StrategySelect v-model="item.op" style="width:55px" :options="operatorOption" placeholder=""/>
          </el-form-item>
          <el-form-item  :prop="'rules.' + index + '.value'" :rules="rulesObj" >
            <el-input-number v-model.number="item.value"
            :controls="false" style="width: 100px;"
            :precision="2" :min="0.01" size="mini" />
            <span class="unit-span" v-if="options.filter(filteI=>filteI.value === item.alert).length>0 && options.filter(filteI=>filteI.value === item.alert)[0].unit.length>0">
              {{
                (options.filter(filteI=>filteI.value === item.alert))[0].unit ||'' 
              }}
            </span>
          </el-form-item>
          <el-form-item :prop="'rules.' + index + '.dataCount'"  :rules="rulesObj" 
          label="" >
            <StrategySelect v-model="item.dataCount" style="width:100px" :options="checkDataCount" />
          </el-form-item>
          <span class="then-span">then</span>
          <el-form-item :prop="'rules.' + index + '.priority'" :rules="rulesObj">
            <StrategySelect v-model="item.priority"  :options="alarmLevels" class="width90"/>
          </el-form-item>
          <el-form-item :prop="'rules.' + index + '.sendInterval'" :rules="rulesObj">
            <StrategySelect v-model="item.sendInterval" style="width:130px" :options="sendInterval"/>
          </el-form-item>
          <el-form-item  label="五分钟总体请求数 >" class="top20" v-if="item.alert.endsWith('availability')">
            <el-input-number v-model="item.basicNum" :controls="false" size="mini" :precision="0"></el-input-number>
          </el-form-item>
          <!-- 如果是普通用户则必填 -->
          <div class="top20">
            <el-form-item class="gateway-box" :prop="'rules.' + index + '.teslaGroup'" label="API分组" 
            :rules="{ required: $store.state.moduleUserInfo.userInfo.isAdmin ===false, message: ' ', trigger: 'blur'}" label-width="68px">
              <InternetGateway  v-model="item.teslaGroup" class="width435"/>
            </el-form-item>
          </div>
          <div class="top20">
            <el-form-item class="gateway-box api-url" :prop="'rules.' + index + '.teslaGroup'" label="API URL"  
            :rules="{ required: $store.state.moduleUserInfo.userInfo.isAdmin ===false, message: ' ', trigger: 'blur'}" label-width="68px">
              <IfInclude v-model="item.includeTeslaUrls" class="if-inclucde"/>
              <el-input  v-model="item.teslaUrls" placeholder="多个请用英文逗号分隔" size="mini" style="width:340px;vertical-align:top;"/>
              <PopMsg/>
            </el-form-item>
          </div>
          <div class="top20">
            <el-form-item class="gateway-box api-url" :prop="'rules.' + index + '.teslaPreviewEnv'" label="环境"  
            label-width="68px">
              <FilterEnv v-model="item.teslaPreviewEnv"/>
            </el-form-item>
          </div>
          <div class="top20 callback-url">
            <el-form-item :label="$t('policyPage.callbackAdd')" :prop="'rules.' + index + '.alarmCallbackUrl'" size="mini">
              <el-input v-model.trim="item.alarmCallbackUrl" 
              :placeholder="$t('policyPage.enterCallback')" class="width435"/>
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
import {mapState} from 'vuex'; 
import StrategySelect from '@/components/form-item/StrategySelect.vue';
import InternetGateway from '@/components/form-item/InternetGateway.vue'
import FilterEnv from './components/FilterEnv.vue';
import alarmCommon from '@/components/alarm-template/url-alarm';
import {testPromQL} from '@/pages/monitor/manual-target/test-proql.js';
import IfInclude from '@/components/alarm-template/IfInclude.vue';
import PopMsg from './PopMsg.vue';
import '@/components/alarm-template/rule-item/rule.less'; //公共rule样式
import {
  changeCheckAll,
  deleteMultiple,
  editItem,
  saveItem,
  removeItem,
  clickItem
} from '@/components/alarm-template/rule-item/rule-item.js';

export default {
  components:{
    StrategySelect,
    InternetGateway,
    PopMsg,
    IfInclude,
    FilterEnv
  },
  props:{
    value:{},
    title:{
      required: true
    },
    targetOptions:{},
    baseEditData:{
      required: true,
    },
    strategyType:{
      required: true
    }
  },
  data(){
    return {
      checkedAll:false,
      loadingMultiple:false,
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
      formInline:{
        rules:[]
      },
      rulesObj :{ required: true, message: ' ', trigger: 'blur'},
    }
  },
  computed:{
    ...mapState({
      checkDataCount:  (state) => state.moduleStrategyList.checkDataCount, // 持续时间
      alarmLevels:  (state) => state.moduleStrategyList.alarmLevels, // 报警级别
      sendInterval:  (state) => state.moduleStrategyList.sendInterval, // 报警频率
    }),
    rules:{
      get(){
        return this.value
      },
      set(newV){
        return newV
      }
    },
    options(){
      return this.targetOptions
    }
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
    defaultForm:alarmCommon.returnTeslaUrlDefault,
    retrunIncludeMethod:alarmCommon.retrunIncludeMethod,
    returnReqLabels:alarmCommon.returnReqLabels,
    returnTeslaReqLabels:alarmCommon.returnTeslaReqLabels,
    returnSingleRule:alarmCommon.returnSingleRule,
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
    updateModel(){
      this.$emit('input', this.formInline.rules);
    },
    changeCheckAll,
    deleteMultiple,
    editItem,
    saveItem,
    removeItem,
    clickItem,
  },
  mounted(){
    this.addTarget();
  },
}
</script>
<style scoped lang="less">
.api-url{
  ::v-deep .el-form-item__label{
    padding-right: 0;
  }
}
</style>
<style scoped>

.el-form .el-form-item{
  margin-bottom: 0px;
}
.el-form .el-form-item.item-box{
  background: #f5f7fa;
  padding: 0px;
  margin-bottom: 18px;
  width: 100%;
  box-sizing: border-box;
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

.strategy-input  .strategy-input-box >>> .el-textarea__inner{
  width: 100%;
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
.top20{
  margin-top: 20px;
}
.callback-url ::v-deep .el-form-item__content{
  vertical-align: middle;
}
.width435{
  width: 435px;
}
.width90{
  width:90px;
}
</style>