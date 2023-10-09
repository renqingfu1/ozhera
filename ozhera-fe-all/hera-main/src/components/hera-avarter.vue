<template>
  <div class="user">
    <Avatar :src="userInfo.avatar || initAvatar" size="large" class="header-avatar"></Avatar>
    <span class="username">{{userInfo.name}}</span>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { userLogout } from '@/common/server/list/user-info';

export default {
  data() {
    return {
      initAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    };
  },
  computed: {
    ...mapState('userModule', ['userInfo']),
  },
  methods: {
    ...mapActions('userModule', ['GETUSERINFO']),
    logout() {
      userLogout();
    },
  },
  mounted() {
    if (!this.userInfo.user) {
      this.GETUSERINFO();
    }
  },
};
</script>
<style scoped>
.user {
  vertical-align: middle;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.user >>> .ivu-avatar-image{
  border:solid 1px #e5e5e5;
}
.user >>> .ivu-avatar-image>img{
  image-rendering: -webkit-optimize-contrast;
  height: auto;
}
.username{
  margin-left: 20px;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  color: #555555;
}
</style>
