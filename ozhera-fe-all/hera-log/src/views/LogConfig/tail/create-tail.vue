// 此处用于普通用户space tree页面新增和管理员新增tail
<template>
  <el-form
    class="tail"
    :model="formInline"
    :rules="rules"
    ref="ruleForm"
    :label-width="labelWidth"
    label-position="left"
    :disabled="!canEdit"
  >
    <el-form-item class="tail__item" :label="$t('appType')" prop="appType">
      <SelectAppType
        class="tail__item--400"
        size="small"
        v-model="formInline.appType"
        :logType="storeDetail.logType"
        @change="changeAppType"
        :disabled="(typeof tailId ==='number') || isAppJoin || formInline.isMatrixApp"
      />
    </el-form-item>
    <el-form-item :label="`${$t('createTail.deployMethod')}`" prop="deployWay" class="tail__item"
    v-if="switchShowArr.showDeployTypes.indexOf(formInline.appType)>=0">
      <SelectDeployType v-model="formInline.deployWay" @change="changeDeployWay"
      class="tail__item--400"/>
    </el-form-item>
    <el-form-item
      :label="`${$t('createTail.ServiceAppName')}`"
      prop="milogAppId"
      class="tail__item"
      v-if="formInline.appType !== '' "
    >
      <SearchAppByType
        class="tail__item--400"
        size="small"
        :disabled="isAppJoin || !canEdit"
        v-model="formInline.milogAppId"
        @changeApp="changeApp"
        :appType="formInline.appType"
        :machineRoom="storeDetail.machineRoom"
        :extraOption="formInline.milogAppId ? {
          value: formInline.milogAppId,
          label: getAppLabel(formInline.appName || formInline.milogAppId,
            formInline.appType, apptype_options),
          key: formInline.appId} : null"
      />
    </el-form-item>
    <el-form-item class="tail__item"
      :label="$t('createTail.ServiceAlias')"
      prop="tail">
      <el-input class="tail__item--400" v-model="formInline.tail"
      :placeholder="$t('createTail.ServiceAlias')"
      size="small" />
    </el-form-item>
    <el-form-item v-if="formInline.isMatrixApp"
        label="部署空间" prop="deploySpace" class="tail__item">
      <el-select
        class="tail__item--400"
        v-model="formInline.deploySpace"
        placeholder="请选择部署空间"
        size="small"
        @change="changeDeploySpace"
      >
        <el-option
            v-for="item in (matrixDeployMeta && matrixDeployMeta.deploySpaces)"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
      </el-select>
    </el-form-item>
    <!-- 编辑回显时候特殊处理faas类型 -->
    <MifassEnvIps
      v-if="formInline.source=='mifaas' && formInline.id"
      :env="formInline.envName"
      :ips="formInline.ips"/>
    <el-form-item
      class="tail__item"
      :label="$t('createTail.EnvGrouping')"
      prop="envId"
      v-if="switchShowArr.showEnvTypes.indexOf(formInline.appType)>=0 &&
      envsOptions.length > 0"
    >
      <el-select
        v-model="formInline.envId"
        class="tail__item--400"
        :placeholder="enterEnvGroupPh"
        @change="changeEnv"
        size="small"
      >
        <el-option
          v-for="item in envsOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="switchShowArr.showMachineTypeTypes.indexOf(formInline.appType)>=0"
      class="tail__item"
      label="机器类型"
      prop="machineType"
    >
      <MachineType
        class="tail__item--400"
        v-model="formInline.machineType"
        size="small"
        @changeMachineType="changeMachineType"
      />
    </el-form-item>
    <el-form-item
      :label="`${$t('serverRoom')}:`"
      class="width-800 tail__item"
      props="motorRooms"
      v-if="switchShowArr.showMachineRegionTypes.indexOf(formInline.appType)>=0
      && formInline.machineType === 0"
    >
      <CascaderMachine
        class="tail__item--400"
        :appId="formInline.milogAppId"
        v-model="formInline.motorRooms"
        :storeId="formInline.storeId"
        size="small"
      />
    </el-form-item>
    <el-form-item
      class="tail__item"
      :label="$t('createTail.serviceIP')"
      prop="ips"
      v-if="
        formInline.isMatrixApp ||
        ((switchShowArr.showEnvTypes.indexOf(formInline.appType)>=0 )&& formInline.envId) ||
        ((formInline.appType === 1 || formInline.appType === 4) && formInline.machineType === 1) ||
        formInline.source=='mifaas' && formInline.id
      "
    >
      <div class="tail__item__ip">
        <el-input
          class="tail__item--400"
          v-model="inputIp"
          :placeholder="$t('enterServiceIP')"
          size="small"
        >
          <el-button slot="append" @click="addIp">{{$t('logConfig.space.add')}}</el-button>
        </el-input>
        <el-checkbox
          class="tail__item__ip__checkall"
          v-model="checkAll"
          @change="handleCheckAllChange"
          :disabled="formInline.isMatrixApp"
        >
          {{$t('createTail.SelAll')}}
        </el-checkbox>
      </div>
      <el-checkbox-group class="tail__item__ip__checkbox" v-model="formInline.ips"
      :disabled="formInline.isMatrixApp">
        <div v-for="item in ipsOptions" :key="item" class="ip-box">
          <el-checkbox
            :label="item"
          />
          <i class='el-icon-document-copy copy-ip'
          :class="canEdit?'':'disable-copy'" @click="copyIp(item)"></i>
        </div>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item   prop="logPath" class="tail__item">
      <template slot="label">
        <div>
          <p >{{$t('createTail.LogFilePath')}}</p>
          <p class="tips" style="">({{$t('createTail.SpecificToFilename')}})</p>
        </div>
      </template>
      <el-input
        class="tail__item--400"
        v-model="formInline.logPath"
        :placeholder="`/home/work/log${
          formInline.appType == 1 ? 's' : ''
        }/\${appName}/server.log`"
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 6 }"
        size="small"
      ></el-input>
    </el-form-item>
    <el-form-item prop="logSplitExpress"
      class="tail__item">
      <template slot="label">
        <el-tooltip placement="top-start" >
          <div slot="content">
            如果你的日志文件切分后，不符合你配置的日志路径的.*就需要填写，
            <br/>否则不用填写。
            <br/>eg:
            <br/>你配置的日志路径为：/home/work/log/zzytest/server.log,
            <br/>正好你切分的日志文件为/home/work/log/zzytest/server.log.2022-09-15，
            <br/>符合默认正则匹配，所以可以不用填写。
            <br/>如果切分后的文件为/home/work/log/zzytest/server.2022-09-15.log,
            <br/>则就需要填写可以匹配到的正则，/home/work/log/zzytest/server.*.log</div>
          <el-button>Top center</el-button>
          <span>
            {{$t('createTail.DelimiterExpression')}}
            <i class="el-icon-question"></i>
          </span>
        </el-tooltip>
      </template>
      <el-input
        class="tail__item--400"
        v-model="formInline.logSplitExpress"
        :placeholder="$t('createTail.DelimiterExpression')"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 6 }"
      ></el-input>
    </el-form-item>
    <el-form-item v-if="(storeDetail.logType === 1 || storeDetail.logType === 3)"
    prop="firstLineReg"
      class="tail__item" :label="$t('createTail.LineStartRegex')">
      <el-input
        class="tail__item--400"
        v-model="formInline.firstLineReg"
        placeholder="将多行文本视为一个value，使用正则匹配首行"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 6 }"
      ></el-input>
    </el-form-item>
    <el-form-item
    :label="$t('createTail.ParsingType')" prop="parseType" class="tail__item">
      <el-select
        class="tail__item--400"
        v-model="formInline.parseType"
        :placeholder="selParsingTypePh"
        size="small"
      >
        <el-option
          v-for="item in $store.state.moduleLogconfig.parseTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if=" formInline.parseType !== 7"
    :label="$t('createTail.ParsingScript')" prop="parseScript" class="tail__item">
      <el-input
        class="tail__item--400"
        v-model="formInline.parseScript"
        :placeholder="$t('createTail.ParsingScript')"
        size="small"
      ></el-input>
    </el-form-item>
    <el-form-item  :label="$t('createTail.CollectionRate')" prop="tailRate" class="tail__item">
      <el-select
        class="tail__item--400"
        v-model="formInline.tailRate"
        :placeholder="$t('selectP',{name:$t('createTail.CollectionRate')})"
        size="small"
      >
        <el-option
          v-for="item in rateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <div class="mq-config-box">
      <!--  获取store详情之后才展示 -->
      <el-form-item
        :label="$t('createTail.MQConfig')"
        prop="middlewareConfig"
        class="tail__item mq-sel"
        v-if="
        getSotreDetailed &&
        userInfo.isAdmin &&
         switchShowArr.showMqconfigTypes.indexOf(formInline.appType)>= 0"
      >
        <CascaderMqconfig
          v-model="formInline.middlewareConfig"
          :appType="formInline.appType"
          :machineRoom ="storeDetail.machineRoom"
          class="mq-cascader"
          size="small"
        />
      </el-form-item>
      <el-form-item class="tail__item" label-width="0px" prop="tail"
        v-if="userInfo.isAdmin && formInline.appType === 0">
        <el-input class="tail__item--200" v-model="mqConfigInputV"
        size="small" />
      </el-form-item>
    </div>
    <el-form-item v-if="userInfo.isAdmin"  prop="tailRate" class="tail__item">
      <template slot="label">
        {{$t('createTail.BatchQuantity')}}<TopTooltip tipText="每批次上报日志数量"/>
      </template>
      <el-input-number v-model="formInline.batchSendSize" :controls="false"
      :precision="0"
      :min="100"  :label="$t('createTail.BatchQuantity')"></el-input-number>
    </el-form-item>
    <el-form-item :label="$t('createTail.LogExample')" prop="msg" class="tail__item">
      <div class="log-input-box">
        <el-input
          class="tail__item--400"
          type="textarea"
          v-model="formInline.msg"
          :placeholder="$t('createTail.enterLog')"
          size="small"
        ></el-input>
        <el-button type="text" class="parse-example-btn" @click="parseExample"
        :disabled="!formInline.parseType ||
        (!formInline.parseScript && formInline.parseType !== 7) || !formInline.msg">
          {{$t('createTail.ViewParsingResults')}}
        </el-button>
      </div>
    </el-form-item>
    <el-form-item
      v-if="allKeyListArr.length>0 "
      class="tail__item"
      :label="$t('createTail.IndexColumn')"
      :rules="[
        { required: true, message: '请选择添加索引列', trigger: 'blur' },
      ]"
    >
      <div :style="keyListArr.length === 0 ? 'color: #bbb' : ''">
        {{ keyListArr.map(item => item.key || '-').join(',') || '请在上方输入日志示例解析索引列' }}
      </div>
      <div class="tail__table">
        <div class="tail__table__header">
          <div v-for="item in tableHeaders" :key="item">{{ item }}</div>
        </div>
        <component v-if="keyListArr.length>0  "
          v-model="keyListArr"
          class="tail__table__body"
          :is="!canEdit ? 'div':'draggable'"
        >
          <div
            v-for="(element, index) in keyListArr"
            :key="element.indexKey"
            class="tail__table__item"
          >
            <div class="tail__table__item__draggable">
              <i class="iconfont icon-more" />
            </div>
            <div>{{ index }}</div>
            <div>
              <el-select
                v-model="element.key"
                filterable
                placeholder="选择索引列"
                @change="(val) => updateKeyList(element.indexKey, val)"
                size="small"
              >
                <el-option
                  v-for="item in allKeyListArr"
                  :key="item.key"
                  :label="item.key"
                  :disabled="
                    keyListArr.some((selected) => {
                      return selected.key === item.key;
                    })
                  "
                  :value="item.key"
                >
                </el-option>
              </el-select>
            </div>
            <div :title="element.value">{{element.value}}</div>
            <div>
              <el-button
                type="text"
                @click="deleteValueList(element, index)"
                size="medium"
              >
                {{$t('delete')}}
              </el-button>
            </div>
          </div>
        </component>
        <div v-if="keyListArr.length === 0" class="tail__table__empty">暂无索引</div>
      </div>
        <div class="btm-btn">
          <el-button type="primary" @click="addValList" size="mini">
            {{$t('createTail.AddIndexColumn')}}
          </el-button>
        </div>
    </el-form-item>
    <TailTest :formData="formInline" :keyListArr="keyListArr"
    v-if="keyListArr.length>0 && formInline.parseScript && formInline.parseType" />
    <!-- Loki日志配置下发所涉及的字段 start -->
    <el-form-item  v-if="storeDetail.logType === 6" class="tail__item" label="已接入Loki">
      <el-select
        class="tail__item--400"
        v-model="hasLokiConfig"
        placeholder="请选择"
        size="small"
        :disabled="typeof tailId ==='number'"
      >
        <el-option label="是" :value="true"/>
        <el-option label="否" :value="false"/>
      </el-select>
      <InfoPopup>
        <div>
          <div><b>是否已接入Loki</b></div>
          <div>如果之前已通过填写需求表格的方式，手动接入过Loki，则无需再次配置，否则会重复采集。</div>
          <div v-if="typeof tailId ==='number'">通过其它途径接入的Loki，暂不可在此编辑修改</div>
        </div>
      </InfoPopup>
    </el-form-item>
    <!-- Loki日志配置下发所涉及的字段 end -->
  </el-form>
</template>
<script>
import { Loading } from 'element-ui';
import { mapState } from 'vuex';
import { addIp } from '@/common/fun/addIp';
import SearchAppByType from '@/views/LogConfig/tail/SearchAppByType.vue';
import MachineType from '@/components/machine-type/index.vue';
import draggable from 'vuedraggable';
import TranslateListener from '@/utils/TranslateListener';
import TailTest from '@/components/TailTest.vue';
import InfoPopup from '@/components/InfoPopup.vue';

import {
  getEnvsByApp,
  changeEnv,
  handleCheckAllChange,
  deleteValueList,
  selfValid,
  returnEnvAppName,
  returnValueList,
  getTailRateFun,
  changeAppType,
} from '@/common/fun/tail-edit';
import '@/common/css/new-create-tail.css';
import SelectAppType from '@/components/select-app-type/index.vue';
import CascaderMachine from '@/components/cascader-machine/index.vue';
import CascaderMqconfig from '@/components/cascader-mqconfig.vue';
import { getDefaultValuelistApi } from '@/common/req/list/user/index';
import SelectDeployType from '@/components/select/SelectDeployType.vue';
import { createDeploySpaceRules, createTenentIdRules } from '@/common/fun/lokiTailValidators';

import {
  getStoreById, updateTail, addTailReq,
  getTailByIdReq, getMachineByAppId,
  getMatrixDeploySpaces, getMatrixIps,
  parseLogExample,
} from '@/common/req/list/logConfig';
import TopTooltip from '@/components/TopTooltip.vue';
import getAppLabel from '@/utils/getAppLabel';
import MifassEnvIps from './components/MifassEnvIps.vue';

export default {
  components: {
    TopTooltip,
    SearchAppByType,
    SelectAppType,
    CascaderMachine,
    CascaderMqconfig,
    MachineType,
    draggable,
    TailTest,
    SelectDeployType,
    InfoPopup,
    MifassEnvIps,
  },
  props: {
    keyList: {},
    noDialog: {
      type: Boolean,
    },
    spaceId: {
      require: true,
    },
    storeId: {
      require: true,
    },
    tailId: {},
    copyTail: {
      type: Boolean,
      default: false,
    },
    isAppJoin: { // 是否应用日志接入
      type: Boolean,
      default: false,
    },
    initData: {
      type: Object,
    },
    canEdit: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.moduleUserInfo.userInfo,
      appOptions: (state) => state.moduleLogconfig.appDic,
      switchShowArr: (state) => state.moduleDic.switchShowArr,
      apptype_options: (state) => state.moduleDic.apptype_options,
    }),
    deploySpaceRules() {
      return createDeploySpaceRules(this.formInline);
    },
    tenentIdRules() {
      return createTenentIdRules(this.formInline);
    },
    selAliasPh() {
      return this.$t('createTail.SelServiceAlias');
    },
    enterEnvGroupPh() {
      return this.$t('createTail.enterEnvGroup');
    },
    selParsingTypePh() {
      return this.$t('createTail.selParsingType');
    },
    tableHeaders() {
      const a = ['', this.$t('createTail.IndexNumber'), this.$t('createTail.IndexColumn'),
        this.$t('createTail.ExampleValue'), this.$t('logConfig.space.table.operation')];
      console.log('a', a);
      return a;
    },
  },
  data() {
    return {
      labelWidth: '110px',
      getSotreDetailed: false, // 是否获取store 详情
      mqConfigInputV: '',
      selectedKey: [],
      storeMachine: '',
      rateOptions: [],
      inputIp: '',
      checkAll: false,
      isIndeterminate: true,
      type: 'newCreate',
      pageKey: 'store',
      envsOptions: [],
      machineObj: [],
      formInline: {
        motorRooms: [],
        appType: '',
        tailRate: 'MEDIUM',
        tail: '',
        spaceId: this.spaceId,
        storeId: this.storeId,
        parseScript: '',
        logPath: '',
        logSplitExpress: '', // 切分表达式
        milogAppId: '',
        parseType: '',
        ips: [],
        envId: '',
        middlewareConfig: [],
        machineType: null,
        deployWay: '',
        batchSendSize: 200,
      },
      ipsOptions: [],
      // mis类型或者radar类型可能的ips
      readyIpsOptions: {
        nodeIps: [], // 机器类型物理机取这个
        posDTOList: [], // 机器类型容器取这个
      },
      typeOptions: [
        {
          value: 1,
          label: 'text',
        },
        {
          value: 2,
          label: 'date',
        },
      ],
      keyListArr: [], // 当前在前端交互上已选中的索引项
      allKeyListArr: [], // logstore里包含的所有索引项
      storeDetail: {
        machineRoom: '',
        keyList: '',
      },
      hasLokiConfig: undefined, // 创建时，标记是否已接入过Loki，默认undefined未选择，需要让用户选择true或false
      clusterOptions: 'staging/c3/c4/c5/ams/mb/or/fr/sgp/mos'.split('/'),
      matrixDeployMeta: {
        name: '',
        treeId: 0,
        deploySpaces: [],
      },
      rules: {
        tail: [{ required: true, message: this.selAliasPh, trigger: 'blur' }],
        appType: [{ required: true, message: '请选择应用类型', trigger: 'blur' }],
        ips: [{ required: true, message: '请选择IP', trigger: 'change' }],
        envId: [{ required: true, message: this.enterEnvGroupPh, trigger: 'blur' }],
        logPath: [
          { required: true, message: '请输入日志文件路径，具体到文件名', trigger: 'blur' },
        ],
        parseType: [
          { required: true, message: this.selParsingTypePh, trigger: 'blur' },
        ],
        appId: [
          { required: true, message: '请输入服务应用名', trigger: 'blur' },
        ],
        tailRate: [
          { required: true, message: '请选择收集速率', trigger: 'blur' },
        ],
        middlewareConfig: [
          {
            validator: (rule, value, callback) => {
              if (value && value.length === 1) {
                callback(new Error('请选到第二级'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        deployWay: [
          { required: true, message: '请选择部署方式', trigger: 'blur' },
        ],
        // Loki日志配置rules start
        tenant_id: [
          { required: true, message: this.$t('resourceManage.enterTeamId'), trigger: 'change' },
        ],
        tenant_name: [
          { required: true, message: '请输入团队名称', trigger: 'change' },
        ],
        clusters: [
          { required: true, message: '请选择集群', trigger: 'change' },
        ],
        job_name: [
          { required: true, message: '请输入应用名称', trigger: 'change' },
          { pattern: /.+_cop.xiaomi$/g, message: '请输入正确的应用名称', trigger: 'change' },
        ],
        expression: [
          { required: true, message: '请输入日志路径', trigger: 'change' },
        ],
        retention: [
          { required: true, message: '请选择日志保留时间', trigger: 'change' },
        ],
      // Loki日志配置rules end
      },
    };
  },
  mounted() {
    this.getTailRate();
    this.getInitial();
    this.translateListener = new TranslateListener(this.handleTranslate);
  },
  beforeDestroy() {
    this.translateListener.destroy();
  },
  methods: {
    getAppLabel,
    handleTranslate(translated) {
      this.labelWidth = translated ? '180px' : '110px';
    },
    addIp,
    handleCheckAllChange,
    selfValid,
    deleteValueList,
    getEnvsByApp,
    changeEnv,
    returnEnvAppName,
    returnValueList,
    changeAppType,
    async getInitial() {
      const storeDetail = await this.getStoreDetail();
      this.getStoreRes(storeDetail);
      this.formInline.isMatrixApp = !!this.storeDetail.isMatrixApp;
      if (this.tailId) { // 编辑回显
        const tailDetail = await this.getTailDetail(this.tailId);
        this.getTailRes(tailDetail);
        if (this.formInline.appType === 2 && this.formInline.clusters.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          this.formInline.clusters = this.formInline.clusters[0];
        }
        if (this.copyTail) {
          this.formInline.id = undefined;
          this.formInline.tail = `${this.formInline.tail}-Copy`;
          this.tailId = undefined;// 修改prop有一定风险，目前没发现问题，有问题需要把引用的tailId compute一下
          this.formInline.middlewareConfig = []; // MQconfig 清空
        }
      } else if (!this.formInline.appType
          && (this.storeDetail.logType === 6 || this.storeDetail.logType === 7
          || this.storeDetail.isMatrixApp)) { // isMatrixApp下不能再改appType
        this.formInline.appType = 6;// 创建tail时，Loki日志与matrix es日志下，默认应用类型为matrix
        this.changeAppType();
      }
      this.$emit('afterInit', this.formInline);
    },
    getTailDetail(id) { // 编辑过回显
      this.type = 'edit';
      return getTailByIdReq({ id });
    },
    getTailRes(res) {
      // 如果没有应用公类型则是0
      this.formInline = {
        ...this.formInline,
        ...res.data,
        ...{ appType: res.data.appType || 0 },
      };
      const middlewareConfig = res.data.middlewareConfig || [];
      const resMq = middlewareConfig.length === 3
        ? middlewareConfig.slice(0, 2) : middlewareConfig;
      this.mqConfigInputV = middlewareConfig.length === 3 ? middlewareConfig[2] : '';
      this.formInline.middlewareConfig = resMq;
      this.resetKeyListArr();
      this.hasLokiConfig = typeof this.tailId === 'number';// 编辑时，为已接入Loki状态
      if (this.formInline.source === 'mifaas') {
        this.ipsOptions = res.data.ips || [];
      } else if (this.formInline.isMatrixApp) { // 初始化Matrix表单数据
        getMatrixDeploySpaces(
          { appId: this.formInline.appId, machineRoom: this.storeDetail.machineRoom },
        )
          .then((res2) => {
            this.matrixDeployMeta = res2.data;
            this.changeDeploySpace(this.formInline.deploySpace);
          });
      } else {
        this.getIpsOptions(this.formInline.milogAppId);
      }
    },
    getStoreDetail() {
      return getStoreById({ id: this.storeId });
    },
    getStoreRes(res) {
      this.storeDetail = { ...this.storeDetail, ...res.data };
      this.getSotreDetailed = true;
      this.initAllKeyList(this.storeDetail.keyList);
      if (this.isAppJoin && this.initData.milogAppId) { // 应用快速接入
        this.formInline = { ...this.formInline, ...this.initData };
        this.getIpsFun();
      }
    },
    getNodeIPsByApp(val) {
      const myself = this;
      getMachineByAppId(
        { milogAppId: val, machineRoom: this.storeDetail.machineRoom },
      ).then((res) => {
        const data = res.data || [];
        this.readyIpsOptions = {
          ...this.readyIpsOptions,
          nodeIps: (data[0] && data[0].nodeIps) || [], // 机器类型物理机取这个
          posDTOList: (data[0] && data[0]?.nodeIps?.posDTOList) || [], // 机器类型容器取这个
        };
        myself.editResShowIps(); // 回显ips options
      }).catch((err) => { console.log('err', err); });
    },
    editResShowIps() {
      const { ips, machineType } = this.formInline;
      if (machineType === 1 || machineType === 0) {
        const baseIps = machineType === 1
          ? this.readyIpsOptions.nodeIps : this.readyIpsOptions.posDTOList;
        const arr2 = ips || [];
        const arr = Array.from(new Set(baseIps.concat(arr2)));
        this.ipsOptions = arr;
      }
    },
    getIpsFun() {
      const { milogAppId } = this.formInline;
      let { deployWay } = this.formInline;
      if (this.formInline.appType === 5) { // 如果应用类型是mifass
        // eslint-disable-next-line no-const-assign
        deployWay = 2;
      }
      if (milogAppId && deployWay) {
        this.getEnvsByApp({ milogAppId, deployWay });
      }
    },
    changeApp(val, appName, appKey) {
      this.formInline.envId = '';
      this.formInline.ips = [];
      this.ipsOptions = [];
      this.envsOptions = [];
      this.formInline.machineType = '';
      this.formInline.tail = appName;
      this.formInline.deploySpace = '';
      if (this.formInline.isMatrixApp) {
        getMatrixDeploySpaces({ appId: appKey, machineRoom: this.storeDetail.machineRoom })
          .then((res) => {
            this.matrixDeployMeta = res.data;
          });
      } else {
        this.getIpsOptions(val);
      }
    },
    getIpsOptions(appId) {
      // mione & mifaas odinmesh
      if (this.switchShowArr.showEnvTypes.indexOf(this.formInline.appType) >= 0) {
        this.getIpsFun();
      } else if (this.formInline.appType === 1 || this.formInline.appType === 4) { // mis&radar
        this.getNodeIPsByApp(appId);
      }
    },
    changeDeployWay() {
      this.formInline.envId = '';
      this.formInline.ips = [];
      this.ipsOptions = [];
      this.envsOptions = [];
      this.getIpsFun();
    },
    changeDeploySpace(val) {
      getMatrixIps({
        iamTreeId: this.matrixDeployMeta.treeId,
        appName: this.matrixDeployMeta.name,
        deploySpace: val,
      }).then((res) => {
        this.ipsOptions = res.data.podIPs;
        this.formInline.ips = this.ipsOptions;
        this.checkAll = true;
      });
    },
    parseExample() {
      const params = {
        parseScript: this.formInline.parseScript,
        parseType: this.formInline.parseType,
        msg: this.formInline.msg,
      };
      parseLogExample(params).then(({ data }) => {
        if (!data || data.length === 0) {
          this.$message.warning('没有匹配的索引值！');
          return;
        }
        if (data && !data.map) {
          this.$message.error(data);
          return;
        }
        this.keyListArr = data.map((value, i) => ({ indexKey: i, key: '', value }));
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.selfValid()) return false;
          this.addFn();
        }
        return false;
      });
    },
    addFn() {
      const paramsMiddle = {};
      const { middlewareConfig } = this.formInline;
      const mqConfigArr = [...middlewareConfig];
      if (middlewareConfig.length > 0 && this.mqConfigInputV) {
        mqConfigArr.push(this.mqConfigInputV);
      }
      paramsMiddle.middlewareConfig = mqConfigArr;
      const params = {
        ...this.formInline,
        ...this.returnEnvAppName(),
        ...{ valueList: this.returnValueList() },
        created_user: this.userInfo.user,
        ...paramsMiddle,
      };
      if (typeof params.clusters === 'string') {
        params.clusters = [params.clusters]; // 兼容下LOKI编译部署的单选
      }
      if (params.parseType === 7) {
        params.parseScript = '';
      }
      const arr = Object.keys(params);
      arr.forEach((item) => {
        if (item === 'envId' && !params[item]) {
          params.envId = null;
        }
      });
      if (this.formInline.milogAppId) {
        const filter = this.appOptions.filter((item) => item.value === this.formInline.milogAppId);
        const appName = filter && filter[0] && filter[0].label;
        params.appName = appName;
      }

      if (this.type === 'edit' && !this.copyTail) {
        if (this.formInline.source === 'mifaas') {
          params.envName = this.formInline.envName;
        }
        updateTail(params)
          .then((res) => {
            this.sucCB(res);
          })
          .catch((err) => {
            console.log('err', err);
          });
      } else {
        let loadingInstance;
        const loadingId = setTimeout(() => {
          loadingInstance = Loading.service({ lock: true });
        }, 600);
        addTailReq(params)
          .then((res) => {
            this.sucCB(res);
          })
          .catch((err) => {
            console.log('err', err);
          }).finally(() => {
            clearTimeout(loadingId);
            if (loadingInstance) {
              loadingInstance.close();
            }
          });
      }
      return true;
    },
    sucCB(res) {
      this.$message({
        type: 'success',
        message: res.message,
      });
      this.$emit('switchShowCreate');
      this.$emit('getListFn');
    },
    resetFormInline() {
      this.ipsOptions = [];
      this.envsOptions = [];
      this.checkAll = false;
      this.formInline = {
        ...this.formInline,
        appType: '',
        motorRooms: [],
        tailRate: 'MEDIUM',
        tail: '',
        parseScript: '',
        logPath: '',
        logSplitExpress: '',
        milogAppId: '',
        parseType: '',
        ips: [],
        envId: '',
        middlewareConfig: [],
        deployWay: '',
      };
      this.$set(this.formInline, 'appType', '');
    },
    isAddFnTree(storeId) {
      this.isAddFn();
      this.formInline = { ...this.formInline, ...{ storeId } };
    },
    resetKeyListArr() {
      // 编辑的时候回显索引类顺序
      this.keyListArr = [];
      if (this.formInline.valueList.length === 0) {
        return;
      }
      const arr = this.formInline.valueList.split(',');
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < arr.length; i++) {
        this.keyListArr.push({
          key: arr[i],
        });
      }
    },
    removeDomain(item) {
      const index = this.formInline.keyLists.indexOf(item);
      if (index !== -1) {
        this.formInline.keyLists.splice(index, 1);
      }
    },
    initAllKeyList(val) {
      if (val.length > 0) {
        const arr = val.split(',');
        arr.forEach((item) => {
          const itemArr = item.split(':');
          if (itemArr[1] !== '3') {
            const itemObj = {
              key: itemArr[0],
              type: itemArr[1],
            };
            this.allKeyListArr.push(itemObj);
          }
        });
      }
      if (this.isAppJoin) { // 快速接入
        this.getDefaultValueList();
      }
    },
    getDefaultValueList() { // 快速接入默认keyList
      getDefaultValuelistApi().then((res) => {
        const resData = res.data || [];
        const initData = this.allKeyListArr.filter(
          (item) => resData.some((resItem) => resItem.value === item.key),
        );
        this.keyListArr = initData;
      });
    },
    getTailRate() {
      getTailRateFun().then((res) => {
        this.rateOptions = res.data || [];
      });
    },
    addValList() {
      const canChoose = this.allKeyListArr.filter(
        (item) => this.keyListArr.findIndex((sel) => sel.key === item.key) < 0,
      );
      if (canChoose.length === 0) {
        this.$message.warning('没有可添加的索引列');
        return;
      }
      const { key } = canChoose[0];
      this.keyListArr.push({ key });
    },
    updateKeyList(indexKey, val) {
      if (indexKey) {
        this.keyListArr[indexKey].key = val;
      }
    },
    changeMachineType(val) {
      this.formInline.ips = [];
      if (val === 1) { // 物理机
        this.ipsOptions = this.readyIpsOptions.nodeIps;
      } else if (val === 0) { // 容器
        this.ipsOptions = this.readyIpsOptions.posDTOList;
      }
    },
    copyIp(item) {
      const aux = document.createElement('input');
      aux.setAttribute('value', item);
      document.body.appendChild(aux);
      aux.select();
      document.execCommand('copy');
      document.body.removeChild(aux);
      this.$message.success('复制成功');
    },
  },
};
</script>
<style lang="scss" scoped>
.tail {
  width: 570px;
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
      ::v-deep .el-input {
        width: 400px;
      }
    }
    &--200{
      width: 200px;
      ::v-deep .el-input {
        width: 200px;
      }
    }
    &__ip {
      display: flex;
      align-items: center;
      &__checkall {
        margin-left: 12px;
      }
      &__checkbox {
        margin-top:18px;
        width: 464px;
        margin-bottom: -12px;
      }
    }
  }
  &__table {
    width: 400px;
    margin-top: 24px;
    border: solid 1px #e8e8e8;
    &__header {
      background-color: rgba(250, 250, 250, 1);
      font-size: 14px;
      font-weight: bold;
    }
    &__empty {
      width: 100%;
      background-color: rgba(250, 250, 250, 0.3);
      font-size: 12px;
      margin-right: 60px;
      padding: 8px;
      text-align: center;
      color: #bbb;
      border-top: solid 1px #e8e8e8;
    }
    &__item {
      > div:nth-child(1) {
        font-size: 20px;
        cursor: move;
        text-align: center;
      }
      > div:nth-child(2) {
        padding-left: 10px;
      }
      > div:nth-child(4) {
        ::v-deep .el-input--mini {
          width: 110px;
        }
      }
    }
    &__item{
      border-top: 1px solid #e8e8e8;
    }
    &__header,
    &__item {
      display: flex;
      align-items: center;
      height: 40px;
      > div:nth-child(1) {
        width: 60px;
      }
      > div:nth-child(2) {
        width: 60px;
      }
      > div:nth-child(3) {
        width: 130px;
      }
      > div:nth-child(4) {
        width: 90px;
        margin-left: 8px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      > div:nth-child(5) {
        width: 70px;
      }
    }
  }
}
.width-800 >>> .el-input--mini{
  width: 580px;
}
.copy-ip{
  font-size: 12px;
  margin-left:2px;
  cursor: pointer;
  color:#409eff;
}
.disable-copy{
  color: #a4a8af;
}
.ip-box{
  display:inline-block;
  margin-right: 20px;
  ::v-deep .el-checkbox{
    user-select: all;
  }
  ::v-deep .el-checkbox__inner{
    user-select: none;
  }
}
.info-popup {
  line-height: 2;
}
.info-popup >>> a {
  text-decoration: underline;
}
.tips{
  font-size: 12px;
  color:#E6A23C;
  line-height:12px;
  margin-top:-5px;
}

.btm-btn{
  padding-top: 10px;
}
.log-input-box{
  width: 400px;
  position: relative;
  .parse-example-btn {
    position: absolute;
    padding:0;
    bottom: 3px;
    right: 6px;
  }
}
.mq-config-box{
  width: 510px;
  display: flex;
  align-items: center;
  ::v-deep .mq-sel{
    flex:1;
    .mq-cascader{
      width:100%;
    }
  }
}

</style>
