<template>
   <el-form :inline='true' :model="formInline"  :rules="rules" ref="ruleForm"
   class="dialog-form-inline" label-width="110px">
      <el-form-item :label="$t('resourceManage.indexTabItem.table.alias')"  prop="alias">
        <el-input v-model="formInline.alias"
        :placeholder="$t('resourceManage.indexTabItem.table.alias')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('resourceManage.region')" prop="regionEn">
        <el-select v-model="formInline.regionEn"
        :placeholder="$t('resourceManage.region')" @change="changeRegion">
          <el-option
            v-for="item in typeOptions.filter((item)=>item.value === machineType)[0].children"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="(machineType==2||machineType==1)?
      $t('resourceManage.mqAdd'):$t('resourceManage.EsClusterName')"
       prop="clusterName"
      v-if="machineType===4 || machineType==2 || machineType==1">
        <el-input v-model="formInline.clusterName"

        :placeholder="(machineType==2||machineType==1)?
        $t('resourceManage.mqAdd'):$t('resourceManage.EsClusterName')"></el-input>
      </el-form-item>

      <el-form-item :label="(machineType==2||machineType==1)?
      $t('resourceManage.MQDomainName')
      :$t('resourceManage.esApiAdd')"
        prop="serviceUrl">
        <el-input v-model="formInline.serviceUrl"
        :placeholder="$t('resourceManage.indexTabItem.table.serviceUrl')"></el-input>
      </el-form-item>
      <!-- // es类型 -->
      <el-form-item :label="$t('resourceManage.connectionType')"
      v-if="machineType==4" prop="conWay">
        <LinkType v-model="formInline.conWay" @change="changeConWay"/>
      </el-form-item>
      <div v-if="machineType==4 && formInline.conWay=='token'">
        <el-form-item label="Token"  prop="esToken"
        key="esToken"
        >
          <el-input v-model="formInline.esToken" placeholder="Token"></el-input>
        </el-form-item>
        <el-form-item label="Catalog集群"  prop="catalog"
        key="catalog"
        >
          <el-input v-model="formInline.catalog" placeholder="Catalog集群"></el-input>
        </el-form-item>
        <el-form-item label="库名"  prop="database"
        key="database"
        >
          <el-input v-model="formInline.database" placeholder="库名"></el-input>
        </el-form-item>
      </div>
      <div v-if="machineType==1 ||machineType==2 || machineType==4 && formInline.conWay=='pwd'">
        <el-form-item
        :label="(machineType==2 ||machineType==1)?'ak':$t('username')"
        key="ak"
        prop="ak">
          <el-input v-model="formInline.ak"
          :placeholder="(machineType==2 ||machineType==1)?'ak':$t('username')"></el-input>
        </el-form-item>
        <el-form-item
        key="sk"
        :label="(machineType==2 ||machineType==1)?'sk':$t('password')"
        prop="sk" >
          <el-input v-model="formInline.sk"
          :placeholder="(machineType==2 ||machineType==1)?'sk':$t('password')" ></el-input>
        </el-form-item>
      </div>
      <el-form-item v-if="machineType==1" label="brokerName:" prop="brokerName" >
        <el-input v-model="formInline.brokerName" placeholder="brokerName" ></el-input>
      </el-form-item>
      <el-form-item :label="$t('resourceManage.indexTabItem.table.teamId')"
      prop="orgId" v-if="machineType==2">
        <el-input v-model="formInline.orgId"
        :placeholder="$t('resourceManage.indexTabItem.table.teamId')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('resourceManage.indexTabItem.table.orgId')"
        prop="teamId" v-if="machineType==2">
        <el-input v-model="formInline.teamId"
        :placeholder="$t('resourceManage.indexTabItem.table.orgId')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('resourceManage.tagList')"  prop="labels" >
        <el-input type="textarea" v-model="formInline.labels"
        :autosize="{ minRows: 2}"
        style="width:700px;"
        :placeholder="$t('resourceManage.seperateIndex')"></el-input>
        <div class="tips">{{ $t('resourceManage.addTips') }}</div>
      </el-form-item>
      <div v-if="formInline.regionEn && machineType===4 && logTypeOptions.length>0">
        <el-form-item :label="$t('resourceManage.esIndexGroup')"  prop="multipleEsIndex" >
          <EsIndexList
            v-model="formInline.multipleEsIndex"
            :logTypeOptions="logTypeOptions"/>
        </el-form-item>
      </div>
      <div class='footer-box'>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('ruleForm')">{{$t('confirm')}}</el-button>
          <el-button @click="$emit('closeDialog')">{{ $t('cancle') }}</el-button>
        </el-form-item>
      </div>
    </el-form>
