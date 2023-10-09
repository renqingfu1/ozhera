<template>
  <div class="create-trace-box">
    <HeraTitle :text="$t('createTrace.title')" />
    <ContainBox>
      <el-form
        ref="form"
        :model="form"
        label-width="135px"
        label-position="left"
        class="create-trace"
        :disabled="$route.query.type=='detail'"
      >
        <el-card shadow="never" class="config-card">
          <el-form-item :label="$t('appName')" label-width="135px">
            <AppDetailSelect v-model="appDetail" />
          </el-form-item>
        </el-card>
        <div style="width:100%"></div>
        <el-card shadow="never" class="config-card">
          <div slot="header" class="clearfix">
            <TitleTipsVue
            :title="$t('traceConfig.edit.filterMetrics')"
            :tips="$t('traceConfig.edit.tips1')" />
          </div>
          <div class="card-inner">
            <div class="form-item-box">
              <TraceToolTip v-model="excludeMethodTips" />
              <el-form-item :label="$t('traceConfig.edit.exceptOp')">
                <AddInput v-model="form.excludeMethod" :disabled="$route.query.type=='detail'" />
              </el-form-item>
            </div>
            <div class="form-item-box">
              <TraceToolTip v-model="excludeHttpserverMethodTips" />
              <el-form-item
                :label="`${$t('traceConfig.edit.exceptOp')}(http server):`"
                class="long-label">
                <AddInput
                  v-model="form.excludeHttpserverMethod"
                  :disabled="$route.query.type=='detail'"
                />
              </el-form-item>
            </div>
            <div class="form-item-box">
              <TraceToolTip v-model="excludeThreadTips" />
              <el-form-item :label="$t('traceConfig.edit.exceptThread')">
                <AddInput v-model="form.excludeThread" :disabled="$route.query.type=='detail'" />
              </el-form-item>
            </div>
            <div class="form-item-box">
              <TraceToolTip v-model="excludeSqlTips" />
              <el-form-item :label="$t('traceConfig.edit.excpetsql')">
                <AddInput v-model="form.excludeSql" :disabled="$route.query.type=='detail'" />
              </el-form-item>
            </div>
            <div class="form-item-box">
              <TraceToolTip v-model="excludeHttpUrlTips" />
              <el-form-item :label="$t('traceConfig.edit.exceptUrl')">
                <AddInput v-model="form.excludeHttpUrl" :disabled="$route.query.type=='detail'" />
              </el-form-item>
            </div>
            <div class="form-item-box">
              <TraceToolTip v-model="excludeUaTips" />
              <el-form-item :label="$t('traceConfig.edit.excpetUA')">
                <AddInput v-model="form.excludeUa" :disabled="$route.query.type=='detail'" />
              </el-form-item>
            </div>
          </div>
        </el-card>
        <el-card shadow="never" class="config-card" >
          <div slot="header" class="clearfix">
            <TitleTipsVue
              :tipsWidthObj="{width:'265px'}"
              :title="$t('traceConfig.edit.tracefilter')"
              :tips="$t('traceConfig.edit.tracefilterTips')"
            />
          </div>
          <div class="card-inner">
            <div class="form-item-box">
              <TraceToolTip v-model="traceDebugFlagTips" />
              <el-form-item :label="$t('traceConfig.edit.traceDebug')">
                <AddInput v-model="form.traceDebugFlag" :disabled="$route.query.type=='detail'" />
              </el-form-item>
            </div>
            <div class="form-item-box">
              <TraceToolTip v-model="traceFilterTips" />
              <el-form-item :label="$t('traceConfig.edit.traceSavePer')">
                <el-input-number
                  v-model="form.traceFilter"
                  :min="1"
                  :max="10"
                  :disabled="false"
                >
                </el-input-number>
                <span class="unit">%</span>
              </el-form-item>
            </div>
            <div class="form-item-box">
              <TraceToolTip v-model="traceDurationThresholdTips" />
              <el-form-item :label="$t('traceConfig.edit.traceTime')">
                <el-input-number v-model="form.traceDurationThreshold" :min="1"></el-input-number>
                <span class="unit">ms</span>
              </el-form-item>
            </div>
          </div>
        </el-card>
        <el-card shadow="never" class="config-card">
          <div slot="header" class="clearfix">
            <TitleTipsVue
              :title="$t('traceConfig.edit.slowTable')"
              :tips="$t('traceConfig.edit.slowTableTips')"
            />
          </div>
          <div class="card-inner">
            <div class="form-item-box">
              <TraceToolTip v-model="dubboSlowThresholdTips" />
              <el-form-item :label="$t('traceConfig.edit.rpcTime')">
                <el-input-number v-model="form.dubboSlowThreshold" :min="1"></el-input-number>
                <span class="unit">ms</span>
              </el-form-item>
            </div>
            <div class="form-item-box">
              <TraceToolTip v-model="mysqlSlowThresholdTips" />
              <el-form-item :label="$t('traceConfig.edit.dbTime')">
                <el-input-number v-model="form.mysqlSlowThreshold" :min="1"></el-input-number>
                <span class="unit">ms</span>
              </el-form-item>
            </div>
            <div class="form-item-box">
              <TraceToolTip v-model="httpSlowThresholdTips" />
              <el-form-item :label="$t('traceConfig.edit.httpTime')">
                <el-input-number v-model="form.httpSlowThreshold" :min="1"></el-input-number>
                <span class="unit">ms</span>
              </el-form-item>
            </div>
            <div class="form-item-box">
              <TraceToolTip v-model="httpStatusErrorTips" />
              <el-form-item :label="$t('traceConfig.edit.exceptErrCode')">
                <AddInput
                  v-model="form.httpStatusError"
                  type="number"
                  :disabled="$route.query.type=='detail'"
                />
              </el-form-item>
            </div>
            <!-- <div class="form-item-box">
              <TraceToolTip v-model="grpcCodeErrorTips" />
              <el-form-item label="排除grpc异常码:">
                <AddInput
                  v-model="form.grpcCodeError"
                  type="number"
                  :disabled="$route.query.type=='detail'"
                />
              </el-form-item>
            </div> -->
            <!-- <div class="form-item-box">
              <TraceToolTip v-model="exceptionTips" />
              <el-form-item label="排除Exception异常:" >
                <AddInput v-model="form.exceptionError" :disabled="$route.query.type=='detail'" />
              </el-form-item>
            </div> -->
          </div>
        </el-card>
      </el-form>
      <div class="bottom-box">
        <el-button @click="cancleFun">{{$t('cancle')}}</el-button>
        <el-button
          @click="submit"
          v-loading="submiting"
          type="primary" v-if="$route.query.type!='detail'">{{$t('confirm')}}</el-button>
      </div>
    </ContainBox>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import HeraTitle from '@/components/hera-title.vue';
