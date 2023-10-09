<template>
  <el-dialog :visible.sync="showModal"
             :title="`${dialogTitle} ${title}`"
             :close-on-click-modal="false"
             :modal-append-to-body="false"
             width="540px"
             class="el-dialog-v-align-middle">
    <el-form ref="form" :model="form" label-width="110px" label-position="left" size="small">
      <el-form-item :label="$t('name')"
                    prop="marketName"
                    :rules="{required: true, message: $t('marketList.tips'), trigger: 'blur'}">
        <el-input v-model="form.marketName" :placeholder="$t('marketList.tips')"></el-input>
      </el-form-item>
<!--      <el-form-item label="所属团队"-->
<!--                    prop="belongTeam"-->
<!--                    :rules="{required: true, message: '所属团队不能为空', trigger: 'blur'}">-->
<!--        <el-input v-model="form.belongTeam" placeholder="请输入所属团队"></el-input>-->
<!--      </el-form-item>-->
      <el-form-item :label="$t('region')" v-if="showArea">
        <el-select v-model.number="form.serviceType" :placeholder="$t('selRegion')" @change="changeServiceType">
          <el-option
              v-for="(aItem, aIndex) in serviceTypeList"
              :key="`${aItem.value}-${aIndex}`"
              :label="aItem.label"
              :value="aItem.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('marketList.includingApplications')"
                    prop="serviceList"
                    :rules="{required: true, message: $t('selectApplicationPlaceholder'), trigger: 'blur'}">
        <el-select v-model="form.serviceList" :placeholder="$t('selectApplicationPlaceholder')"
                   value-key="id"
                   multiple
                   filterable
                   style="width: 100%"
                   remote
                   :remote-method="getAppList">
          <el-option
              v-for="(item, index) in appList"
              :key="`${item.appId}_${item.appName}-${index}`"
              :label="`${item.appId}_${item.appName}`"
              :value="`${item.appId}_${item.appName}`">
          </el-option>
        </el-select>
        <span class="tip-info" v-if="form.serviceType == 0 || form.serviceType == 2">
          <em class="el-alert__icon el-icon-warning" /> 只有在mione中开启日志追踪才有监控数据
        </span>
      </el-form-item>
      <el-form-item :label="$t('remark')" prop="remark">
        <el-input type="textarea" v-model="form.remark" maxlength="100" :placeholder="$t('enterNote')"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: center;">
      <el-button @click="showModal = false" size="small">{{ this.$t('cancle'), }}</el-button>
      <el-button type="primary" size="small" :loading="loading"  @click="submitFn">{{$t('confirm')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import server from "@/api/service/market";
import server2 from "@/api/service/market-common";

const defaultForm = () => {
  return {
    marketName: '', // 大盘名称
    belongTeam: '', // 所属团队
    serviceList: [], // 服务列表 按;组合
    remark: '' // 备注
  }
}
export default {
  name: 'createMarket',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '项目大盘'
    },
    searchForm: Object,
    item: null,
    showArea: Boolean, // 是否显示区域
    serverType: String, // 服务类型 项目大盘project
  },
  watch: {
    item: {
      handler(newValue) {
        this.dataHandle(newValue) // 应用列表数据回显处理
      },
      deep: true
    }
  },
  data () {
    return {
      loading: false, // 加载状态
      dialogTitle: this.$t('create'),
      ajaxName: 'addPromise', // 保存提交服务方法名
      form: {
        marketName: '', // 大盘名称
        belongTeam: '', // 所属团队
        serviceType: '', // 服务类型
        serviceList: [], // 服务列表 按;组合
        remark: '' // 备注
      },
      appList: [], // 应用列表数据
      appParams: {
        appName: '', // 输入框筛选应用值
        page: 1, // 页码
        pageSize: 20, // 每页条数
      },
      serviceTypeList: []
    }
  },
  computed: {
    showModal: {
      get () {
        return this.show
      },
      set (visible) {
        this.$emit("update:show", visible)
      }
    }
  },
  mounted() {
    if (this.serverType === "quality") {
      this.getAppList(); // 获取应用列表数据
    } else {
      this.getPlatFormListFn(); // 获取平台类型
    }
  },
  methods: {
    // 提交校验
    submitFn () {
      // 表单校验
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitCreate()
        } else {
          return false
        }
      })
    },
    // 新建分支集成提交事件
    submitCreate () {
      this.loading = true
      const param = this.paramsHandle();
      server[this.ajaxName](param, this.serverType).then(() => {
        this.$message.success(`${this.dialogTitle}成功！`)
        this.showModal = false
        this.loading = false
        this.form = defaultForm();
        this.$refs.form.resetFields()
        this.$emit('getList', param.id ? this.searchForm.page : 0)
      }).catch(() => {
        this.loading = false
      })
    },
    paramsHandle() {
      const params = JSON.parse(JSON.stringify(this.form));
      // 应用列表数据处理
      params.serviceList = this.form.serviceList.join(';')
      return params;
    },
    // 获取应用列表数据
    getAppList(query, param) {
      this.appList = [];
      this.appParams.appName = query || '';
      this.appParams.platformType = this.form.serviceType; // 平台类型
      const params = {
        ...this.appParams,
        ...param
      }
      return server2.getAppListPromise(params).then(res => {
        this.appList = res && res.list || []
        this.appDataHandle() // 应用数据处理
      });
    },
    // 应用数据处理
    appDataHandle() {
      if (this.appParams.platformType === 0) {
        this.appParams.platformType = 2;
        return server2.getAppListPromise(this.appParams).then(res => {
          if (res && res.list) {
            this.appList = [...this.appList, ...res.list]
          }
        })
      }
      // 质量大盘包含应用不支持中国区和有品服务
      if (this.serverType === "quality") {
        this.appList = this.appList.filter(item=>item.platformType !==0 && item.platformType !== 2)
      }
    },
    // 编辑时已选中包含应用数据处理
    editServeHandle(serve) {
      serve.forEach(item2 => {
        const val = item2.split('_')
        // 下拉数据列表中是否有当前id，如没有添加当前数据
        if (this.appList.findIndex(val2 => val2.appId == val[0]) < 0) {
          const obj = {
            appId: val[0],
            appName: item2.slice(val[0].length+1)
          }
          this.appList.push(obj)
        }
      })
    },
    // 应用列表数据回显处理
    dataHandle(newValue) {
      if (!newValue) {
        this.dialogTitle = this.$t('create'),
        this.ajaxName = 'addPromise'; // 保存提交服务方法名
        this.form = defaultForm();
        this.loading = false
      } else {
        this.dialogTitle =  this.$t('edit');
        this.ajaxName = 'editPromise'; // 保存提交服务方法名
        this.form.serviceType = newValue.serviceType; // 平台类型
        const serve = newValue.serviceList && newValue.serviceList.split(';') || []
        // 应用下拉选项数据处理
        if (this.serverType == "quality") {
          this.editServeHandle(serve)
        } else if (serve.length) {
          // 获取应用列表数据
          this.getAppList().then(() => {
            this.editServeHandle(serve)
          });
        }
        this.form = {
          ...defaultForm(),
          ...newValue,
          serviceList: serve
        }
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    // 获取不同区域应用数据
    changeServiceType() {
      this.form.serviceList = []; // 包含应用
      this.getAppList(); // 获取应用列表数据
    },
    // 获取平台类型
    getPlatFormListFn() {
      server2.getPlatFormListPromise().then(res => {
        this.serviceTypeList =  res || [];
      });
    },
  }
}
</script>
<style scoped>
.el-dialog-v-align-middle >>> .el-form-item__content .tip-info {
  display: inline-block;
  font-size: 12px;
  color: #909399;
  line-height: 1;
}
.tip-info em {
  display: inline-block;
  vertical-align: -1px;
}
</style>
