<template>
  <div :class="['template_wrap', {'border': border}]">
    <div class="title">{{title}}</div>
    <div class="tips-content">
      满足以下任意指标判断条件时，触发报警
    </div>
    <div class="content" v-for="(item, index) in form.data" :key="index">
      <el-form ref="form"
           v-for="(item2, index2) in item"
           :key="`form${index2}`"
           :model="item2"
           label-width="70px"
           label-position="right"
           size="mini"
           :inline="true">
        <el-form-item :label="index2 ? 'else if' : 'if'"
                      prop="alert"
                      :rules="{ required: true, message: ' ', trigger: 'blur'}">
          <el-select v-model="item2.alert"
                     :placeholder="$t('pleaseSel')"
                     filterable
                     :disabled="disabledChange(index2, 'alert', item)"
                     style="width: 200px">
            <el-option
                v-for="itemOption in optionChange(index, 'alert', form.data, optionParams.presetMetrics)"
                :key="`trigger${itemOption.value}`"
                :label="itemOption.label"
                :value="itemOption.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="op"
                      :rules="{ required: true, message: ' ', trigger: 'blur'}">
          <el-select v-model="item2.op"
                     placeholder=""
                     clearable
                     filterable
                     style="width: 50px">
            <el-option
                v-for="itemOption in operatorOption"
                :key="itemOption"
                :label="itemOption"
                :value="itemOption">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="value"
                      :rules="{ required: true, message: ' ', trigger: 'blur'}">
          <el-input-number v-model.number="item2.value"
                           controls-position="right"
                           style="width: 100px"
                           :precision="2"
                           :min="0.01" /><span class="right-unit">
          {{ getDataName(item2.alert, optionParams.presetMetrics, 'value', 'unit') == 'percent' ? '%' : '' }}
        </span>
        </el-form-item>
        <el-form-item prop="dataCount"
                      :rules="{ required: true, message: ' ', trigger: 'blur'}">
          <el-select v-model="item2.dataCount"
                     placeholder=""
                     clearable
                     filterable
                     style="width: 120px">
            <el-option
                v-for="itemOption in optionParams.checkDataCount"
                :key="`trigger2${itemOption.value}`"
                :label="itemOption.label"
                :value="Number(itemOption.value)">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="then"
                      label-width="50px"
                      prop="priority"
                      :rules="{ required: true, message: ' ', trigger: 'blur'}">
          <el-select v-model="item2.priority"
                     placeholder=""
                     clearable
                     filterable
                     style="width: 60px">
            <el-option
                v-for="itemOption in optionParams.alarmLevels"
                :key="`trigger2${itemOption.value}`"
                :label="itemOption.label"
                :value="itemOption.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sendInterval"
                      :rules="{ required: true, message: ' ', trigger: 'blur'}">
          <el-select v-model="item2.sendInterval"
                     placeholder=""
                     clearable
                     filterable
                     style="width: 150px">
            <el-option
                v-for="itemOption in optionParams.sendInterval"
                :key="`trigger2${itemOption.value}`"
                :label="itemOption.label"
                :value="itemOption.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="addItem(index)" v-if="index2 === 0">
            <i class="el-icon-circle-plus-outline" style="font-size: 20px" />
          </el-button>
          <el-button type="text" @click="removeItem(index, index2)" v-else>
            <i class="el-icon-remove-outline" style="font-size: 20px" />
          </el-button>
          <el-button type="text" @click="removeTarget(index)" v-if="index2 === 0 && form.data.length > 1">
            <i class="el-icon-remove-outline" style="font-size: 20px" />
          </el-button>
        </el-form-item>
        <!-- 如果是普通用户则必填 -->
        <div v-if="item2.alert ==='tesla_outnet_availability'|| 
            item2.alert ==='china_intranet_tesla_p99_time_cost' || 
            item2.alert ==='tesla_intranet_availability'">
          <el-form-item class="gateway-box" prop="labels" label="API分组" :rules="{ required: $store.state.moduleUserInfo.userInfo.isAdmin ===false, message: ' ', trigger: 'blur'}" label-width="68px">
            <InternetGateway 
            v-model="item2.labels"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
   
    <el-button type="text" @click="addTarget">{{$t('addMetrics')}}</el-button>
  </div>
</template>

<script>
import server from "@/api/service/alarm-template";
import { getDataName } from '@/utils/index';
import InternetGateway from '@/components/form-item/InternetGateway.vue'


