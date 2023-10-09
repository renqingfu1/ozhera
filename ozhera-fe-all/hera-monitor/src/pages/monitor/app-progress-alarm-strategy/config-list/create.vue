<template>
  <el-form
    size="mini"
    label-width="100px"
    :model="form"
    inline
    class="create-config"
    ref="ruleForm"
    :rules="rules"
    v-loading="loading"
  >
    <!-- <el-form-item label="流水线">
      <EnvSelect
        v-if="!form.id"
        v-model="envObj"
        :configedPipeLineId="configedPipeLineId"
      />
      <el-input
        v-else
        v-model="envObj.pipelineName"
        :disabled="true"
      ></el-input>
    </el-form-item> -->
    <el-form-item label="心跳类型" prop="type">
      <SelectType v-model="form.type" @change="changeType"/>
    </el-form-item>
    <template v-if="form.type==1">
      <el-form-item label="服务名" prop="service">
        <el-input v-model="form.service"></el-input>
      </el-form-item>
      <el-form-item label="Method" prop="method">
        <el-input v-model="form.method"></el-input>
      </el-form-item>
      <el-form-item label="Group">
        <el-input v-model="form.group"></el-input>
      </el-form-item>
      <el-form-item label="版本号">
        <el-input v-model="form.version"></el-input>
      </el-form-item>
    </template>
    <el-form-item label="请求路径" prop="path" v-if="form.type==0">
      <el-input v-model="form.path"></el-input>
    </el-form-item>
    <el-form-item label="报警组" prop="alertName">
      <AlarmGroupSelect v-model="form.alertName"></AlarmGroupSelect>
    </el-form-item>
    <el-form-item label="报警级别" prop="alertLevel">
      <LevelSelect v-model="form.alertLevel" />
    </el-form-item>
    <el-form-item label="报警触发次数" prop="alertMinCount">
        
      <el-input-number v-model="form.alertMinCount" :min="0" :precision="0"></el-input-number>
    </el-form-item>
    <el-form-item label="端口号" prop="port">
      <el-input
        v-model="form.port"
        label="端口号"
      ></el-input>
    </el-form-item>
    <el-form-item label="状态">
      <el-switch
        v-model="status"
        :active-value="0"
        :inactive-value="1"
      ></el-switch>
    </el-form-item>
    <div class="btn-box">
      <el-form-item>
        <el-button type="primary" @click="onSubmit('ruleForm')">{{$t('confirm')}}</el-button>
        <el-button @click="cancel">{{ this.$t('cancle'), }}</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>
<script>
// import EnvSelect from "./components/EnvSelect.vue"
import SelectType from "./components/SelectType"
import AlarmGroupSelect from "./components/AlarmGroupSelect"
import LevelSelect from "./components/LevelSelect"
import HeartBeatServer from "@/api/service/heart-beat.js"

export default {
  components: {
    // EnvSelect,
    SelectType,
    AlarmGroupSelect,
    LevelSelect,
  },
  props: {
    detailInfo: {},
    configedPipeLineId: {
      required: true,
      type: Array,
    },
  },
  data() {
    var validataService = (rule, value, callback) => {
      console.log("rule", rule, this)
      if (this.form.type === 1 && !value) {
        callback(new Error("此项为必填项"))
      } else {
        callback()
      }
    }
    var validataPort = (rule, value, callback) => {
      if (
        (this.form.type === 0 || this.form.type === 2) &&
        !value
      ) {
        callback(new Error("请输入端口号"))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      envObj: { id: "", pipelineName: "", type: "" },
      status: 1,
      form: {
        type: "",
        service: "",
        method: "",
        group: "",
        version: "",
        path: "",
        port: "",
        alertLevel: "",
        alertName: "",
        alertMinCount: 1,
      },
      rules: {
        type: [{ required: true, message:this.$t('policyPage.selectType'), trigger: "change" }],
        service: [{ validator: validataService, trigger: "change" }],
        method: [{ validator: validataService, trigger: "change" }],
        path: [{ required: true, message: "请输入请求路径", trigger: "change" }],
        alertName: [
          { required: true, message: "请选择报警组", trigger: "change" },
        ],
        alertLevel: [
          { required: true, message: "请选择报警级别", trigger: "change" },
        ],
        port: [{ validator: validataPort, trigger: "change" }],
      },
    }
  },
  mounted() {
    if (this.detailInfo.id) {
      this.form = {
        ...this.form,
        ...this.detailInfo.ivo,
        id: this.detailInfo.id,
      }
      this.status = this.detailInfo.status
      this.envObj = {
        ...this.envObj,
        id: this.detailInfo.projectEnvId,
        pipelineName: this.detailInfo.projectEnvName,
        type: this.detailInfo.source,
      }
    }
  },
  methods: {
    changeType(type){
      if(type != 1){
        this.form = {
          ...this.form,
          ...{
            service: '',
            group:'',
            method:'',
            version:'',
            path:''
          }
        }
      }
    },
    onSubmit(formName) {
      let self = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!self.envObj.id) {
            this.$message.warning("请选择流水线！")
            return
          }
          this.reqFun()
        } else {
          return false
        }
      })
    },
    reqFun() {
      let params = {
        ...{
          projectId: parseInt(this.$route.params.projectId),
          projectName: this.$route.params.projectName,
          projectEnvId: this.envObj.id,
          projectEnvName: this.envObj.pipelineName,
          source: this.envObj.type,
          status: this.status,
        },
        ivo: {
          ...this.form,
        },
        id: this.form.id,
      }
      this.loading = true
      const endApiName = this.form.id ? "editConfig" : "createConfig"
      HeartBeatServer[endApiName](params)
        .then(() => {
          this.loading = false
          this.$message.success("创建成功")
          this.cancel()
          this.$emit("refresh")
        })
        .catch(() => {
          this.loading = false
        })
    },
    cancel() {
      this.$emit("closeDialog")
    },
  },
}
</script>
<style lang="less" scoped>
.create-config {
  /deep/ .el-form-item__content,
  .el-select {
    width: 290px;
  }
}
.btn-box {
  text-align: center;
}
</style>
