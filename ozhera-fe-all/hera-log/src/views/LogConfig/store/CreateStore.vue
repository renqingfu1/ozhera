<template>
  <el-form
    class="store"
    :model="formInline"
    :rules="rules"
    ref="store"
    :label-width="labelWidth"
    label-position="left"
    :disabled="allCannotEdit"
  >
    <el-form-item class="store__item" label="Logstore名称" prop="logstoreName">
      <el-input
        class="store__item--400"
        v-model="formInline.logstoreName"
        size="small"
        placeholder="请输入Logstore名称"
      ></el-input>
    </el-form-item>
    <el-form-item :label="$t('serverRoom')" prop="machineRoom" class="store__item">
      <el-select
        class="store__item--400"
        v-model="formInline.machineRoom"
        placeholder="请选择机房"
        @change="onChangeMachineRoom"
        size="small"
      >
        <el-option
          v-for="item in machineRoomOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="formInline.machineRoom" class="store__item store-type"
    :label="$t('logType')" prop="logType">
      <el-select
        class="store__item--400"
        v-model="formInline.logType"
        :placeholder="$t('setLogType')"
        size="small"
        @change="onChangeLogType"
        :disabled="logTypeDisabled"
      >
        <el-option
          v-for="item in logTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item"
        >
        </el-option>
      </el-select>
      <p class="type-tips"
        v-if="logTypeOptions.filter(item=>item.value === formInline.logType.value).length>0">
        {{
          logTypeOptions.filter(item=>item.value === formInline.logType.value)[0].describe
        }}
      </p>
    </el-form-item>
    <el-form-item v-if="showLogTypeRealatedItem"
    class="store__item" label="存储生命周期" prop="storePeriod">
      <el-select
        class="store__item--400"
        v-model="formInline.storePeriod"
        size="small"
        placeholder="请选择存储生命周期"
      >
        <el-option
          v-for="item in $store.state.moduleLogconfig.periodOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item  v-if="showLogTypeRealatedItem" label="存储分片数" class="store__item" prop="shardCnt">
      <el-input-number
        v-model="formInline.shardCnt"
        :min="1"
        :max="7"
        controls-position="right"
        size="small"
      ></el-input-number>
    </el-form-item>
    <el-form-item v-if="initializedFlag && showFlag"
    class="store__item" label="mq资源列表" prop="mqResourceId">
      <MQSelect v-model="formInline.mqResourceId"/>
    </el-form-item>
    <el-form-item v-if="initializedFlag && showFlag"
    class="store__item" label="ES列表" prop="esResourceId">
      <ESSelect v-model="formInline.esResourceId"/>
    </el-form-item>
    <div v-if="userInfo.isAdmin && showLogTypeRealatedItem" class="sel-manual-keys">
      <el-form-item  label="使用自定义索引" class="store__item" v-if="formInline.logType">
        <UseManualKeys v-model="formInline.selectCustomIndex"
        :disabled="formInline.id?true:false"></UseManualKeys>
      </el-form-item>
      <el-form-item v-if="formInline.selectCustomIndex" label-width="15px" prop="keysName">
        <ManualKeysSlect v-model="formInline.keysName"
          :regionCode="formInline.machineRoom"
          :logTypeCode="formInline.logType.type">
        </ManualKeysSlect>
      </el-form-item>
    </div>
    <el-form-item v-if="showLogTypeRealatedItem" label="索引列顺序" prop="keyLists"
    class="store__item keylist-box">
      <div class="store__table" :style="{ width: allCannotEdit ? '340px' : '420px'}">
        <div class="store__table__header">
          <div v-show="!allCannotEdit"></div>
          <div>序号</div>
          <div>名称</div>
          <div>类型</div>
          <div v-show="!allCannotEdit">操作</div>
        </div>
        <component
          v-model="formInline.keyLists"
          class="store__table__body"
          :is="allCannotEdit ? 'div':'draggable'"
        >
          <div
            v-for="(element, index) in formInline.keyLists"
            :key="element.key"
            class="store__table__item"
          >
            <div class="store__table__item__draggable" v-show="!allCannotEdit">
              <i class="iconfont icon-more" />
            </div>
            <div>{{ index }}</div>
            <div>
              <el-input
                v-model="element.value"
                :disabled="element.edit === false"
                placeholder="请输入名称"
                style="width: 130px"
                size="mini"
              />
            </div>
            <div>
              <el-select
                v-model="element.type"
                :disabled="element.edit === false"
                placeholder="请选择类型"
                style="width: 110px;"
                size="mini"
              >
                <el-option
                  v-for="item in $store.state.moduleLogconfig.indexOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div v-show="!allCannotEdit">
              <el-button
                type="text"
                @click="removeDomain(element)"
                :disabled="!element.edit"
                size="medium"
              >
                删除
              </el-button>
            </div>
            <div v-if="element.type === 'ip'">
              <el-tooltip placement="top-start">
                <div slot="content">
                  若解析后该字段可能为空，请勿选择IP类型，否则将导致日志收集失败。<br/>可选择TEXT类型替代</div>
                <span>IP类型字段不允许为空<i class="el-icon-question"></i></span>
              </el-tooltip>
            </div>
          </div>
        </component>
      </div>
      <el-button class="insert-btn" type='primary' @click="insertHandle">插入</el-button>
    </el-form-item>
    <el-form-item v-if="!hideBtn">
      <el-button type="primary" @click="onSubmit" size="small">{{$t('confirm')}}</el-button>
      <el-button @click="switchShowDialog" size="small">{{ $t('cancle') }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import {
  addStoreReq,
  getTemplate,
  getMachineRooms,
  getStoreById,
  getTailCount,
  getTypeDicApi,
} from '@/common/req/list/logConfig';
import draggable from 'vuedraggable';
import { Loading } from 'element-ui';
import { mapState, mapActions } from 'vuex';
import judegeCreateStore from '@/common/fun/afterChangeMachine';
import TranslateListener from '@/utils/TranslateListener';
import MQSelect from './components/MQSelectNew.vue';
import ESSelect from './components/ESSelect.vue';
import UseManualKeys from './components/UseManualKeys.vue';
import ManualKeysSlect from './components/ManualKeysSelect.vue';

export default {
  components: {
    draggable,
    MQSelect,
    ESSelect,
    UseManualKeys,
    ManualKeysSlect,
  },
  props: {
    spaceId: null,
    hideBtn: {
      default: false,
      type: Boolean,
    },
    storeId: {},
    allCannotEdit: {
      default: false,
      type: Boolean,
    },
    copyStore: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    ...mapState({
      initializedFlag: (state) => state.moduleCreateStoreResource.initializedFlag,
      showFlag: (state) => state.moduleCreateStoreResource.showFlag,
      notInitializedMsg: (state) => state.moduleCreateStoreResource.notInitializedMsg,
      userInfo: (state) => state.moduleUserInfo.userInfo,
    }),
    showLogTypeRealatedItem() {
      const types = [6, 7];// 6与7代表：loki日志与matrix es日志
      return types.every((type) => this.formInline.logType && this.formInline.logType !== type
          && this.formInline.logType.type !== type);// 当前选择不是6、7这两种日志类型
    },
  },
  watch: {
    allCannotEdit: {
      handler(val) {
        if (!val) {
          this.queryShouldDisableLogType();
        }
      },
    },
  },
  data() {
    const validateKeysName = (rule, value, callback) => {
      if (this.formInline.selectCustomIndex && !value) {
        return callback(new Error('请选择索引'));
      }
      return callback();
    };
    const validateKeyLists = (rule, value, callback) => {
      const values = value.map((item) => item.value);
      const values3 = this.hideKeyLists.map((item) => item.value);
      for (let i = 0; i < value.length; i += 1) {
        const item = value[i];
        if (!item.value) {
          return callback(new Error('索引名称不能为空'));
        }
        if (values.indexOf(item.value) < i) {
          return callback(new Error(`索引名称${item.value}不能重复`));
        }
        if (values3.indexOf(item.value) > -1) {
          return callback(new Error(`索引名称${item.value}不允许插入，它是隐藏名称`));
        }
        if (!item.type) {
          return callback(new Error(`索引${item.value}的类型不能为空`));
        }
      }
      return callback();
    };
    return {
      labelWidth: '116px',
      isShow: false,
      type: 'newCreate',
      machineRoomOptions: [],
      formInline: {
        spaceId: this.spaceId,
        logType: '',
        logstoreName: '',
        shardCnt: 1,
        keyLists: [],
        esResourceId: '',
        mqResourceId: '',
        selectCustomIndex: false, // 自定义索引
        keysName: '',
        storePeriod: 7,
        isMatrixApp: false,
      },
      hideKeyLists: [],
      rules: {
        logstoreName: [{ required: true, message: '请输入store name', trigger: 'blur' }],
        storePeriod: [{ required: true, message: '请输入存储生命周期', trigger: 'blur' }],
        shardCnt: [{ required: true, message: '请输入存储分片数', trigger: 'blur' }],
        logType: [{ required: true, message: '请选择日志类型', trigger: 'blur' }],
        machineRoom: [{ required: true, message: '请选择机房', trigger: 'blur' }],
        esResourceId: [{ required: true, message: this.$t('isRequired'), trigger: 'blur' }],
        mqResourceId: [{ required: true, message: this.$t('isRequired'), trigger: 'blur' }],
        keysName: [
          { validator: validateKeysName, trigger: 'blur' },
        ],
        keyLists: [{ validator: validateKeyLists, trigger: 'change' }],
      },
      logTypeOptions: [],
      logTypeDisabled: false,
    };
  },
  methods: {
    ...mapActions('moduleCreateStoreResource', ['INITRESOURCEDATA']),
    onChangeMachineRoom(machineRoom) {
      this.emptyKeysName();
      this.getLogTypeOptions(machineRoom, () => {
        const { logType } = this.formInline;
        if (logType) {
          // 用户已选择的日志类型在新的列表中也存在
          const typeVal = logType.value;
          const curSave = this.logTypeOptions.some((item) => item.value === typeVal);
          if (!curSave) {
            this.formInline = { ...this.formInline, ...{ logType: {}, keyLists: [] } };
          }
        }
      });
      this.emptyResourceData();
      if (this.formInline.logType) {
        this.checkResourceData();
      }
    },
    emptyResourceData() {
      this.formInline = { // 当修改机房、日志类型时候应该把es、mq下拉置空
        ...this.formInline,
        ...{
          esResourceId: '',
          mqResourceId: '',
        },
      };
      const { machineRoom, logType } = this.formInline;
      if (machineRoom && logType) {
        if (logType.type === 6 || this.formInline.isMatrixApp) {
          this.INITRESOURCEDATA();
        }
      }
    },
    async checkResourceData() {
      if (!this.formInline.isMatrixApp) {
        const { machineRoom, logType } = this.formInline;
        const data = {
          regionCode: machineRoom,
          logTypeCode: logType.type,
        };
        await judegeCreateStore.call(this, data);
      }
    },
    emptyKeysName() {
      this.formInline.keysName = '';
    },
    onChangeLogType(val) {
      this.hideKeyLists = [];
      this.formInline.keyLists = [];
      this.formInline.keysName = '';
      this.emptyKeysName();
      this.emptyResourceData();
      if (this.formInline.machineRoom) {
        this.checkResourceData();
      }
      getTemplate({
        logTemplateId: val.value,
      })
        .then(({ code, data }) => {
          if (code !== 0) {
            return;
          }
          const propertiesKeyArr = (data.propertiesKey && data.propertiesKey.split(',')) || [];
          const propertiesTypeArr = (data.propertiesType && data.propertiesType.split(',')) || [];
          propertiesKeyArr.forEach((item, i) => {
            // typeIndex 1-必要key；2-建议key；3-隐藏key
            if (parseInt(propertiesKeyArr[i].split(':')[1], 10) !== 3) {
              this.formInline.keyLists.push({
                value: propertiesKeyArr[i].split(':')[0],
                typeIndex: propertiesKeyArr[i].split(':')[1],
                type: propertiesTypeArr[i],
                key: propertiesKeyArr[i],
                edit: val.value === 85,
              });
            } else {
              this.hideKeyLists.push({
                value: propertiesKeyArr[i].split(':')[0],
                typeIndex: propertiesKeyArr[i].split(':')[1],
                type: propertiesTypeArr[i],
                key: propertiesKeyArr[i],
                edit: false,
              });
            }
          });
        })
        .catch((err) => {
          console.log('err', err);
        });
    },
    insertHandle() {
      this.formInline.keyLists.splice(this.formInline.keyLists.length, 0, {
        value: '',
        key: Date.now(),
        typeIndex: 2,
        edit: true,
      });
    },
    onSubmit(params) {
      this.$refs.store.validate(async (valid) => {
        if (valid) {
          if (this.formInline.keyLists.find((item) => !item.type || !item.value)) {
            this.$message.warning('索引列信息不能为空.');
            return false;
          }
          // await this.checkResourceData();
          // eslint-disable-next-line eqeqeq
          if (!this.formInline.id
            && !this.initializedFlag
            && this.formInline.logType.type !== 6
          ) { // 新增的时候需要检查，message已在checkResourceData中给出，注掉了下面的提示
            // this.$message.warning(this.notInitializedMsg);
            return false;
          }
          this.addStoreFn(params);
        }
        return false;
      });
    },
    judgeCustomKeys(params) { // 自定义索引 将key,label用_拼接
      const isShow = this.initializedFlag && this.showFlag;
      const showFlagEsResourceId = isShow ? params.esResourceId : '';
      const showFlagEsIndex = isShow ? params.esIndex : '';
      const arr = params.keysName.split('~');
      const arrZero = arr[0] ? Number(arr[0]) : null;
      // 如果是管理员默认就是使用自定义索引
      // eslint-disable-next-line no-param-reassign
      params.esResourceId = this.userInfo.isAdmin ? arrZero : showFlagEsResourceId;
      // eslint-disable-next-line no-param-reassign
      params.esIndex = this.userInfo.isAdmin ? arr[1] : showFlagEsIndex;
      // eslint-disable-next-line no-param-reassign
      delete params.keysName;
    },
    showKeysName(res) { // 自定义索引回显
      return res.selectCustomIndex ? `${res.esClusterId}~${res.esIndex}` : '';
    },
    addStoreFn(noReset) {
      const { keyLists } = this.formInline;
      const keyListArr = [];
      const columnTypeListArr = [];
      const newKeyList = [...keyLists, ...this.hideKeyLists];
      newKeyList.forEach((item) => {
        keyListArr.push(`${item.value}:${item.typeIndex}`);
        columnTypeListArr.push(item.type);
      });
      const keyList = keyListArr.join(',');
      const columnTypeList = columnTypeListArr.join(',');
      const params = { ...this.formInline, keyList, columnTypeList };
      params.logType = this.formInline.logType.type;
      if (this.formInline.selectCustomIndex) { // 使用自定义索引
        this.judgeCustomKeys(params);
      }
      delete params.keyLists;
      let loadingInstance;
      const loadingId = setTimeout(() => {
        loadingInstance = Loading.service({ lock: true });
      }, 600);
      addStoreReq(params)
        .then((res) => {
          if (!noReset) this.closeFn();
          this.$message({
            type: 'success',
            message: res.message,
          });
          this.$emit('onSuccess', params.logstoreName);
          this.switchShowDialog();
        })
        .catch((err) => {
          this.$emit('onFail');
          console.log('err', err);
        }).finally(() => {
          clearTimeout(loadingId);
          if (loadingInstance) {
            loadingInstance.close();
          }
        });
      return true;
    },
    closeFn() {
      this.$refs.store.resetFields();
      this.isShow = false;
    },
    switchShowDialog() {
      this.$emit('switchShowDialog');
    },
    removeDomain(item) {
      const index = this.formInline.keyLists.indexOf(item);
      if (index !== -1) {
        this.formInline.keyLists.splice(index, 1);
      }
    },
    getMachineRoomOptions(cb) {
      getMachineRooms({ codes: ['1006'] })
        .then((res) => {
          this.machineRoomOptions = res.data['1006'];
          if (cb) cb();
        })
        .catch((err) => {
          console.log('err', err);
        });
    },
    getStoreDetail() {
      return getStoreById({ id: this.storeId }).then((res) => {
        this.formInline = {
          ...this.formInline,
          ...res.data,
          esResourceId: res.data.esClusterId || '',
          keysName: this.showKeysName(res.data),
        };
        this.getLogTypeOptions(this.formInline.machineRoom, () => {
          const logTypeArr = this.logTypeOptions.filter(
            (item) => item.type === this.formInline.logType,
          );
          if (logTypeArr.length > 0) {
            this.formInline = { ...this.formInline, ...{ logType: logTypeArr[0] } };
          }
        });
        this.resetKeyList();
        const data = {
          regionCode: res.data.machineRoom,
          logTypeCode: res.data.logType,
        };
        if (res.data.logType !== 6 && !this.formInline.isMatrixApp) {
          judegeCreateStore.call(this, data);
        }
      });
    },
    resetKeyList() {
      const arr = [];
      if (this.formInline.keyList.length !== 0) {
        const typeArr = this.formInline.columnTypeList.split(',');
        const keyArr = this.formInline.keyList.split(',');
        this.hideKeyLists = [];
        for (let i = 0; i < keyArr.length; i += 1) {
          const item = keyArr[i];
          const itemDetail = item.split(':');
          // eslint-disable-next-line no-control-regex
          const reg = new RegExp('\r\n', 'g');
          const type = itemDetail[1].replace(reg, '');
          if (type !== '3') {
            arr.push({
              value: itemDetail[0],
              type: typeArr[i],
              typeIndex: type,
              edit: true,
              key: itemDetail[0],
            });
          } else if (type === '3') {
            this.hideKeyLists.push({
              value: itemDetail[0],
              type: typeArr[i],
              typeIndex: type,
              edit: true,
              key: itemDetail[0],
            });
          }
        }
      }
      this.formInline = { ...this.formInline, ...{ keyLists: arr } };
    },
    getLogTypeOptions(area, cb) {
      getTypeDicApi({ area })
        .then(({ code, data }) => {
          if (code !== 0) {
            return;
          }
          this.logTypeOptions = data ?? [];
          if (cb) cb();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    queryShouldDisableLogType() {
      if (this.storeId) {
        getTailCount({ storeId: this.storeId, pageSize: 1, page: 1 }).then((res) => {
          this.logTypeDisabled = res.data.count > 0;
        });
      }
    },
    getMachineCB() {
      if (!this.storeId && this.machineRoomOptions.length > 0) { // 如果是新增，则给机房设置默认值
        this.formInline.machineRoom = this.machineRoomOptions[0].value;
        this.onChangeMachineRoom(this.formInline.machineRoom);
      }
    },
    handleTranslate(translated) {
      this.labelWidth = translated ? '160px' : '116px';
    },
  },
  mounted() {
    this.INITRESOURCEDATA();
    this.getMachineRoomOptions(this.getMachineCB);
    if (this.storeId) {
      this.getStoreDetail().then(() => {
        if (this.copyStore) {
          this.storeId = null;
          this.formInline = {
            ...this.formInline,
            id: '',
            logstoreName: `${this.formInline.logstoreName}-Copy`,
            selectCustomIndex: false, // 复制的时候不需要自定义索引
            keysName: '',
          };
        }
      });
    }
    this.translateListener = new TranslateListener(this.handleTranslate);
  },
  beforeDestroy() {
    this.translateListener.destroy();
  },
};
</script>
<style lang="scss" scoped>
.store {
  min-width: 640px;
  padding: 0 24px;
  &__item {
    margin-bottom: 28px !important;
    ::v-deep .el-form-item__label {
      font-size: 14px;
    }
    ::v-deep .el-input-number {
      width: 400px;
      input {
        text-align: left;
      }
    }
    &--400 {
      width: 400px;
    }
  }
  &__table {
    &__header {
      background-color: rgba(250, 250, 250, 1);
      border: 1px solid rgba(232, 232, 232, 1);
      font-size: 14px;
      font-weight: bold;
    }
    &__item {
      > div:nth-child(1) {
        font-size: 20px;
        cursor: move;
        text-align: center;
      }
      > div:nth-child(4) {
        ::v-deep .el-input--mini {
          width: 110px;
        }
      }
    }
    &__header,
    &__item {
      display: flex;
      align-items: center;
      height: 50px;
      border-bottom: 1px solid rgba(232, 232, 232, 1);
      > div:nth-child(1) {
        width: 40px;
      }
      > div:nth-child(2) {
        width: 60px;
        text-align: center;
      }
      > div:nth-child(3) {
        width: 145px;
      }
      > div:nth-child(4) {
        width: 130px;
      }
      > div:nth-child(5) {
        width: 60px;
      }
      > div:nth-child(6) {
        flex: 1;
        position: absolute;
        margin-left: 430px;
      }
    }
  }
}
.store__table{
  display: inline-block;
}
.insert-btn{
  vertical-align:top;
  margin:9px;
}
.keylist-box {
  ::v-deep .el-form-item__content{
    width: 100%;
  }
}
.store-type{
  ::v-deep .el-form-item__content{
    position: relative;;
    .type-tips{
      width: 280px;
      margin-left: 15px;
      font-size: 12px;
      line-height: 15px;
      color: #409EFF;
      position: absolute;
      left: 400px;
      top: 50%;
      transform: translate(0,-50%);
    }
  }
}
.sel-manual-keys{
  display: flex;
}
</style>
