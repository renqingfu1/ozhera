<template>
  <div>
    <MiBack :text="`${$route.query.id?$t('edit'):$t('create')}${$t('policyPage.appAlarmTemp')}`" @click="goPageName"/>
    <div class="content">
      <ITitle :title="$t('policyPage.basiceInfo')" style="padding: 0 0 10px 0" />
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        label-position="left"
        size="small"
        class="create-template-form"
      >
        <el-form-item
          :label="$t('policyPage.TempName')" 
          prop="template.name"
          :rules="{
            required: true,
            message: $t('policyPage.enterTempName'),
            trigger: 'blur',
          }"
        >
          <el-input
            v-model="form.template.name"
            maxlength="20"
            :placeholder="$t('policyPage.enterTempName')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('remark')"  prop="template.remark">
          <el-input
            type="textarea"
            v-model="form.template.remark"
            maxlength="100"
            placeholder="请输入模板备注（选填）"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('policyPage.monitoringType')" prop="template.strategyType">
          <StrateryTypesTem v-model="form.template.strategyType" 
          :disabled="$route.query.id?true:false" @changeType="changeStrategyType"/>
        </el-form-item>
        <el-form-item :label="$t('trigger')">
          <div class="template-box" v-if="form.template.strategyType ==0" >
            <UrlAlarm v-model="form.alarmRules" ref="0AlarmDom" :strategyType="form.template.strategyType" title="指标报警"/>
          </div>
          <div class="template-box" v-if="form.template.strategyType ==1" >
            <UrlAlarm v-model="form.alarmRules" ref="1AlarmDom" :strategyType="form.template.strategyType" title="接口报警"/>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSubmit">{{$t('confirm')}}</el-button>
          <el-button @click="goPageName">{{ this.$t('cancle'), }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import ITitle from "@/components/i-title/index"
import StrateryTypesTem from "@/components/form-item/StrateryTypesTem.vue"
import server from "@/api/service/alarm-template"
import UrlAlarm from '@/components/alarm-template/UrlAlarm.vue';
import { mapActions } from "vuex"
import alarmCommon from '@/components/alarm-template/url-alarm';
import serverTemplate from "@/api/service/alarm-template";
import MiBack from '@/components/mi-back.vue'

export default {
  name: "create-alarm-template",
  components: {
    ITitle,
    StrateryTypesTem,
    UrlAlarm,
    MiBack
  },
  data() {
    return {
      loading: false, // 加载状态
      trigger: 1, // 触发条件
      templateId: "", // 选中集成模板
      form: {
        template:{
          name: "", // 模版名称
          remark: "", // 模版备注
          strategyType: "0",
        },
        alarmRules: [], // 指标报警规则模板
      },
      templateOptions: [], // 常用基础模板
      templateDetail: "", // 模板详情数据
    }
  },
  computed: {
    isEdit() {
      return !!this.$route.query.id
    },
  },
  mounted() {
    this.GETSTRATEGYOPTIONTEM(); // 获取策略类型
    this.GETRUlESOPTION(); // 获取报警规则下拉选项
    if(this.$route.query.id){
      this.getTemplateData(this.$route.query.id);
    }
  },
  methods: {
    ...mapActions("moduleStrategyList", ["GETSTRATEGYOPTIONTEM","GETRUlESOPTION"]),
    returnStr:alarmCommon.returnStr,
    returnCode:alarmCommon.returnCode,
    returnUrlDefault:alarmCommon.returnUrlDefault,
    returnUrlDetail:alarmCommon.returnUrlDetail,
    returnReqLabels:alarmCommon.returnReqLabels,
    retrunIncludeMethod:alarmCommon.retrunIncludeMethod,
    // 确定提交事件
    onSubmit() {// 表单校验
      this.$refs.form.validate(() => {
        if(!this.form.template.name){
          return false;
        }
        this.$refs[`${this.form.template.strategyType}AlarmDom`].validateFn(()=>{
          this.submitFn();
        },()=>{
          console.log('校验失败');
        }); 
      });
    },
    getTemplateData(id) {
      const param = {id} // 模板 id
      serverTemplate.getTemplateDetail(param).then(res => {
        let alarmRules = res.alarmRules.map((item)=>{
            return this.returnUrlDetail(item)
        })
        this.form = {
          ...{template:{...this.form.template,...res.template}},
          alarmRules
        }
      });
    },
    submitFn() { // 提交保存
      this.loading = true;
      let serveName = this.$route.query.id?server.editAlarmTemplate:server.addAlarmTemplate;
      let reqParams = {
        ...this.form,
        ...{
          alarmRules:this.form.alarmRules.map((item)=>{
            return  {
              ...item,
              ...{
                labels:this.returnReqLabels(item)
              }
            }
          })
        }
      }
      serveName(reqParams).then(()=>{
        this.loading = false;
        this.$router.push({name:'appAlarmTemplate'})
      }).catch(err=>{
        this.loading = false;
        console.log('err', err);
      })
    },
    changeStrategyType(){
      this.templateId = null;
      this.form={
        ...this.form,
        ...{
          alarmRules :[
            this.returnUrlDefault()
          ],
        }
      };
    },
    // 单选框选中值变化时触发的事件
    changeTrigger(val) {
      if (val === 1) {
        this.form.alarmRules = this.templateDetail // 指标报警规则模板
      } else {
        this.form.alarmRules = [ this.returnUrlDefault()] // 指标报警规则模板
      }
    },
    // 获取指标报警规则模板数据
    getAlarmTemplateData(data) {
      this.form.alarmRules = data
    },
    // 跳转页面
    goPageName() {
      this.$router.push({ name: "appAlarmTemplate" }) // 跳转到
    },
  },
}
</script>
<style scoped>
.content >>> .el-input--small {
  width: 300px;
  max-width: 100%;
}
</style>
<style lang="less" scoped>
.content {
  margin: 20px;
  padding: 20px;
  color: #666;
  background: #fff;
}
</style>
<style scoped>
.create-template-form
  >>> .el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  content: "";
}
.create-template-form >>> .el-form-item__label{
  color:#aaa;
}
.template-box{
  min-width: 920px;
}
</style>
