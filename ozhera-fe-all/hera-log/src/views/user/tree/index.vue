<template>
  <div class="space-tree-main">
    <div class="space-box">
      <span class="space-inner">{{ $t('tree.title') }}</span>
      <div class="header-select space-inner">
        <el-select
          v-model="formInline.spaceId"
          :placeholder="$t('tree.select')"
          @change="changeSpace"
          @visible-change="changeShow"
          filterable
          :class="showOption?'show-option select-class':'hide-option select-class'"
        >
          <el-option
            v-for="item in spaceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <div class="space-name" :class="showOption?'hide-name':'show-name'">
          {{spaceOptions.filter(item=>item.value ===formInline.spaceId) &&
          spaceOptions.filter(item=>item.value ===formInline.spaceId)[0] &&
          spaceOptions.filter(item=>item.value ===formInline.spaceId)[0].label}}
        </div>
      </div>
    </div>
    <div class="bot-box" v-if="$route.query.spaceId">
      <TreeComponent class="left" :editDisabled="editDisabled"/>
      <Tabs class="right"/>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { getAllSpace } from '@/common/req/list/user/index';
import isMiFELogSpace from '@/utils/isMiFELogSpace';
import TreeComponent from './treeComponent.vue';
import Tabs from './tabs.vue';

export default {
  components: {
    TreeComponent,
    Tabs,
  },
  data() {
    return {
      showOption: false,
      formInline: {
        spaceId: '',
      },
      spaceOptions: [],
      editDisabled: false, // 是否允许编辑当前space
    };
  },
  methods: {
    ...mapMutations('moduleSpaceTree', ['emptyTabs']),
    ...mapMutations('moduleUserMenu', ['menuSwitchCollapse']),
    changeSpace(val) {
      this.emptyTabs();
      this.$router.push({ name: 'User-SpaceTree', query: { spaceId: val } });
    },
    getAllSpaceApi() {
      getAllSpace().then((res) => {
        this.spaceOptions = res.data || [];
        let curSpaceId = null;
        if (this.$route.query.spaceId) {
          curSpaceId = parseInt(this.$route.query.spaceId, 10);
        } else if (this.spaceOptions.length > 0) {
          curSpaceId = this.spaceOptions[0].value;
          this.$router.push({ query: { spaceId: curSpaceId } });
        } else {
          return;
        }
        this.formInline = { ...this.formInline, spaceId: curSpaceId };
      }).catch((err) => {
        console.log('err', err);
      });
    },
    changeShow(val) {
      this.showOption = val;
    },
  },
  mounted() {
    this.menuSwitchCollapse(true);
    this.getAllSpaceApi();
  },
  beforeDestroy() {
    this.emptyTabs();
  },
  watch: {
    $route(to) {
      if (!to.query.spaceId && this.spaceOptions.length > 0) {
        const curSpaceId = this.spaceOptions[0].value;
        this.$router.push({ query: { spaceId: curSpaceId } });
      }
    },
    'formInline.spaceId': {
      handler(value) {
        const space = this.spaceOptions.find((item) => item.value === value);
        this.editDisabled = isMiFELogSpace(space?.label); // MiFE代理日志不允许编辑
      },
    },
  },
};
</script>
<style  scoped>
.space-tree-main {
  height: 100%;
  background: #fff;
}
.bot-box{
  display: flex;
  height: calc(100% - 58px);
}
.left {
  border-right: solid 1px #e6e6e6;
  width: 237px;
}
.space-box{
  height: 50px;
  padding: 0px 0 0 20px;
  border-bottom: 1px solid #e6e6e6;
  padding: 15px 10px;
}
.space-box >>> .el-input__inner{
  border:none;
  padding-left: 0;
  font-size: 16px;
  color: rgba(0,0,0,0.85);
  font-weight: 650;
  height: 28px;
  line-height: 28px;
}
.space-box  >>> .el-input__suffix-inner .el-input__icon{
  font-size: 16px;
  color: rgba(0,0,0,0.85);
  font-weight: 650;
}
.space-box  >>> .el-input--mini{
  width: 100%;
}
.space-name{
  font-size: 16px;
  font-weight: 650;
  padding-right: 30px;
  color: rgba(0,0,0,0.85);
}
.space-box >>> .el-form-item__label{
  font-size: 16px;
  font-weight: 650;
  padding-right: 0;
  vertical-align: top;
}
.right{
  width: calc(100% - 237px);
  height: 100%;
}
.right >>> .el-tabs{
  height: 100%;
}
.space-box .header-select {
  position: relative;
  display: inline-block;
  height: 32px;
  vertical-align: middle;
  margin-bottom:0;
}
.header-select >>> .el-icon-arrow-up:before {
  content: "\e78f";
}
</style>
<style lang="scss" scoped>
.select-class{
  width: 100%;
  height: 32px;
  position: absolute;
  top: 0;
  left: 0;
}
.hide-option{
  ::v-deep .el-input__inner{
    opacity: 0;
  }
}
.show-option{
  z-index: 1;
  ::v-deep .el-input__inner{
    opacity: 1;
  }
}
.hide-name{
  opacity: 0;
}
.space-inner{
  vertical-align: top;
  font-weight: 500;
}
</style>
