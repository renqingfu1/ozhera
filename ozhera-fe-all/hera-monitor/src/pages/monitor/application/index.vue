<template>
  <div class="main">
    <div class="app-header">
      <h2>{{ $t('mainName') }}</h2>
    </div>
    <div class="app-content">
      <div class="top-msg">
        <div class="search-form">
          <span class="app-label"> {{ $t('myApp') }}</span>
          <div class="flex-box">
            <el-input
              v-model="appName"
              size="mini"
              @keyup.enter.native="GETINITAPPLIST"
              clearable
              @clear="GETINITAPPLIST"
              :placeholder="$t('myAppSearch')"
              class="my-app-input"
            ></el-input>
            <div class="add-app-btn">
              <el-popover
                placement="top-start"
                :title="$t('addApp')"
                width="400"
                trigger="hover"
              >
                <div>
                  <AppSearch />
                </div>
                <el-button slot="reference" size="mini">{{
                  $t('addApp')
                }}</el-button>
              </el-popover>
            </div>
          </div>
          <!-- <div class="app-type-list">
            <el-radio-group v-model="viewType" @input="inputViewType">
              <el-radio v-for="item in options" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </div> -->
        </div>
        <IndexMsg />
      </div>
      <AppList />
    </div>
    <BottomBox />
  </div>
</template>

<script>
import AppList from '@/components/application/app-list'
import AppSearch from '@/components/application/app-search'
import { mapActions, mapMutations } from 'vuex'
import IndexMsg from './components/IndexMsg.vue'
import BottomBox from './components/BottomBox.vue'

export default {
  name: 'app-list',
  components: {
    BottomBox,
    AppList,
    AppSearch,
    IndexMsg,
  },
  data() {
    return {
      options: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '我参与的',
          value: 0,
        },
        {
          label: '我关注的',
          value: 1,
        },
      ],
    }
  },
  computed: {
    appName: {
      get() {
        return this.$store.state.moduleIndexPage.form.appName
      },
      set(val) {
        this.changeAppName(val)
      },
    },
    viewType: {
      get() {
        return this.$store.state.moduleIndexPage.form.viewType
      },
      set(val) {
        this.changeSearchType(val)
      },
    },
  },
  mounted() {
    this.GETPLATFORMLIST()
  },
  methods: {
    ...mapActions('modulePlatForm', ['GETPLATFORMLIST']),
    ...mapActions('moduleIndexPage', ['GETINITAPPLIST']),
    ...mapMutations('moduleIndexPage', ['changeAppName', 'changeSearchType']),
    inputViewType() {
      this.GETINITAPPLIST()
    },
  },
}
</script>

<style lang="less" scoped>
@indexBackColor: #f5f7fa;
.main {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.main .app-header {
  position: relative;
  border-top: 0;
  text-align: center;
  padding: 30px;
  box-sizing: border-box;
  background: #fff;
  margin-bottom: 10px;
  h2 {
    font-size: 28px;
    color: #1890ff;
    font-weight: 400;
    text-align: center;
  }
}
.app-content {
  height: calc(100% - 162px);
  position: relative;
  width: 100%;
  background: #fff;
  border-top: 1px solid #dcdfe6;
  overflow: hidden;
}
.top-msg {
  height: 40px;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  background: @indexBackColor;
  border-bottom: 1px solid #e9e9e9;
}
.search-form {
  padding-left: 8px;
  display: flex;
  height: 28px;
  line-height: 28px;
  margin-top: 6px;
}
.flex-box {
  display: flex;
  align-items: center;
}
.app-label {
  position: relative;
  word-break: keep-all;
  display: inline-block;
  color: #4ba4ff;
  font-size: 14px;
  margin-right: 20px;
  font-weight: 400;
}
.app-label::after {
  position: absolute;
  bottom: -6px;
  left: -4px;
  content: '';
  width: 66px;
  height: 2px;
  background: #4ba4ff;
}
.app-type-list {
  margin-left: 20px;
  /deep/ .el-radio {
    margin-right: 20px;
  }
}
.my-app-input {
  /deep/ .el-input__inner {
    width: 280px;
    padding-right: 20px;
  }
}
.add-app-btn {
  font-size: 0;
  margin-top: 4px;
  margin-left: 10px;
}
</style>
