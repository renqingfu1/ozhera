<template>
  <TableBox>
    <template slot="header">
      <el-button class="access__back" type="text" icon="el-icon-back" @click="onBack" />
      <div class="access__title">
        {{ $t('fastAccess.logAccess') }}
      </div>
    </template>
    <div class="access">
      <Steps v-model="step" :list="stepList" />
      <div class="access__part" :class="step === 0 ? 'access__part--0' : ''">
        <SelectContainer
          v-model="spaceId"
          title="Space"
          tip="Space"
          :desc="spaceDesc"
          :list="spaceList"
          :on-select="onSelectSpace"
          :on-create="onCreateSpace"
        >
          <div class="access__select__form">
            <div class="access__select__item access__select__item--half">
              <span>{{$t('logConfig.space.table.creator')}}:</span>
              <span>{{ spaceItem.creator }}</span>
            </div>
            <div class="access__select__item access__select__item--half">
              <span>{{ $t('fastAccess.TenantID') }}:</span>
              <span>{{ spaceItem.tenantId || "--" }}</span>
            </div>
            <div class="access__select__item access__select__item--half">
              <span>{{$t('logConfig.space.table.ctime')}}:</span>
              <span>{{ $dateFormat(spaceItem.ctime, "yyyy-mm-dd HH:MM:ss") }}</span>
            </div>
            <div class="access__select__item access__select__item--half">
              <span>{{ $t('logConfig.space.table.utime') }}:</span>
              <span>{{ $dateFormat(spaceItem.utime, "yyyy-mm-dd HH:MM:ss") }}</span>
            </div>
            <div class="access__select__item access__select__item--all">
              <span>{{ $t('fastAccess.spaceDesLabel') }}:</span>
              <span>{{ spaceItem.description }}</span>
            </div>
          </div>
        </SelectContainer>
        <SelectContainer
          v-model="storeId"
          title="Logstore"
          tip="Logstore"
          :desc="storeDesc"
          :list="storeList"
          :on-select="onSelectStore"
          :on-create="onCreateStore"
        >
          <div class="access__select__form">
            <div class="access__select__item access__select__item--half">
              <span>{{$t('serverRoom')}}:</span>
              <span>{{ storeItem.machineRoomName }}</span>
            </div>
            <div class="access__select__item access__select__item--half">
              <span>{{ $t('fastAccess.storageLifecycle') }}:</span>
              <span>{{ storeItem.storePeriod }}天</span>
            </div>
            <div class="access__select__item access__select__item--half">
              <span>{{ $t('fastAccess.storageShardCount') }}:</span>
              <span>{{ storeItem.shardCnt }}</span>
            </div>
            <div class="access__select__item access__select__item--half">
              <span>{{$t('logType')}}:</span>
              <span>{{ storeItem.logTypeName }}</span>
            </div>
            <div class="access__select__item access__select__item--half">
              <span>{{$t('logConfig.space.table.creator')}}:</span>
              <span>{{ storeItem.creator || "--" }}</span>
            </div>
            <div class="access__select__item access__select__item--half">
              <span>{{$t('logConfig.space.table.ctime')}}:</span>
              <span>{{ $dateFormat(storeItem.ctime, "yyyy-mm-dd HH:MM:ss") }}</span>
            </div>
          </div>
        </SelectContainer>
      </div>
      <div class="access__part__tip" v-if="step === 1">
        <i class="el-icon-warning" />
        Logtail是HERA日志服务提供的日志采集Agent，用于采集各业务服务器上的日志。您可以根据实际需求在目标Logstore中创建多个Logtail，
        一般是为一次查看多个应用的日志创建独立的Logtail。
      </div>
      <div class="access__part" :class="step === 1 ? 'access__part--1' : ''">
        <CreateTail
          v-if="step === 1"
          :spaceId="spaceId"
          :storeId="storeId"
          tailId=""
          ref="createTail"
          :isAppJoin="isAppJoin"
          :initData="initData"
          @switchShowCreate="onNext"
        />
      </div>
      <div class="access__part" :class="step === 2 ? 'access__part--2' : ''">
        <i class="el-icon-check"></i>
        <span>接入成功</span>
        <div class="access__part__btns">
          <el-button size="small" type="primary" @click="onGoManage">日志管理</el-button>
          <el-button size="small" @click="onContinue">继续接入</el-button>
        </div>
      </div>
      <div class="access__btns" v-if="step !== 2">
        <el-button type="primary" size="small" :disabled="step === 0" @click="onPrev">
          {{$t('fastAccess.preStep')}}
        </el-button>
        <el-button v-if="step === 1" size="small" @click="onSubmit">{{ $t('submit') }}</el-button>
        <el-button v-else size="small" @click="onNext">{{ $t('fastAccess.nextStep') }}</el-button>
      </div>
      <CreateSpace ref="createSpaceDialog" @getListFn="onSuccessSpace" />
      <el-drawer
        :with-header="false"
        :visible.sync="showCreateLogstore"
        :size="700"
        :wrapperClosable="false"
      >
        <div class="access__create-logstore">
          <div class="access__create-logstore__title">
            创建Logstore
          </div>
          <div class="access__create-logstore__body">
            <CreateStore
              v-if="showCreateLogstore"
              ref="createStore"
              :spaceId="spaceId"
              @onSuccess="onSuccessStore"
              @switchShowDialog="showCreateLogstore = false"
              hide-btn
            />
          </div>
          <div class="access__create-logstore__footer">
            <el-button @click="showCreateLogstore = false" size="large">
              {{ $t('cancle') }}</el-button>
            <el-button type="primary" @click="onSubmitCreateStore" size="large">
              {{$t('confirm')}}</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
  </TableBox>