import ContainBox from '@/components/contain-box.vue';
import AddInput from '@/components/AddInput.vue';
import TraceToolTip from '@/views/trace-config/TraceToolTip.vue';
import { editTrace, getTraceDetail } from '@/common/server/list/trace';
import AppDetailSelect from '@/components/AppDetailSelect.vue';
import TitleTipsVue from './TitleTips.vue';

export default {
  components: {
    HeraTitle,
    ContainBox,
    AddInput,
    TraceToolTip,
    TitleTipsVue,
    AppDetailSelect,
  },
  computed: {
    ...mapState({
      isAllMenuMode: (state) => state.moduleMenu.isAllMenuMode,
    }),
  },
  data() {
    return {
      submiting: false,
      // projectId|projectName|baseInfoId
      appDetail: null,
      excludeMethodTips: this.$t('traceConfig.edit.excludeMethodTips'),
      excludeHttpserverMethodTips: this.$t('traceConfig.edit.excludeHttpserverMethodTips'),
      excludeThreadTips: this.$t('traceConfig.edit.excludeThreadTips'),
      excludeSqlTips: this.$t('traceConfig.edit.excludeSqlTips'),
      excludeHttpUrlTips: this.$t('traceConfig.edit.excludeHttpUrlTips'),
      excludeUaTips: this.$t('traceConfig.edit.excludeUaTips'),
      httpSlowThresholdTips: this.$t('traceConfig.edit.httpSlowThresholdTips'),
      dubboSlowThresholdTips: this.$t('traceConfig.edit.dubboSlowThresholdTips'),
      mysqlSlowThresholdTips: this.$t('traceConfig.edit.mysqlSlowThresholdTips'),
      traceFilterTips: this.$t('traceConfig.edit.traceFilterTips'),
      traceDurationThresholdTips: this.$t('traceConfig.edit.traceDurationThresholdTips'),
      traceDebugFlagTips: this.$t('traceConfig.edit.traceDebugFlagTips'),
      httpStatusErrorTips: this.$t('traceConfig.edit.httpStatusErrorTips'),
      grpcCodeErrorTips: this.$t('traceConfig.edit.grpcCodeErrorTips'),
      exceptionTips: this.$t('traceConfig.edit.exceptionTips'),
      form: {
        id: '',
        excludeMethod: [],
        excludeHttpserverMethod: [],
        excludeThread: [],
        excludeSql: [],
        excludeHttpUrl: [],
        excludeUa: [],
        httpSlowThreshold: 1000,
        dubboSlowThreshold: 1000,
        mysqlSlowThreshold: 1000,
        traceFilter: 10,
        traceDurationThreshold: 1000,
        traceDebugFlag: [],
        httpStatusError: [],
        grpcCodeError: [],
        exceptionError: [],
      },
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      getTraceDetail({ id: this.$route.query.id }).then(({ data }) => {
        // this.showDetail(data);
        const {
          excludeMethod,
          excludeHttpserverMethod,
          excludeThread,
          excludeSql,
          excludeHttpUrl,
          excludeUa,
          traceDebugFlag,
          httpStatusError,
          grpcCodeError,
          exceptionError,
        } = data;

        this.appDetail = {
          projectId: Number(data.bindId),
          projectName: data.appName,
          baseInfoId: data.baseInfoId,
          appSource: data.platformType,
        };
        console.log('appDetail', this.appDetail);
        this.form = {
          id: data.id,
          ...{
            excludeMethod: this.returnArr(excludeMethod || ''),
            excludeHttpserverMethod: this.returnArr(
              excludeHttpserverMethod || '',
            ),
            excludeThread: this.returnArr(excludeThread || ''),
            excludeSql: this.returnArr(excludeSql || ''),
            excludeHttpUrl: this.returnArr(excludeHttpUrl || ''),
            excludeUa: this.returnArr(excludeUa || ''),
            traceDebugFlag: this.returnArr(traceDebugFlag || ''),
            httpStatusError: this.returnArr(httpStatusError || ''),
            grpcCodeError: this.returnArr(grpcCodeError || ''),
            exceptionError: this.returnArr(exceptionError || ''),
          },
          ...{
            httpSlowThreshold: data.httpSlowThreshold,
            dubboSlowThreshold: data.dubboSlowThreshold,
            mysqlSlowThreshold: data.mysqlSlowThreshold,
            traceFilter: data.traceFilter,
            traceDurationThreshold: data.traceDurationThreshold,
          },
        };
      });
    },
    submit() {
      this.submiting = true;
      if (!this.appDetail) {
        this.$message.warning(this.$t('selApp'));
        this.submiting = false;
        return;
      }
      const reqParams = this.returnReq();
      editTrace(reqParams).then(() => {
        this.submiting = false;
        this.$message.success(`${reqParams.id ? this.$t('edit') : this.$t('add')}成功`);
        this.cancleFun();
      }).catch(() => {
        this.submiting = false;
      });
    },
    cancleFun() {
      this.$router.go(-1);
    },
    returnReq() {
      const data = {
        ...this.form,
        ...{
          bindId: this.appDetail.projectId,
          appName: this.appDetail.projectName,
          baseInfoId: this.appDetail.baseInfoId,
          platformType: this.appDetail.appSource,
        },
        ...{
          traceDebugFlag: this.returnStr(this.form.traceDebugFlag),
          excludeMethod: this.returnStr(this.form.excludeMethod),
          excludeHttpserverMethod: this.returnStr(
            this.form.excludeHttpserverMethod,
          ),
          excludeThread: this.returnStr(this.form.excludeThread),
          excludeSql: this.returnStr(this.form.excludeSql),
          excludeHttpUrl: this.returnStr(this.form.excludeHttpUrl),
          excludeUa: this.returnStr(this.form.excludeUa),
          httpStatusError: this.returnStr(this.form.httpStatusError),
          grpcCodeError: this.returnStr(this.form.grpcCodeError || ''),
          exceptionError: this.returnStr(this.form.exceptionError || ''),
        },
      };
      return data;
    },
    returnArr(str) {
      if (!str) return [];
      const arr = str.split('|');
      return arr.map((item) => ({ value: item }));
    },
    returnStr(arr) {
      let str = '';
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (item.value) {
          if (i === 0) {
            str = `${item.value}`;
          } else {
            str = `${str}|${item.value}`;
          }
        }
      }
      return str;
    },
  },
};
</script>
<style lang="less" scoped>
.bottom-box {
  text-align: right;
}
.form-item-box {
  display: flex;
  align-items: flex-start;
  width: 50%;
}
.create-trace {
  /deep/ .el-input.is-disabled .el-input__inner {
    color: #7c7e81;
  }
  .long-label {
    /deep/ .el-form-item__label {
      line-height: 20px;
    }
  }
}
.unit {
  color: #8e8f92;
  margin-left:5px;
}
.title {
  width: 100%;
  font-size: 16px;
  color: #000000d9;
  letter-spacing: 0;
  line-height: 20px;
  font-weight: 650;
  margin-bottom: 20px;
}
.title-last {
  margin-bottom: 25px;
}
.card-inner {
  display: flex;
  flex-wrap: wrap;
}
.config-card {
  margin-bottom: 20px;
  /deep/ .el-card__body{
    padding-bottom: 0;
  }
  /deep/ .el-card__header{
    padding:5px;
    padding-left: 20px;
  }
}
</style>
