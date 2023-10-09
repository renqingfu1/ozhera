<template>
  <TableBox inner-class="log__inner">
    <template slot="header">
      <div class="log__title">
        {{ $t('indexPage.title') }}
      </div>
      <el-button
        type="primary"
        class="log__entry"
        @click="onAccess()">{{  $t('indexPage.btnEntry') }}</el-button>
      <!-- <el-link
            type="primary"
            class="log__doc"
            href="https://wiki.n.miui.com/pages/viewpage.action?pageId=623843413"
            target="_blank"
          >
            <span class="log__doc--text">接入文档</span>
          </el-link> -->
    </template>
    <div class="first-card">
      <FirstCard/>
    </div>
    <div class="second-top">
      <el-tabs type="border-card" class="trending-box">
        <el-tab-pane :label="$t('indexPage.second.label1')">
          <SpaceTrending />
        </el-tab-pane>
        <el-tab-pane :label="$t('indexPage.second.label2')">
          <Trending />
        </el-tab-pane>
      </el-tabs>
      <div class="log__card top-list" >
        <div class="log__card__title">
          <span>{{ $t('indexPage.second.label3') }}</span>
          <span>{{ $t('indexPage.second.subLabel3') }}</span>
        </div>
        <div class="log__card__top">
          <SpaceTopList />
        </div>
      </div>
      <div class="log__card top-list">
        <div class="log__card__title">
          <span>{{ $t('indexPage.second.label4') }}</span>
          <span>{{ $t('indexPage.second.subLabel4') }}</span>
        </div>
        <div class="log__card__top">
          <TopList />
        </div>
      </div>
    </div>
    <div class="log__left bottom-box">
      <div class="log__card" style="margin-top:20px;">
        <div class="log__card__title">
          <span>{{ $t('indexPage.space.title') }}</span>
        </div>
        <div class="log__card__body">
          <SpaceList :isUser="true" />
        </div>
      </div>
    </div>
  </TableBox>
</template>
<script>
// import TableBox from '@/components/TableBox.vue';
// import SpaceList from '@/views/LogConfig/space/space.vue';
import { mapState } from 'vuex';
// import TopList from './components/topList/index.vue';
// import SpaceTopList from './components/topList/spaceList.vue';
// import Trending from './components/trending/index.vue';
// import SpaceTrending from './components/space-trending/index.vue';
// import FirstCard from './components/first-card/index.vue';

export default {
  components: {
    FirstCard: () => import('./components/first-card/index.vue'),
    TableBox: () => import('@/components/TableBox.vue'),
    SpaceList: () => import('@/views/LogConfig/space/space.vue'),
    TopList: () => import('./components/topList/index.vue'),
    Trending: () => import('./components/trending/index.vue'),
    SpaceTopList: () => import('./components/topList/spaceList.vue'),
    SpaceTrending: () => import('./components/space-trending/index.vue'),
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.moduleUserInfo.userInfo,
    }),
  },
  methods: {
    onAccess(params) {
      this.$router.push({
        name: 'User-Access',
        params,
      });
    },
    onFastAccess({ milogAppId, appName }) {
      this.onAccess({
        milogAppId,
        tail: appName,
        appType: 0, // mione 类型
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.log {
  padding-bottom:20px;
  ::v-deep &__inner {
    padding: 0;
    background-color: transparent;
  }
  &__left {
    display: flex;
    flex-direction: column;
    flex: 1;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  &__right {
    margin-left: 20px;
    border-radius: 4px;
    overflow: hidden;
    align-self: flex-start;
  }
  &__title {
    font-weight: bold;
  }
  &__entry {
    margin-left: 34px;
    font-size: 14px;
  }
  &__doc {
    margin-left: 10px;
    font-size: 14px;
    height: 30px;
    vertical-align: middle;
    &--text {
      width: 60px;
      font-size: 12px;
      display: inline-block;
    }
  }
  &__card {
    background-color: white;
    &__title {
      height: 50px;
      display: flex;
      align-items: center;
      padding-left: 24px;
      border-bottom: 1px solid rgba(233, 233, 233, 1);
      span:nth-of-type(1) {
        font-weight: bold;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
      }
      span:nth-of-type(2) {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.4);
        margin-left: 12px;
      }
    }
    &__body {
      padding: 24px 24px 0 24px;
    }
    &__top {
      padding: 10px 24px;
    }
  }
}
.log__card__top{
  padding-left: 0;
  padding-right:0;
}

.second-top{
  display: flex;
}
.top-list{
  width: 310px;
  margin-left: 10px;
  box-shadow: 0 2px 4px 0 rgba(0 ,0 ,0, 12%), 0 0 6px 0 rgba(0 ,0 ,0 , 4%);
}
.trending-box{
  flex: 1;
}
.first-card{
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px 0 rgba(0 ,0 ,0, 12%), 0 0 6px 0 rgba(0 ,0 ,0 , 4%);
  min-width: 1100px;
}
.bottom-box{
  padding-bottom:20px;
  background: #fff;
  margin-bottom: 0;
}
</style>
<style>
.table-box .el-main .log__inner{
  padding:0;
  background: #eff0f4;
}
</style>
