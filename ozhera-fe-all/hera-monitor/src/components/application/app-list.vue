<template>
  <div
    class="app-list"
    v-loading="loadingAppList"
    :element-loading-text="$t('loading')"
    element-loading-background="rgba(255, 255, 255, 0.35)"
    element-loading-spinner="el-icon-loading"
  >
    <template v-if="indexAppList.length > 0">
      <ScrollBoxVue @reqMore="loadMore" ref="ScrollBox">
        <div class="list-box">
          <div
            v-for="(item, index) in indexAppList"
            :key="index"
            :class="['app-wrap', item.health.type]"
          >
            <div class="app-content healthy app-content-box">
              <p class="top-msg">{{ $t('lastHalfHour') }}</p>
              <div class="title flex">
                <div class="left-title">
                  <el-tooltip
                    :content="item.projectName"
                    effect="dark"
                    placement="top-start"
                    v-if="item.projectName.length > 25"
                  >
                    <span>{{ item.projectName }}</span>
                  </el-tooltip>
                  <span v-else>{{ item.projectName }}</span>
                </div>
                <el-tag
                  :type="item.health.type === 'success' ? 'success' : 'danger'"
                  effect="plain"
                  size="mini"
                  >{{ $t(`indexPage.${item.health.type}`) }}</el-tag
                >
              </div>
              <div class="tag-box">
                <APPTypeVue :owner="item.owner" />
                <Platform :platformType="item.appSource" />
              </div>
              <div class="content flex">
                <div
                  class="col applist-num-loading"
                  v-loading="item.loadingNum"
                  element-loading-spinner="el-icon-loading"
                >
                  <strong :class="item.alertTotal > 0 ? 'red' : ''">
                    {{
                      (item.alertTotal &&
                        (item.alertTotal > 999 ? '999+' : item.alertTotal)) ||
                      0
                    }} </strong
                  ><br />{{ $t('indicatorAlarm') }}
                </div>
                <div
                  class="col"
                  v-loading="item.loadingNum"
                  element-loading-spinner="el-icon-loading"
                  @click="goPageFn(item, { name: 'lodashBoard' })"
                >
                  <strong :class="item.logExceptionNum > 0 ? 'red' : ''">
                    {{
                      (item.logExceptionNum &&
                        (item.logExceptionNum > 999
                          ? '999+'
                          : item.logExceptionNum)) ||
                      0
                    }} </strong
                  ><br />{{ $t('logAlarm') }}
                </div>
                <div
                  class="col"
                  v-loading="item.loadingNum"
                  element-loading-spinner="el-icon-loading"
                  @click="
                    goPageFn(item, {
                      name: 'lodashBoard',
                      activeTab: 'exception',
                    })
                  "
                >
                  <strong :class="item.exceptionTotal > 0 ? 'red' : ''">
                    {{
                      (item.exceptionTotal &&
                        (item.exceptionTotal > 999
                          ? '999+'
                          : item.exceptionTotal)) ||
                      0
                    }} </strong
                  ><br />{{ $t('callException') }}
                </div>
                <div
                  class="col"
                  v-loading="item.loadingNum"
                  element-loading-spinner="el-icon-loading"
                  @click="
                    goPageFn(item, {
                      name: 'lodashBoard',
                      activeTab: 'slowQuery',
                    })
                  "
                >
                  <strong :class="item.slowTotal > 0 ? 'red' : ''">
                    {{
                      (item.slowTotal &&
                        (item.slowTotal > 999 ? '999+' : item.slowTotal)) ||
                      0
                    }} </strong
                  ><br />{{ $t('slowQuery') }}
                </div>
              </div>
              <div class="app-item-footer">
                <AppFooterBtnVue
                  @click="goPageFn(item, { name: 'lodashBoard' })"
                  :label="$t('target')"
                />
                <AppFooterBtnVue @click="toLogPage(item)" :label="$t('log')" />
                <AppFooterBtnVue @click="toTracing(item)" :label="$t('link')" />
                <div class="footer-col">
                  <AppListDropDownVue :item="item" :index="index" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="no-more" v-if="noMoreApp && indexAppList.length > 16">
          {{ $t('allLoaded') }}
        </div>
      </ScrollBoxVue>
    </template>
    <template v-else>
      <el-empty
        :description="$t('emptyDescription')"
        class="empty-app"
        v-if="!loadingAppList"
      ></el-empty>
    </template>
  </div>
</template>

<script>
import qs from 'qs'
import Platform from '@/components/application/platform.vue'
import AppListDropDownVue from './app-list-components/AppListDropDown.vue'
import { mapActions, mapState } from 'vuex'
import server from '@/api/service/application.js'
import ScrollBoxVue from '../ScrollBox.vue'
import APPTypeVue from './app-list-components/APPType.vue'
import AppFooterBtnVue from './app-list-components/AppFooterBtn.vue'

