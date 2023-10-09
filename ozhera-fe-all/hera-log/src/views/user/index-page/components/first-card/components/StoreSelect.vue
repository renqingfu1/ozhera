<template>
    <div ref="popBox" >
      <el-popover
        placement="bottom"
        width="360"
        trigger="manual"
        popper-class="store-select-pop"
        v-model="visible">
        <div class="close-btn">
          <el-button type="text" @click="switchShowPop" >
            <i class="el-icon-close"></i>
          </el-button>
        </div>
        <el-tabs v-model="activeName">
          <el-tab-pane
            :label="$t('storeSelect.label1')" name="first">
            <SelectAppTail @selectSpaceStore="selectApp" />
          </el-tab-pane>
          <el-tab-pane
            :label="$t('storeSelect.label1')" name="second">
            <SpaceStoreTree @selectStore="selectStore" />
          </el-tab-pane>
        </el-tabs>
          <div slot="reference">
            <el-tooltip popper-class="tool-tip-item"
            :content="btnText.replace('</br>',' | ')" placement="top-start" >
              <el-button class="pop-btn" @click="switchShowPop"  type="primary" plain>
                <div class="btn-inner">
                  <p class="top-text" v-html="btnText"></p>
                  <i class="el-icon-caret-bottom"></i>
                </div>
              </el-button>
            </el-tooltip>
          </div>
      </el-popover>
    </div>
</template>
<script>
import SelectAppTail from './components/SelectAppTail.vue';
import SpaceStoreTree from './components/SpaceStoreTree.vue';

export default {
  components: {
    SelectAppTail,
    SpaceStoreTree,
  },
  props: {
    value: {},
  },
  data() {
    return {
      visible: false,
      activeName: 'first',
      initText: this.$t('indexPage.selTips'),
    };
  },
  computed: {
    val: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    btnText: {
      get() {
        const {
          spaceName, tailName, storeName, type,
          appName,
        } = this.val;
        if (type === 'space-store') return `${spaceName} </br> ${storeName}`;
        if (type === 'app') return `${appName} </br> ${tailName}`;
        return this.initText;
      },
      set(val) {
        this.$emit('change', val);
      },
    },
    showTooltip() {
      return !(this.btnText === this.initText);
    },
  },
  methods: {
    selectApp(val) {
      this.btnText = `${val.appName} | ${val.tailName}`;
      this.switchShowPop();
      this.$emit('input', { ...val, type: 'app' });
      this.$emit('change', { ...val, type: 'app' });
    },
    selectStore(val) {
      this.switchShowPop();
      this.btnText = `${val.spaceName} | ${val.storeName}`;
      this.$emit('input', { ...val, type: 'space-store' });
    },
    switchShowPop() {
      this.visible = !this.visible;
    },
    show() {
      document.addEventListener('click', this.hidePanel, false);
    },
    hide() {
      document.removeEventListener('click', this.hidePanel, false);
    },
    hidePanel(e) {
      if (!this.$refs.popBox.contains(e.target)) {
        this.visible = false;
      }
    },
  },
  mounted() {
    this.show();
  },
  beforeDestroy() {
    this.hide();
  },
};
</script>
<style lang="scss" scoped>
.pop-btn{
  padding: 0 26px 0 15px;
  height: 38px;
  .btn-inner{
    position: relative;
    padding-top: 2px;
  }
  .el-icon-caret-bottom{
    position: absolute;
    top: 50%;
    transform: translate(0,-50%);
    margin-left: 3px;
  }
}

.top-text{
  display: inline-block;
  max-width: 165px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 14px;
  text-align: left;
}

.close-btn{
  position: absolute;
  right: 10px;
  top: 2px;
  z-index: 1;
}
.el-icon-close{
  font-size: 20px;
}
</style>
<style>
.tool-tip-item{
  border: solid 1px #303133
}

</style>
