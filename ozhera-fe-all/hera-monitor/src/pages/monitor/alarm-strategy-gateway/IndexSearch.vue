<template>
  <div>
    <div class="top-box">
      <el-button type="primary" size="small" @click="newCreate">{{ $t('create') }}</el-button>
      <div class="top-right">
          <el-input v-model.trim="formInline.strategyName"
            style="width: 200px;margin-left:10px"
            size="small"
            :placeholder="$t('policyPage.enterName')"
            suffix-icon="el-icon-search"
            @keyup.enter.native.stop="searchData(1)"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    value:{}
  },
  data() {
    return {
      formInline: this.value,
    }
  },
  methods: {
    onSubmit() {
      this.searchData(1);
    },
    searchData(page){
      this.formInline = {...this.formInline,...{page}};
      this.$emit('input',this.formInline);
      this.$emit('getList',this.formInline);
    },
    newCreate() {
      this.$router.push({
        name:'WarnStrategyGatewayCreate',
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
</style>