</template>
<script>
import TableBox from '@/components/TableBox.vue';
import { getAllSpace, getStoreBySpaceApi } from '@/common/req/list/user/index';
import { getSpace, getStoreById } from '@/common/req/list/logConfig';
import CreateTail from '@/views/LogConfig/tail/create-tail.vue';
import CreateSpace from '@/views/LogConfig/space/NewCreate.vue';
import CreateStore from '@/views/LogConfig/store/CreateStore.vue';
import Steps from './components/steps/index.vue';
import SelectContainer from './components/selectContainer/index.vue';

export default {
  components: {
    TableBox,
    Steps,
    SelectContainer,
    CreateTail,
    CreateSpace,
    CreateStore,
  },
  props: {
    list: {
      require: true,
    },
    type: {
      type: String,
    },
  },
  data() {
    return {
      step: 0,
      spaceId: undefined,
      storeId: undefined,
      spaceList: [],
      spaceItem: {},
      storeList: [],
      storeItem: {},
      showCreateLogstore: false,
    };
  },
  computed: {
    isAppJoin() {
      return !!this.$route.params?.milogAppId;
    },
    initData() {
      const data = {};
      if (this.isAppJoin) {
        data.milogAppId = this.$route.params?.milogAppId;
        data.tail = this.$route.params?.tail;
        data.appType = this.$route.params?.appType;
      }
      return data;
    },
    stepList() {
      return [this.$t('fastAccess.selectSpace'), this.$t('fastAccess.configLogtail'), this.$t('fastAccess.finished')];
    },
    spaceDesc() {
      return this.$t('fastAccess.spaceDes');
    },
    storeDesc() {
      return this.$t('fastAccess.storeDes');
    },
  },
  mounted() {
    this.getSpaceList();
  },
  methods: {
    getSpaceList() {
      return getAllSpace().then(({ code, data }) => {
        if (code !== 0) {
          return;
        }
        this.spaceList = data ?? [];
      });
    },
    onBack() {
      this.$router.back();
    },
    onSelectSpace(value) {
      this.storeId = undefined;
      getSpace({
        id: value,
      }).then(({ code, data }) => {
        if (code !== 0) {
          return;
        }
        this.spaceItem = data;
      });
      this.getStoreList(value);
    },
    onCreateSpace() {
      this.$refs.createSpaceDialog.newCreate();
    },
    onSuccessSpace(name) {
      // 创建成功后，默认选中该 space
      this.getSpaceList().then(() => {
        const space = this.spaceList.find((item) => item.label === name);
        this.spaceId = space.value;
        this.onSelectSpace(this.spaceId);
      });
    },
    getStoreList(spaceId) {
      return getStoreBySpaceApi({ spaceId }).then(({ code, data }) => {
        if (code !== 0) {
          return;
        }
        this.storeList = data ?? [];
      });
    },
    onSelectStore(value) {
      getStoreById({ id: value }).then(({ code, data }) => {
        if (code !== 0) {
          return;
        }
        this.storeItem = data;
      });
    },
    onCreateStore() {
      if (!this.spaceId) {
        this.$message.warning('请选择 Space.');
        return;
      }
      this.showCreateStore();
    },
    showCreateStore() {
      this.showCreateLogstore = true;
    },
    onSubmitCreateStore() {
      this.$refs.createStore.onSubmit();
    },
    onSuccessStore(name) {
      this.getStoreList(this.spaceId).then(() => {
        const store = this.storeList.find((item) => item.label === name);
        this.storeId = store.value;
        this.onSelectStore(this.storeId);
      });
    },
    onPrev() {
      this.step -= 1;
    },
    onNext() {
      if (!this.spaceId) {
        this.$message.warning('请选择 Space.');
        return;
      }
      if (!this.storeId) {
        this.$message.warning('请选择 Logstore.');
        return;
      }
      this.step += 1;
    },
    onSubmit() {
      this.$refs.createTail.onSubmit('ruleForm');
    },
    onContinue() {
      this.step = 0;
      this.spaceId = undefined;
      this.storeId = undefined;
    },
    onGoManage() {
      this.$router.push({
        name: 'User-SpaceTree',
        query: {
          spaceId: this.spaceId,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.access {
  display: flex;
  flex-direction: column;
  align-items: center;
  &__title {
    font-weight: bold;
  }
  &__back {
    ::v-deep i {
      font-size: 20px;
      font-weight: bold;
      color: #1890ff;
      cursor: pointer;
      margin-right: 8px;
    }
  }
  &__part {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    left: -9999px;
    &__tip {
      max-width: 740px;
      margin-bottom: 32px;
      display: flex;
      align-items: center;
      padding: 5px 12px;
      background-color: #fefbe6;
      border: 1px solid rgba(255, 229, 143, 1);
      border-radius: 4px;
      font-size: 12px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.65);
      i {
        font-size: 16px;
        margin-right: 6px;
        margin-top: 2px;
        color: #efb700;
        align-self: flex-start;
      }
    }
    &--0,
    &--1,
    &--2 {
      position: relative;
      opacity: 1;
      visibility: visible;
      left: 0px;
    }
    &--2 {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      i {
        margin-top: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 72px;
        width: 72px;
        background-color: #52c41a;
        border-radius: 50%;
        color: white;
        font-size: 48px;
        font-weight: bold;
      }
      span {
        font-size: 24px;
        font-weight: bold;
        line-height: 32px;
        margin-top: 24px;
      }
    }
    &__btns {
      margin: 80px 0 64px;
    }
  }
  &__select {
    &__form {
      width: 492px;
    }
    &__item {
      padding-top: 18px;
      font-size: 14px;
      line-height: 20px;
      color: rgba(0, 0, 0, 0.65);
      ::v-deep span:nth-of-type(1) {
        margin-right: 8px;
      }
      &--half {
        display: inline-block;
        width: 50%;
      }
      &--all {
        width: 100%;
      }
    }
  }
  &__btns {
    align-self: flex-end;
    margin-right: 64px;
  }
  &__create-logstore {
    display: flex;
    flex-direction: column;
    height: 100%;
    &__title {
      line-height: 55px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: bold;
      font-size: 16px;
      padding-left: 24px;
      border-bottom: 1px solid rgba(233, 233, 233, 1);
    }
    &__body {
      padding-top: 28px;
      flex: 1;
      height: 0;
      overflow: auto;
    }
    &__footer {
      padding-right: 24px;
      height: 56px;
      box-shadow: 2px 0px 4px rgb(0 0 0 / 20%);
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
