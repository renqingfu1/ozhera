<template>
  <el-dialog :visible.sync="isShow" append-to-body width="480px">
    <div slot="title" class="space__title">
      {{ type === "newCreate" ? $t('create') : $t('edit') }} Space
    </div>
    <el-form
      :inline="true"
      :model="formInline"
      :rules="rules"
      ref="ruleForm"
      class="dialog-form-inline"
      label-width="110px"
    >
      <el-form-item :label="`Space ${$t('name')}:`" prop="spaceName">
        <el-input v-model="formInline.spaceName" size="small" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item :label="`Space ${$t('remark')}:`" prop="description">
        <el-input
          v-model="formInline.description"
          type="textarea"
          :autosize="{minRows: 3}"
          size="small"
          placeholder="请输入描述"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="switchShow" size="small">{{ $t('cancle') }}</el-button>
      <el-button type="primary" @click="onSubmit('ruleForm')" size="small">
        {{$t('confirm')}}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addSpace, getSpace, updateSpace } from '@/common/req/list/logConfig';

export default {
  data() {
    return {
      isShow: false,
      type: 'newCreate',
      formInline: {
        spaceName: '',
        description: '',
      },
      rules: {
        spaceName: [{ required: true, message: '请输入Space 名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入Space 描述', trigger: 'blur' }],
      },
    };
  },
  methods: {
    switchShow() {
      this.isShow = !this.isShow;
    },
    newCreate() {
      this.type = 'newCreate';
      this.isShow = !this.isShow;
      this.formInline = {
        spaceName: '',
        description: '',
      };
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitFn();
          return true;
        }
        return false;
      });
    },
    submitFn() {
      // 编辑
      if (this.type === 'edit') {
        updateSpace(this.formInline)
          .then((res) => {
            this.sucFn(res);
          })
          .catch((err) => {
            console.log('err', err);
          });
      } else {
        // 新增
        addSpace({
          spaceName: this.formInline.spaceName,
          description: this.formInline.description,
        })
          .then((res) => {
            this.sucFn(res);
          })
          .catch((err) => {
            console.log('err', err);
          });
      }
    },
    sucFn(res) {
      this.$message({
        type: 'success',
        message: res.message,
      });
      this.switchShow();
      this.$emit('getListFn', this.formInline.spaceName);
    },
    getData(id) {
      getSpace({ id })
        .then((res) => {
          this.switchShow();
          this.formInline = res.data;
          this.type = 'edit';
        })
        .catch((err) => {
          console.log('err', err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  border-bottom: 1px solid rgb(232, 232, 232);
  padding: 16px 24px;
}
::v-deep .el-dialog__footer {
  border-top: 1px solid rgb(232, 232, 232);
  padding: 16px 24px;
}
::v-deep .el-dialog__body {
  padding: 24px 24px 6px;
}
::v-deep .el-textarea {
  textarea {
    width: 310px;
  }
}
</style>