// 默认指标判断条件数据
const defaultForm = () => {
  return {
    alert: '', // 规则名称
    priority: '', // 报警优先级
    op: '', // 比较运算符> < =
    value: '', // 阈值
    sendInterval: '', // 报警频率
    dataCount: '', // 最近n个数据点
    labels: '', // tesla网关
  }
}
export default {
  components:{InternetGateway},
  name: 'alarm-template-components',
  props: {
    title: {
      type: String,
      default: '指标报警'
    },
    border: {
      type: Boolean,
      default: false
    },
    data: Array
  },
  watch: {
    data: {
      handler(newValue) {
        if (newValue && newValue.length) {
          this.dataChange(newValue) // 模板数据处理
        } else {
          this.form.data = [[defaultForm()]] // 触发条件
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      optionParams: {}, // 报警规则下拉列表数据
      operatorOption: ['>', '<', '='],
      form: {
        data: [[defaultForm()]] // 触发条件
      },
      getDataName: getDataName
    }
  },
  created() {
    this.getRulesOption(); // 获取报警规则下拉列表数据
  },
  methods: {
    // 获取报警规则下拉列表数据
    getRulesOption() {
      server.getRulesOption().then(res => {
        if (res) {
          this.optionParams = res // 报警规则下拉列表数据
        }
      });
    },
    // 表单校验
    validateFn() {
      let isValid = true;
      this.$refs.form.forEach(form => {
        form.validate((valid) => {
          if (!valid) {
            isValid = valid
          }
        })
      })
      if (isValid) {
        const newData = this.form.data.flat(2);
        this.$emit('getData', newData)
      }
      return isValid
    },
    // 添加指标
    addTarget() {
      this.form.data.push([defaultForm()]);
    },
    // 移除指标
    removeTarget(i) {
      this.form.data.splice(i, 1);
    },
    // 添加指标报警条件
    addItem(i) {
      this.form.data[i].push(defaultForm());
    },
    // 移除指标报警条件
    removeItem(i, i2) {
      this.form.data[i].splice(i2, 1);
    },
    // 模板数据处理
    dataChange(data) {
      let nData = [];
      let index = -1
      let obj = {}
      data.forEach(item => {
        const val = item.alert;
        if (obj[val] !==0 && !obj[val]) {
          index++
          obj[val] = index
        }
        nData[index] ? nData[index].push(item) : nData.push([item])
      })
      this.form.data = nData
    },
    // 报警条件处理
    optionChange(index, key, data, option) {
      if (!option || !option.length) {
        return false
      }
      const arr = []
      data.forEach((item, i) => {
        if (i !== index) {
          arr.push(item[0][key])
        }
      })
      // 下拉选项去掉已选中选项
      const arr2 = [];
      option.forEach(item2 => {
        if (!arr.includes(item2.value)) {
          arr2.push(item2)
        }
      })
      return arr2
    },
    // 指标选中if第一个条件后其他else if第一个条件禁用
    disabledChange(index, key, data) {
      const d = data.find(item => item[key]);
      if (d && d[key]) {
        data.forEach(item => {
          item[key] = d[key]
        })
        return  index ? true : false
      }
      return false
    }
  }
}
</script>
<style scoped>
.template_wrap >>> .el-input__inner {
  padding-left: 10px;
}
.template_wrap >>> .el-input__prefix {
  color: #444;
}
.template_wrap >>> .el-input--prefix .el-input__inner {
  padding-left: 20px;
}
.template_wrap >>> .el-input__suffix {
  right: 0;
}
.template_wrap >>> .el-form--inline {
  padding-bottom: 15px;
}
.template_wrap >>> .el-form--inline .el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
.template_wrap >>> .el-form--inline .el-form-item__label {
  text-align: right;
}
</style>

<style scoped lang="less">
.template_wrap {
  font-size: 12px;
  color: #555;
  overflow: hidden;
  overflow-x: auto;
  .title {
    font-size: 14px;
    font-weight: 650;
    color: rgba(0, 0, 0, 0.847058823529412);
  }
  &.border {
    padding: 10px 20px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
  }
  .tips-content {
    padding-bottom: 10px;
  }
  .content {
    padding: 20px 10px 0 10px;
    margin-bottom: 10px;
    background: #f5f7fa;
    .right-unit {
      display: inline-block;
      padding-left: 5px;
      font-size: 12px;
      line-height: 26px;
      //border: 1px solid #DCDFE6;
      //border-left: 0;
    }
  }
  a {
    color: #409EFF;
  }
}
.gateway-box{
  padding-left: 70px;
}
</style>
