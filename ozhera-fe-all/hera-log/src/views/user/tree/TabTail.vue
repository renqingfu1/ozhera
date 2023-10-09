<template>
  <div class="tail-box">
    <div class="top-box">
      <p class="left-title">LogTail{{$t('Attribute')}}</p>
      <div class="right">
        <el-button  v-if="canEditTail" @click="submitCreate">保存</el-button>
        <el-button @click="editTail" v-if="!canEditTail" >
          {{canEditTail? $t('cancle') :$t('edit')}}</el-button>
        <el-button @click="cerateAlarm">{{$t('logQuery.createAlarm')}}</el-button >
        <el-dropdown style="margin-left:10px" @command="handleCommand">
          <el-button plain  type="primary">
            {{$t('more')}}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="toAlarm">{{$t('logQuery.viewMonitoring')}}</el-dropdown-item>
            <el-dropdown-item command="clickCopyTail">
              {{$t('logQuery.CopyLogtail')}}</el-dropdown-item>
            <el-dropdown-item command="clickDeleteTail">
              {{$t('logQuery.DelLogtail')}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
     <CreateTail
        :spaceId="content.spaceId"
        :storeId="content.storeId"
        :tailId="content.tailId"
        ref="createTail"
        :canEdit="canEditTail"
        @afterInit="afterInit"
      />
    <el-drawer title="复制tail" :visible.sync="copyTailVisible" direction="rtl" :size="660"
      class="create-tail-drawer">
      <div class="copy-tail-box">
        <CreateTail
          v-if="copyTailVisible"
          :spaceId="content.spaceId"
          :storeId="content.storeId"
          :tailId="content.tailId"
          copyTail
          ref="copyTail"
          @switchShowCreate="switchShowCopyTail"
          @getListFn="refresh"
          />
        <CreateTailFooter @switchShowDialog="switchShowCopyTail" @submitCreate="submitCopy"/>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import CreateTail from '@/views/LogConfig/tail/create-tail.vue';
import CreateTailFooter from '@/views/LogConfig/tail/CreateTailFooter.vue';
import { deleteTail } from '@/views/LogConfig/tail/tail';
import { mapMutations, mapState } from 'vuex';
import EventBus from './event-bus';

export default {
  components: {
    CreateTail, CreateTailFooter,
  },
  props: {
    content: {
      require: true,
      type: Object,
    },
  },
  data() {
    return {
      copyTailVisible: false,
      canEditTail: false,
      editDisabled: true,
    };
  },
  computed: {
    ...mapState({
      activeTabValue: (state) => state.moduleSpaceTree.rules,
      appOptions: (state) => state.moduleLogconfig.appDic,
    }),
  },
  methods: {
    ...mapMutations('moduleSpaceTree', ['removeTab']),
    submitCreate() { // 编辑tail
      this.$refs.createTail.onSubmit('ruleForm', () => {
        this.sucFn();
      });
    },
    submitCopy() { // 复制tail
      this.$refs.copyTail.onSubmit('ruleForm', () => {
        this.sucFn();
      });
    },
    refresh() {
      EventBus.$emit('getTreeList');
    },
    sucFn() {
      this.editTail();
    },
    editTail() {
      this.canEditTail = !this.canEditTail;
    },
    afterInit(data) {
      this.editDisabled = data.appType === 8; // 禁用mife应用的修改
    },
    deleteTail,
    switchShowCopyTail() {
      this.copyTailVisible = !this.copyTailVisible;
    },
    handleCommand(command) {
      if (command === 'toAlarm') { // 跳转监控
        const { formInline } = this.$refs.createTail.$data;
        const filter = this.appOptions.filter((item) => item.value === formInline.milogAppId);
        const appName = filter && filter[0] && filter[0].label;
        const JumpApp = this.judgeUnderline(appName);
        const url = `${process.env.VUE_APP_HERA}project-target-monitor/application/dash-board?id=${formInline.milogAppId}&name=${JumpApp}`;
        window.open(url);
      } else if (command === 'clickDeleteTail') { // 删除tail
        const { tailId } = this.content;
        this.deleteTail(tailId, () => {
          this.removeTab(this.activeTabValue);
          EventBus.$emit('getTreeList'); //
        });
      } else if (command === 'clickCopyTail') {
        this.copyTailVisible = true;
      }
    },
    judgeUnderline(appName) {
      const underLine = '_';
      const indexN = appName.indexOf(underLine);
      const realName = indexN > -1 ? appName.substr(indexN + 1) : appName;
      return realName;
    },
    cerateAlarm() {
      const { tailId } = this.content;
      const path = '/user/log-alert-add';
      const routeUrl = this.$router.resolve({
        path,
        query: { tailId },
      });
      window.open(routeUrl.href, '_blank');
    },
  },
};
</script>
<style scoped>
.top-box{
  width: 505px;
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.left-title{
  font-size: 16px;
  color: rgba(0,0,0,0,.85);
  font-weight: 800;
}
.tail-box{
  padding-left: 20px;
}
.copy-tail-box{
  padding:20px 0 20px 40px;
}
</style>
