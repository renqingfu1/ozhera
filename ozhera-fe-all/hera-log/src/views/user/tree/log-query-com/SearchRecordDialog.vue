<!--
 * @Description:
 * @Date: 2022-04-13 16:25:55
 * @LastEditTime: 2022-05-06 14:58:07
-->
<template>
  <el-dialog
    title="保存查询"
    :visible.sync="dialogVisible"
    width="400px"
    :before-close="handleClose">
    <!-- 内容 -->
    <div class="record-dialog">
      <!-- 提示 -->
      <div class="tip">保存想要再次使用的查询文本和筛选。</div>
      <!-- 表单 -->
      <el-form :model="form" :label-position="labelPosition"
        :rules="rules" class="record-form" ref="recordForm">
        <!-- 名称 -->
        <el-form-item label="名称"  prop="name" >
          <el-input v-model="form.name"  :disabled="editInfo.id?true:false"></el-input>
          <span class="name-tip">“名称”必填。标题不能包含前导或尾随空格。名称必须唯一。</span>
        </el-form-item>
        <!-- 描述 -->
        <el-form-item label="描述"  prop="common">
          <el-input v-model="form.common" type="textarea" :rows="2"></el-input>
        </el-form-item>
        <!-- 包括时间筛选 -->
         <el-form-item prop="isFixTime">
          <el-switch class="switch-container"
            v-model="form.isFixTime" active-text="包括时间筛选">
          </el-switch>
        </el-form-item>
      </el-form>
    </div>
    <!-- 底部 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="save" :disabled="form.name?false:true">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  saveRecord, updateRecord,
} from '@/common/req/list/logConfig';

export default {
  name: 'SearchRecordDialog',
  props: {
    // 弹窗是否显示
    searchRecordDialog: {
      type: Boolean,
      default: false,
    },
    // 关闭记录弹窗
    closeRecordDialog: {
      type: Function,
      default: () => {},
    },
    storeId: {
      type: Number,
    },
    // 参数
    param: {
      type: String,
      default: '',
    },
    // 开始时间
    startTime: {
    },
    // 结束时间
    endTime: {
    },
    // 获取记录列表
    getRecordList: {
      type: Function,
      default: () => {},
    },
    // 编辑信息
    editInfo: {
      type: Object,
      default: () => ({}),
    },
    tailId: [],
  },
  computed: {
    tailIdProps() {
      return this.tailId;
    },
  },
  data() {
    return {
      dialogVisible: this.$props.searchRecordDialog, // 弹窗是否显示
      labelPosition: 'top', // 对齐方式：顶部对齐
      form: this.initFormData(), // 表单
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
      },
    };
  },
  // watch监听props的变化
  watch: {
    // 监听props里的数据变化
    searchRecordDialog: {
      handler(newValue) {
        this.dialogVisible = newValue;
        // 初始化表单数据
        this.form = this.initFormData();
      },
    },
  },
  methods: {
    initFormData() {
      const val = this.$props.editInfo;
      return {
        name: val.name || '', // 名称
        common: val.common || '', // 描述
        isFixTime: val.isFixTime === '1' || val.isFixTime === 1, // 包括时间筛选
      };
    },
    // 操作关闭
    handleClose() {
      this.dialogVisible = false;
      this.$props.closeRecordDialog();
    },
    // 保存
    save() {
      this.$refs.recordForm.validate((valid) => {
        if (valid) {
          const {
            param, startTime, endTime, editInfo,
          } = this.$props;
          const params = {
            id: editInfo.id,
            storeId: this.storeId,
            name: this.form.name,
            param,
            queryText: param,
            isFixTime: this.form.isFixTime ? '1' : '0',
            common: this.form.common,
            startTime,
            endTime,
            sort: 1,
            tailId: this.tailIdProps.join(','),
          };
          let req;
          if (this.$props.editInfo.id) { // 编辑操作
            req = updateRecord;
          } else {
            req = saveRecord;
          }
          return req(params).then((res) => {
            if (res && res.code === 0) {
              // 保存缓存
              sessionStorage.setItem('currentQueryName', this.form.name);
              // 保存成功
              this.handleClose();
              this.$emit('afterSaved');
            }
          });
        }
        // 没通过校验
        return false;
      });
    },
  },
};
</script>

<style lang="scss" >
.record-dialog{
  .tip{
    font-size: 16px;
    color: #69707d;
  }
  .record-form{
    padding-top: 20px;
    .el-input{
      width: 100%;
      .el-input__inner{
        border-radius: 4px!important;
      }
    }
    .el-textarea{
      width: 100%;
      .el-textarea__inner{
         border-radius: 4px!important;
      }
    }
    &.el-form--label-top .el-form-item__label{
      padding-bottom: 0px!important;
    }
    .name-tip{
      font-size: 12px;
    }
  }
}
//开关样式
.switch-container {
  .el-switch__core:before {
    font-size: 12px;
    content: "\2715";
    position: absolute;
    top: 0px;
    right: 6px;
    color: #fff;
  }
  &.el-switch.is-checked .el-switch__core:before {
    content: "\2713";
    position: absolute;
    top: 0px;
    left: 6px;
    color: #fff;
    text-align: left;
  }
}
</style>