</template>
<script>
import { mapState } from 'vuex';
import { addResource, getResourceDetail } from '@/common/req/list/resource-manage';
import {
  getTypeDicApi,
} from '@/common/req/list/logConfig';
import EsIndexList from '../components/EsIndexList.vue';
import { returnEsIndex, returnResEsIndex } from '../common';
import LinkType from './components/LinkType.vue';

export default {
  components: {
    EsIndexList,
    LinkType,
  },
  computed: {
    ...mapState({
      typeOptions: (state) => state.moduleMQConfig.typeOptions,
    }),
  },
  props: {
    itemId: {},
    machineType: {
      required: true,
    },
  },
  data() {
    const requiredArr = [{ required: true, message: this.$t('isRequired'), trigger: 'change' }];
    const checkCataLog = (rule, value, callback) => callback();
    const checkDatabase = (rule, value, callback) => callback();
    return {
      type: 'newCreate',
      logTypeOptions: [],
      formInline: {
        alias: '',
        serviceUrl: '',
        ak: '',
        sk: '',
        orgId: '',
        teamId: '',
        clusterName: '',
        regionEn: '',
        labels: '',
        multipleEsIndex: [],
        esToken: '',
        conWay: '',
        catalog: '',
        database: '',
        brokerName: '',
      },
      rules: {
        regionEn: requiredArr,
        alias: requiredArr,
        serviceUrl: requiredArr,
        esToken: requiredArr,
        teamId: requiredArr,
        orgId: requiredArr,
        catalog: [{
          validator: checkCataLog, trigger: 'blur',
        }],
        database: [{
          validator: checkDatabase, trigger: 'blur',
        }],
        conWay: requiredArr,
      },
    };
  },
  mounted() {
    if (!this.itemId) return;
    this.getDetail();
  },
  methods: {
    getDetail() {
      getResourceDetail({ resourceCode: this.machineType, id: this.itemId }).then(({ data }) => {
        this.formInline = {
          ...this.formInline,
          ...(data || {}),
          labels: data.labels.join('\n'),
          multipleEsIndex: this.returnResEsIndex(data.multipleEsIndex || []),
        };
        this.getRegion(data.regionEn);
      });
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
    submitFn() { // 编辑
      const sendData = {
        ...this.formInline,
        operateCode: this.itemId ? 2 : 1,
        resourceCode: this.machineType,
        multipleEsIndex: this.returnEsIndex(this.formInline.multipleEsIndex),
        labels: this.formInline.labels.split('\n'),
      };
      addResource(sendData).then(() => {
        this.sucFn();
      }).catch((err) => {
        console.log('err', err);
      });
    },
    returnEsIndex,
    returnResEsIndex,
    sucFn() {
      this.$message({
        type: 'success',
        message: this.itemId ? '编辑成功' : '新增成功',
      });
      this.$emit('closeDialog');
      this.$emit('getListFn', this.itemId ? {} : { page: 1 });
    },
    getRegion(area) {
      getTypeDicApi({ area })
        .then(({ code, data }) => {
          if (code !== 0) {
            return;
          }
          this.logTypeOptions = data ?? [];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeRegion(area) {
      this.formInline.multipleEsIndex = [];
      this.getRegion(area);
    },
    changeConWay() {
      this.formInline = {
        ...this.formInline,
        ak: '',
        sk: '',
        esToken: '',
        catalog: '',
        database: '',
      };
    },
  },
};
</script>
<style scoped>
.footer-box{
 text-align: center;
 margin-top: 10px;
}
.dialog-form-inline >>> .el-input--mini{
 width: 290px;
}
.tips{
 color:#F56C6C;
 font-size: 12px;
 height: 16px;
 line-height: 16px;
}
</style>
