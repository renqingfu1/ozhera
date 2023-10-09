<template>
  <div class="unusual-box">
    <ContainerBox :title="$t('policyPage.appAlarmTemp')">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane :label="$t('myTemps')" name="0">
          <TemplateList :type="0" v-if="activeName == '0' || isGetData['0']" />
        </el-tab-pane>
        <el-tab-pane :label="$t('allTemps')" name="1">
          <TemplateList :type="1" v-if="activeName == '1' || isGetData['1']" />
        </el-tab-pane>
      </el-tabs>
    </ContainerBox>
  </div>
</template>
<script>
import ContainerBox from "@/components/ContainerBox.vue";
import TemplateList from '@/components/alarm-template/template-list';

export default {
  components: {
    ContainerBox,
    TemplateList
  },
  data() {
    return {
      activeName: '0', // tab选中值
      isGetData: {'0': true} // 是否已请求过数据
    }
  },
  created() {
  },
  methods: {
    handleClick() {
      this.isGetData[this.activeName] = true;
    },
  }
}
</script>
<style scoped>
</style>