export default {
  components: {
    Platform,
    AppListDropDownVue,
    ScrollBoxVue,
    APPTypeVue,
    AppFooterBtnVue,
  },
  name: 'app-list',
  computed: {
    ...mapState({
      indexAppList: state => state.moduleIndexPage.indexAppList,
      loadingAppList: state => state.moduleIndexPage.loadingAppList,
      noMoreApp: state => state.moduleIndexPage.noMoreApp,
    }),
  },
  data() {
    return {
      delLoading: false, // 删除按钮loading效果
    }
  },
  mounted() {
    this.GETINITAPPLIST()
  },
  methods: {
    ...mapActions('moduleIndexPage', ['GETINITAPPLIST', 'LOADMOREAPP']),
    toTracing(item) {
      let path = `/project-hera-tracing?service=${this.returnTracingName(item)}`
      this.goPageFn(item, { path }, true)
    },
    returnTracingName(item) {
      let service
      if (item.appSource >= 6 && item.appSource <= 10) {
        service = `${item.projectId}_${item.projectName}`
      } else if (item.appSource === 0 || item.appSource === 2) {
        service = `${item.projectId}-${item.projectName}`
      } else {
        service = item.projectName
      }
      return service
    },
    // 跳转页面 toOtherProject:跳转到其他项目
    goPageFn(item, routerParam, toOtherProject) {
      if (toOtherProject) {
        this.historyPush({}, routerParam.path)
      } else {
        const param = {
          id: item.projectId,
          name: item.projectName,
        }
        const query = {
          ...param,
          activeTab: routerParam.activeTab,
        }
        if (routerParam.name == 'lodashBoard') {
          // 存储已访问项目数据到localStorage
          window.sessionStorage.setItem('projectSelect', JSON.stringify(param))
          window.sessionStorage.removeItem('datePickerSelect') // 移除选择时间数据
          query.start_time = item.sTime
          query.end_time = item.eTime
        }
        this.$router.push({
          ...routerParam,
          query,
        }) // 跳转到
      }
    },
    historyPush(query, path) {
      const state = qs.stringify(query)
      const title = ''
      const url = state.length > 0 ? `${path}?${state}` : `${path}`
      history.pushState(window.history.state, title, url)
    },
    toLogPage(item) {
      let params = {
        appId: item.projectId,
        platFormCode: item.appSource,
      }
      server.getLogPage(params).then(res => {
        let { spaceId, storeId } = res
        const path =
          spaceId && storeId
            ? `/project-milog/user/space-tree?spaceId=${spaceId}&storeId=${storeId}`
            : '/project-milog/user/index'
        this.goPageFn(item, { path }, true)
      })
    },
    loadMore() {
      this.LOADMOREAPP()
    },
  },
}
</script>
<style lang="less" scoped>
.app-list {
  height: calc(100% - 38px);
  // overflow-y: auto;
  .el-loading-mask {
    background: initial;
  }
}
.empty-app {
  padding: 100px 0;
  text-align: center;
  width: 100%;
}
.list-box {
  display: flex;
  flex-wrap: wrap;
  padding: 4px 20px;
  .app-wrap {
    width: 25%;
    min-width: 290px;
    padding: 8px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    &:before {
      content: '';
      position: absolute;
      top: 7px;
      bottom: 7px;
      left: 7px;
      right: 7px;
      border: 1px solid transparent;
      border-radius: 3px;
      transition: border 300ms;
    }
  }
  .app-content {
    position: relative;
    height: 180px;
    padding: 20px 0 33px 9px;
    color: #565656;
    border: 1px solid #e9e9e9;
    background: #fff;
    border-radius: 2px;
    box-sizing: border-box;
    z-index: 2;
    transition: border 300ms;
    .flex {
      display: flex;
      align-items: center;
    }
    .title {
      padding: 0 10px 0 30px;
      box-sizing: border-box;
      .left-title {
        padding-right: 8px;
        font-size: 18px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        cursor: pointer;
      }
    }
    .content {
      padding-top: 10px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.447058823529412);
      line-height: 1.6;
      strong {
        font-size: 24px;
        color: #52c41a;
        font-weight: 700;
        &.red {
          color: #f56c6c;
        }
      }
      .col:last-child {
        flex: inherit;
        width: 25%;
      }
      .col:hover {
        color: #1890ff;
      }
    }
    .col {
      display: block;
      flex: 1;
      color: inherit;
      cursor: pointer;
      text-align: center;
    }
    svg {
      fill: #8d8e8f;
    }
    &:before {
      content: '';
      width: 10px;
      position: absolute;
      top: -1px;
      left: -1px;
      bottom: -1px;
      z-index: 10;
      border-radius: 2px 0 0 2px;
    }
    &.add {
      display: flex;
      padding: 20px;
      font-size: 52px;
      color: #999;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &:hover {
        transition: box-shadow 300ms;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
      }
    }
    // 应用健康效果
    &.healthy {
      &:before {
        background: rgba(82, 196, 26, 1);
      }
    }
  }
  .success {
    &:hover {
      &:before,
      .app-content {
        border-color: #52c41a;
      }
    }
  }
  .warning {
    .app-content {
      &:before {
        background: #ffaa02;
      }
    }
    &:hover {
      &:before,
      .app-content {
        border-color: #ffaa02;
      }
    }
  }
  .danger {
    .app-content {
      &:before {
        background: #e14819;
      }
    }
    &:hover {
      &:before,
      .app-content {
        border-color: #e14819;
      }
    }
  }
}

.app-list .app-content-box {
  padding-right: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 8%);
}
.top-msg {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 12px;
  padding: 3px 3px 3px 10px;
  color: #a1a1a1;
  background: linear-gradient(
    to left,
    rgba(170, 213, 255, 60%),
    rgba(170, 213, 255, 1%)
  );
}

.tag-box {
  padding: 5px 0 0 30px;
  display: flex;
  align-items: center;
  /deep/ .el-tag--info + .el-tag--info {
    margin-left: 5px;
  }
}
.applist-num-loading {
  /deep/ .el-icon-loading {
    color: var(--ant-primary-color);
  }
}
.no-more {
  text-align: center;
  padding: 2px 0;
  background: rgb(255, 252, 236, 60%);
  font-size: 12px;
}

.app-item-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 9;
  width: 100%;
  height: 33px;
  color: #999;
  text-align: center;
  border-top: 1px solid #e9e9e9;
  background: #fff;
  padding-left: 9px;
  display: flex;
}
.footer-col {
  cursor: pointer;
  flex: 1;
  height: 32px;
  line-height: 32px;
  /deep/ .el-dropdown-link:hover {
    color: #1890ff;
  }
}
</style>
