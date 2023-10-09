<template>
  <div class="menu-box">
    <el-menu :default-active="defaultActive" class="el-menu-vertical-demo"
     :collapse="isCollapse">
      <el-menu-item :index="item.path" v-for="item in menuAdminUser" :key="item.key" >
        <router-link :to="item.path">
          <div>
             <i :class="item.icon"></i>
              <span slot="title">{{$t(`userMenu.${item.text}`)}}</span>
          </div>
        </router-link>
      </el-menu-item>
    </el-menu>
    <div class="switch-collapse" @click="switchCollapse">
      <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"></i>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState({
      menu: (state) => state.moduleUserMenu.list,
      defaultActive: (state) => state.moduleUserMenu.defaultActive,
      isCollapse: (state) => state.moduleUserMenu.isCollapse,
      userInfo: (state) => state.moduleUserInfo.userInfo,
    }),
    menuAdminUser() {
      const newMenu = this.menu.filter((item) => (this.userInfo.isAdmin ? item : item.type === 'userAdmin'));
      console.log('newMenu', newMenu);
      return newMenu;
    },
  },
  methods: {
    ...mapMutations('moduleUserMenu', ['updateActiveMutation', 'switchCollapse']),
  },
  mounted() {
    this.updateActiveMutation(this.$route.path);
  },
};
</script>
<style  scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 150px;
}
.el-menu-item a {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.el-menu-item.is-active a {
  color: #409eff;
}
.el-menu-item.is-active {
  position: relative;
  background-color: var(--ant-primary-1);
}
.el-menu-item.is-active::after{
  position: absolute;
  content: '';
  top: 0;
  right: 0;
  bottom: 0;
  border-right: 3px  solid var(--ant-primary-color);
}
.menu-box{
  position: relative;
  height: 100%;
}
.menu-box >>> .iconfont {
  margin:0 10px 0 5px;
}
.el-menu-item:hover a{
  color:var(--ant-primary-color);
}
.switch-collapse{
  position: absolute;
  bottom: 0;
  left: 0;
  cursor: pointer;
  width: 100%;
  height: 50px;
  text-align: center;
  line-height: 50px;
}
.switch-collapse:hover{
  background: var(--ant-primary-1);
}
.switch-collapse i{
  font-size:16px;
  color:var(--ant-primary-color);
}
</style>
