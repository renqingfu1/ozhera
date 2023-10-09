<template>
  <div>
    <div class="top-box">
      <el-button type="primary" size="small" @click="newCreate">{{ $t('create') }}</el-button>
      <div class="top-right" style="margin-top:-4px">
          <!-- <el-button size="small" @click="showHighSearchFn"  :type="showHighSearch?'primary':''">高级筛选</el-button> -->
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <div class="high-search" v-if="showHighSearch">
              <div>
                <el-form-item :label="$t('policyPage.policyName')">
                  <el-input v-model.trim="formInline.strategyName"
                      style="width: 240px;margin-right:5px;"
                      size="small"
                      :placeholder="$t('policyPage.enterName')"
                      suffix-icon="el-icon-search"
                      @keyup.enter.native.stop="searchData(1)"
                      clearable
                      @clear="searchData(1)"/>
                </el-form-item>
                <el-form-item :label="$t('policyPage.monitoringType')">
                  <StrategyTypeSelect type="ruleNeed" v-model="formInline.strategyType" @input="onSubmit"/>
                </el-form-item>
                <el-form-item :label="$t('appName')">
                  <JionAppSelect v-model="appDetail" @input="onSubmit"/>
                </el-form-item>
                <el-form-item style="margin-right:0;">
                  <el-checkbox :label="$t('policyPage.involved')" v-model="formInline.owner" @change="onSubmit" />
                </el-form-item>
              </div>
              <!-- <el-form-item>
                <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
              </el-form-item> -->
            </div>
          </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import JionAppSelect from "@/components/form-item/JionAppSelect.vue";
import StrategyTypeSelect from "@/components/form-item/StrategyTypeSelect.vue";
export default {
  components:{
    JionAppSelect,
    StrategyTypeSelect,
  },
  props:{
    value:{}
  },
  data() {
    return {
      appDetail:{
        projectId:null,
        projectName:''
      },
      showHighSearch: true,//!!this.value.strategyType || !!this.value.appId,
      formInline: this.value,
    }
  },
  methods: {
    onSubmit() {
      this.searchData(1);
    },
    showHighSearchFn(){
      this.showHighSearch = !this.showHighSearch;
    },
    searchData(page){
      this.formInline = {...this.formInline,
        ...{page},
        ...{
          appId:this.appDetail.projectId,
          appName:this.appDetail.projectName
        }};
      this.$emit('input',this.formInline);
      this.$emit('getList',this.formInline);
    },
    newCreate() {
      this.$router.push({
        name:'warnStrategyCreate',
      })
    },
  },
}
</script>
<style scoped>
.top-box{
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.high-search{
  /* background: #fff; */
  /* padding: 20px 20px 0 20px; */
  /* margin-bottom: 20px; */
  /* display: flex; */
  justify-content: space-between;
  height: 32px;
}
</style>