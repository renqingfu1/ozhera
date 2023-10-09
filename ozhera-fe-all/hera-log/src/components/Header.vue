<template>
  <div class="header-component">
    <el-header class="header-component-inner" v-if="!powerByQiankun" style="height:100%;">
      <div class="logo-wrap">
        <span class="log-logo">日志管理系统</span>
      </div>
      <div class="user-box">
        <div class="jump-box">
          <el-button  class="admin" plain @click="toIndex" >首页</el-button>
        </div>
        <el-popover
            popper-class="header-pop"
            placement="bottom"
            width="200"
            trigger="hover">
            <ul>
              <li @click="logout">退出</li>
            </ul>
            <div slot="reference" class="user">
              <span class="user-name">{{userInfo.name}}</span>
              <el-avatar :src="userInfo.avatar"></el-avatar>
              <i class="el-icon-caret-bottom" style="font-size:12px;"></i>
            </div>
        </el-popover>
      </div>
    </el-header>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { userLogout, logoutOpen } from '@/common/req/list/user-info';

export default {
  data() {
    return {
      isPro: process.env.NODE_ENV === 'production',
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.moduleUserInfo.userInfo,
    }),
    powerByQiankun() {
      // eslint-disable-next-line no-underscore-dangle
      return !!window.__POWERED_BY_QIANKUN__;
    },
  },
  methods: {
    logout() {
      userLogout().then((res) => {
        const params = {
          TPC_TOKEN: this.getCookie('TPC_TOKEN'),
        };
        logoutOpen(res.data, params).then(() => {
          window.location = '/';
        });
      });
    },
    getCookie(cookieName) {
      const strCookie = document.cookie;
      const cookieList = strCookie.split(';');
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < cookieList.length; i++) {
        const arr = cookieList[i].split('=');
        if (cookieName === arr[0].trim()) {
          return arr[1];
        }
      }
      return '';
    },
    toIndex() {
      this.$router.push({ name: 'User-userIndex' });
    },
  },
};
</script>
<style  scoped>
.header-component{
  height: 50px;
}
.header-component-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  background: #fff;
  padding-left:0;
}
.logo {
  height: 60px;
  line-height: 60px;
  letter-spacing: 1px;
  font-size: 16px;
  color: #fff;
  font-weight: bolder;
  vertical-align: middle;
}
.user-name {
  font-size: 12px;
}
.user-box{
  width: 253px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.user {
  width: 128px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
}
.user-hover {
  width: 100px;
}
li {
  height: 35px;
  line-height: 35px;
  padding: 0 12px;
}
li:hover {
  background: #ecf5ff;
  cursor: pointer;
}
#app ::v-deep .header-pop {
  padding: 0;
}
.log {
  width: 48px;
  vertical-align: middle;
  margin-right: 2px;
}
.logo-wrap {
  display: flex;
  align-items: center;
}
.user >>> .el-avatar>img{
  width: 100%;
  height: auto;
}
.jump-box{
  display: flex;
  padding-right: 10px;
}
.log-logo{
  padding:0 25px;
  font-size: 21px;
  color: #1890ff;
}
</style>
