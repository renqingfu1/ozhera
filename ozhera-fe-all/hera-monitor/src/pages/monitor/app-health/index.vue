<template>
  <div class="app-health">
    <ContainerBox :title="$t('AppHealth')">
      <el-tabs type="border-card" v-model="activeTab">
        <el-tab-pane :label="$t('appHealthPage.title')" name="1">
          <ListAPPHealth/>
        </el-tab-pane>
        <!-- <el-tab-pane v-if="isAllMenuMode" label="网关报警配置健康度" name="2">
          <ListTeslaHealth/>
        </el-tab-pane> -->
      </el-tabs>
    </ContainerBox>
  </div>
</template>
<script>
import ContainerBox from "@/components/ContainerBox.vue";
// import ListTeslaHealth from './list/ListTeslaHealth.vue';
import ListAPPHealth from './list/ListAPPHealth.vue';
import { mapState } from "vuex"
export default {
  components:{
    ContainerBox,
    ListAPPHealth,
    // ListTeslaHealth
  },
  computed: {
    ...mapState({
      isAllMenuMode: state => state.menu.isAllMenuMode,
    }),
  },
  data(){
    return {
      activeTab: '1',
    }
  },
  watch: {
    isAllMenuMode(newValue) {
      if(!newValue) {//切到精简模式
        this.activeTab = '1'
      }
    }
  }
}
</script>