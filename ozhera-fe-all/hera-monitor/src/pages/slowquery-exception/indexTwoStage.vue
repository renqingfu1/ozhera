<template>
  <div class="error-list">
    <div class="list-content">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.category"
          :name="tab.category"
        >
          <TabLabelSlot slot="label" :label="tab.category" :num="tab.innerTabs.map(item => statistics[item.statistics]).reduce((t, c) => t+c)" />
          <el-tabs
            v-model="activeInnerTab"
            @tab-click="handleInnerTabClick"
            class="inner-tabs"
            style="margin-top: -15px"
          >
            <el-tab-pane
              v-for="item in tab.innerTabs"
              :key="item.value"
              :name="item.value"
            >
              <div slot="label" class="inner-tab-label">
                <TabLabelSlot :label="item.label" :num="statistics[item.statistics]" />
              </div>
              <IndexBox
                v-if="activeInnerTab == item.value"
                :item="item"
                :type="type"
                :activeName="activeInnerTab"
              />
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import showNum99 from "@/utils/showNum99"
import IndexBox from "@/pages/slowquery-exception/IndexBox.vue"
import { mapState } from "vuex";
import TabLabelSlot from '@/pages/slowquery-exception/components/TabLabelSlot.vue';
import tabsContainer from './second-tabs.js';
console.log('tabsContainer',tabsContainer);
export default {
  props: {
    type: {
      require: true,
      type: String,
    },
  },
  components: { 
    IndexBox,
    TabLabelSlot
  },
  computed: {
    ...mapState({
      statistics: state => state.slowquery.nums,
    }),
  },
  data() {
    return {
      activeTab: "",
      activeInnerTab: "",
      tabs: tabsContainer[this.type],
    }
  },
  methods: {
    showNum99,
    handleTabClick(tab) {
      const innerTabs = this.tabs.find(t => t.category === tab.name).innerTabs
      this.handleInnerTabClick({ name: innerTabs[0].value })
      this.activeInnerTab = innerTabs[0].value;
    },
    handleInnerTabClick(tab) {
      let params = {
        ...this.$route.query,
        ...{
          metric: tab.name,
          // start_time: "",
          // end_time: "",
          method_name: "",
        },
      }
      this.$router.push({
        query: params,
      })
      this.activeInnerTab = tab.name
    },
    onSubmit() {
      console.log("报警规则!")
    },
  },
  beforeMount() {
    let queryTab = this.$route.query.metric
    let isInclude = this.tabs.some(t => {
      if (t.innerTabs.some(item => item.value === queryTab)) {
        this.activeTab = t.category
        this.activeInnerTab = queryTab
        return true
      }
      return false
    })
    if (!isInclude) {
      this.activeTab = this.tabs[0].category
      this.activeInnerTab = this.tabs[0].innerTabs[0].value
    }
    console.log("indexException activeTab", this.activeTab, this.activeInnerTab)
  },
}
</script>
<style scoped lang="less">
.error-list {
  padding-bottom: 20px;
  .list-content {
    padding: 20px;
    padding-top: 0;
    margin-right: 16px;
    background: #fff;
    .el-tabs__content .el-tab-pane {
      padding-top: 4px;
      padding-left: 0;
    }
  }
  .inner-tabs {
    /deep/ .el-tabs__active-bar {
      display: none;
    }
    /deep/ .el-tabs__item.is-active .inner-tab-label {
      border-bottom: solid 2px #1890ff;
      box-sizing: border-box;
      height: 49px;
    }
  }
}
</style>
