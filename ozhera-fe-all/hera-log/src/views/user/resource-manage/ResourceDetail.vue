<template>
  <div class="detail">
    <el-dialog :title="$t('resourceManage.indexTabItem.table.detail')"
     :visible.sync="isShow" width="800px"
      :before-close="beforeClose">
      <div class="detail-box">
        <DescriptionsItem :label="$t('resourceManage.indexTabItem.table.alias')"
        >{{formInline.alias}}</DescriptionsItem>
        <div class="type-region-box">
        <DescriptionsItem label="类型：" v-if="typeOptions.filter(item=>{
          return item.value === type
              }).length>0 && typeOptions.filter(item=>{
              return item.value === type
              })[0].children.filter(itemInner=>{
              return itemInner.value == formInline.regionEn
              }).length>0">
          <template>
            <el-tag>
              {{ typeOptions.filter(item=>{
              return item.value === type
              })[0].label
              }}
            </el-tag> -
            <el-tag>
              {{
              typeOptions.filter(item=>{
              return item.value === type
              })[0].children.filter(itemInner=>{
              return itemInner.value == formInline.regionEn
              })[0].label
              }}
            </el-tag>
          </template>
        </DescriptionsItem>
        </div>
        <DescriptionsItem
          :label="serviceLabel">
          {{type==1?formInline.clusterName:formInline.serviceUrl}}
        </DescriptionsItem>
        <DescriptionsItem
          :label="(type==2||type==1)?'ak：':$t('username')"
        >{{formInline.ak}}</DescriptionsItem>
        <DescriptionsItem
          :label="(type==2||type==1)?'sk：':$t('password')"
        >{{formInline.sk}}</DescriptionsItem>
        <DescriptionsItem :label="$t('resourceManage.indexTabItem.table.teamId')" v-if="type==2">
          {{formInline.orgId}}</DescriptionsItem>
        <DescriptionsItem
        :label="$t('resourceManage.indexTabItem.table.orgId')"
          v-if="type==2">{{formInline.teamId}}</DescriptionsItem>

        <DescriptionsItem :label="$t('resourceManage.tagList')" v-if="type ==4">
          <div style="width:640px;">
            <el-input type="textarea" v-model="formInline.labels"
            disabled
            :autosize="{ minRows: 2}"
            style="width:640px;"></el-input>
          </div>
        </DescriptionsItem>
        <DescriptionsItem :label="$t('resourceManage.esIndexGroup')" v-if="type ==4">
           <EsIndexList
              v-model="formInline.multipleEsIndex"
              :logTypeOptions="logTypeOptions"
              :disabled="true"/>
        </DescriptionsItem>
        <DescriptionsItem :label="$t('updater')">{{formInline.updater}}</DescriptionsItem>
        <DescriptionsItem :label="$t('logConfig.space.table.utime')">
          <MiDateFormat v-model="formInline.utime"/>
        </DescriptionsItem>
        <DescriptionsItem :label="$t('logConfig.space.table.creator')"
        >{{formInline.updater}}</DescriptionsItem>
        <DescriptionsItem :label="$t('logConfig.space.table.ctime')">
          <MiDateFormat v-model="formInline.ctime"/>
        </DescriptionsItem>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getResourceDetail } from '@/common/req/list/resource-manage';
import { mapState } from 'vuex';
import DescriptionsItem from '@/components/DescriptionsItem.vue';
import {
  getTypeDicApi,
} from '@/common/req/list/logConfig';
import MiDateFormat from '../../../components/MiDateFormat.vue';
import { returnResEsIndex } from './common';
import EsIndexList from './components/EsIndexList.vue';

export default {
  components: {
    DescriptionsItem,
    MiDateFormat,
    EsIndexList,
  },
  data() {
    return {
      logTypeOptions: [],
      formInline: {
        ak: '',
        alias: '',
        creator: '',
        ctime: '',
        id: '',
        orgId: '',
        regionEn: '',
        serviceUrl: '',
        sk: '',
        teamId: '',
        type: '',
        types: [],
        updater: '',
        utime: '',
      },
    };
  },
  props: {
    dialogVisible: {
      type: Boolean,
    },
    itemId: {},
    type: {
      required: true,
    },
  },
  computed: {
    isShow: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit('changeDialog', val);
      },
    },
    ...mapState({
      typeOptions: (state) => state.moduleMQConfig.typeOptions,
    }),
    serviceLabel() {
      if (this.type === 1) {
        return this.$t('resourceManage.mqAdd');
      } if (this.type === 2) {
        return 'talos域名';
      }
      return this.$t('resourceManage.esApiAdd');
    },
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    returnResEsIndex,
    getDetail() {
      getResourceDetail({ id: this.itemId, resourceCode: this.type }).then(({ data }) => {
        this.formInline = {
          ...this.formInline,
          ...(data || {}),
          labels: data.labels.join('\n'),
          multipleEsIndex: this.returnResEsIndex(data.multipleEsIndex || []),
        };
        this.changeRegion(this.formInline.regionEn);
      });
    },
    changeRegion(area) {
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
    beforeClose(done) {
      this.$emit('changeDialog', false);
      done();
    },
  },
};
</script>
<style lang="scss" scoped>
.detail-box{
  padding:0 5px;
  ::v-deep .mi-desciption{
    padding:5px 0;
  }
  ::v-deep .el-textarea.is-disabled .el-textarea__inner,
  ::v-deep .el-input.is-disabled .el-input__inner{
    color:#586379;
  }
}
</style>
