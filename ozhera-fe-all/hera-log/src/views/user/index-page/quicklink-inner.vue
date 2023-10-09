<template>
  <el-form
    :inline="true"
    :model="formInline"
    :rules="rules"
    ref="ruleForm"
    class="dialog-form-inline"
    label-width="120px"
    label-position="left"
  >
    <div class="step1" v-if="activeStep >= 0">
      <el-form-item label="所属space:" prop="spaceId">
        <el-select
          v-model="formInline.spaceId"
          filterable
          placeholder="请选择"
          :disabled="activeStep > 0 ? true : false"
          @change="changeSpace"
        >
          <el-option
            v-for="item in spaceOption"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </div>
    <div class="step2" v-if="activeStep >= 1">
      <el-form-item label="所属store:" prop="storeId">
        <el-select
          v-model="formInline.storeId"
          filterable
          placeholder="请选择"
          :disabled="activeStep > 1 ? true : false"
        >
          <el-option
            v-for="item in storeOption"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </div>
    <div class="step3" v-if="activeStep >= 2">
      <CreateTail v-if="activeStep >= 2"
        :spaceId="formInline.spaceId"
        :storeId="formInline.storeId"
        tailId=""
        ref="createTail"
        :isAppJoin ='true'
        :initData="formInline"
        @getListFn="getList"
        @switchShowCreate="switchShowQuickLink"
        />
    </div>
    <el-form-item class="btn-box">
      <el-button type="primary" @click="onSubmit('ruleForm')" v-if="activeStep === 2"
        >接入</el-button
      >
      <el-button type="primary" @click="nextStep" v-if="activeStep !== 2"
        >下一步</el-button
      >
      <el-button type="primary" plain @click="preStep" v-if="activeStep !== 0"
        >上一步</el-button
      >
      <el-button
        type="primary"
        @click="newCreateSpace"
        v-if="activeStep === 0"  plain
        >创建space</el-button
      >
      <el-button
        type="primary"
        @click="newCreateStore"
        v-if="activeStep === 1" plain
        >创建store</el-button
      >
    </el-form-item>
    <NewCreateSpace ref="newCreateSpaceDialog" @getListFn="resetSpaceId" />

    <el-dialog
      title="新增store"
      :visible.sync="showCreateStore"
      :close-on-click-modal="false"
      append-to-body
      width="900px">
        <CreateStore v-if="showCreateStore" @getListFn="sesetStoreId"
        @switchShowDialog="switchShowCreate"
        :spaceId="formInline.spaceId"/>
    </el-dialog>

  </el-form>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { getAllSpace, getStoreBySpaceApi } from '@/common/req/list/user/index';
import NewCreateSpace from '@/views/LogConfig/space/NewCreate.vue';
import CreateStore from '@/views/LogConfig/store/CreateStore.vue';
import '@/common/css/new-create-tail.css';
import CreateTail from '@/views/LogConfig/tail/create-tail.vue';

export default {
  components: {
    NewCreateSpace,
    CreateTail,
    CreateStore,
  },
  props: {
    keyList: {},
  },
  computed: {
    ...mapState({
      activeStep: (state) => state.moduleUserIndex.activeStep,
      options: (state) => state.moduleLogconfig.appDic,
      searchAppDisable: (state) => state.moduleUserIndex.searchAppDisable,
      userInfo: (state) => state.moduleUserInfo.userInfo,
    }),
    formInline: {
      get() {
        return this.$store.state.moduleUserIndex.formInline;
      },
      set(value) {
        this.$store.commit('moduleUserIndex/setformInline', value);
      },
    },
  },
  data() {
    return {
      showCreateStore: false, // 是否展示创建store的弹框
      spaceOption: [],
      storeOption: [],
      rules: {
        spaceId: [{ required: true, message: '请选择space', trigger: 'blur' }],
        storeId: [{ required: true, message: '请选择store', trigger: 'blur' }],
      },
      keyListArr: [], // 索引列循环的数据
    };
  },
  mounted() {
    this.getSpaceOption((res) => {
      this.spaceOption = res.data;
    });
  },
  methods: {
    ...mapMutations('moduleUserIndex', ['nextStepMutaion', 'preStepMutaion', 'setActiveStep', 'changeFormInline', 'setSwitchShowDraw']),
    switchShowQuickLink() {
      this.setSwitchShowDraw(false);
    },
    getList() {
      this.$emit('refreshApp');
    },
    changeSpace() {
      this.getStoreOption((res) => {
        this.storeOption = res.data;
      });
    },
    resetSpaceId(spaceName) {
      this.getSpaceOption((res) => {
        this.spaceOption = res.data;
        const filterData = this.spaceOption.filter((item) => item.label === spaceName);
        this.formInline = { ...this.formInline, ...{ spaceId: filterData[0].value } };
      }); // 获取space下来选项
    },
    sesetStoreId(storeName) {
      this.getStoreOption((res) => {
        this.storeOption = res.data;
        const filterData = this.storeOption.filter((item) => item.label === storeName);
        this.formInline = { ...this.formInline, ...{ storeId: filterData[0].value } };
      });
    },
    getSpaceOption(fn) {
      getAllSpace().then((res) => {
        fn(res);
      }); // 获取space下来选项
    },
    getStoreOption(fn) {
      getStoreBySpaceApi({ spaceId: this.formInline.spaceId }).then((res) => {
        fn(res);
      });
    },
    nextStep() {
      if (!this.checkNext()) return;
      this.nextStepMutaion();
    },
    preStep() {
      console.log('this.activeStep', this.activeStep);
      if (this.activeStep === 1) {
        this.formInline = { ...this.formInline, ...{ storeId: '' } };
      }
      this.preStepMutaion();
    },
    checkNext() {
      if (this.activeStep === 0 && !this.formInline.spaceId) {
        this.$message.warning('请选择space！');
        return false;
      } if (this.activeStep === 1 && !this.formInline.storeId) {
        this.$message.warning('请选择store！');
        return false;
      }
      return true;
    },
    onSubmit() {
      this.$refs.createTail.onSubmit('ruleForm');
    },
    newCreateSpace() {
      this.$refs.newCreateSpaceDialog.newCreate();
    },
    newCreateStore() {
      this.switchShowCreate();
    },
    switchShowCreate() {
      this.showCreateStore = !this.showCreateStore;
    },

  },
};
</script>
<style scoped>
.step2{
  margin-top: 56px;
}
.step3{
  margin-top: 56px;
}
.btn-box{
  padding-left: 120px;
}
.checkbox-box-newcreate-tail{
  width: 100%;
  max-height: 200px;
  overflow-y: scroll;
}
</style>
