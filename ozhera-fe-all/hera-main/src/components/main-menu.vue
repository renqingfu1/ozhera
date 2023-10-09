<template>
  <div class="menu-box">
      <div class="logo-box">
        <div class="hera-logo">
          <img src="@/assets/logo.png" class="logo-img" />
          <span class="logo-text">OzHera</span>
        </div>
      </div>
      <Menu
        :active-name="activeIndex"
        class="main-menu"
        mode="horizontal"
        text-color="rgba(0,0,0,0.85)"
        active-text-color="#1890FF"
      >
        <MenuItem v-for="item in menuData" :name="item.id" :key="item.id">
          <router-link :to="item.path">{{ $t(`${item.text}`) }}</router-link>
        </MenuItem>
        <Submenu name="helpObj.id" class="help-li">
            <template #title>
              {{ $t(`${helpObj.label}`) }}
            </template>
            <MenuItem
              v-for="item in helpObj.children" :name="item.id" :key="item.id" class="sub-item">
              <a class="jump-text" :href="item.link"  target="_blank">{{ $t(`${item.label}`) }}</a>
            </MenuItem>
        </Submenu>
      </Menu>
    <div class="menu-right">
      <LocalesSelect style="margin-right: 20px;"/>
      <HeraAvatar />
    </div>
  </div>
</template>
<script>
import { initGlobalState } from 'qiankun';
import HeraAvatar from '@/components/hera-avarter.vue';
import LocalesSelect from '@/components/locales-select.vue';

const { onGlobalStateChange, offGlobalStateChange } = initGlobalState({});

export default {
  components: {
    HeraAvatar,
    LocalesSelect,
  },
  data() {
    return {
      defaultActive: '1',
      activeIndex: '1',
      isMioneLog: true,
      menuData: [
        {
          path: '/project-target-monitor/application',
          text: 'mainMenu.application',
          id: '1',
        },
        {
          path: '/project-target-monitor/application/dash-board',
          text: 'mainMenu.metric',
          id: '2',
        },
        {
          path: '/project-milog/user/index',
          text: 'mainMenu.log',
          id: '3',
        },
        {
          path: '/project-hera-tracing/traceid',
          text: 'mainMenu.trace',
          id: '4',
        },
        {
          path: '/project-config/trace-config',
          text: 'mainMenu.setting',
          id: '6',
        },
      ],
      helpObj: {
        id: 7,
        label: 'mainMenu.help',
        children: [
          {
            link: 'https://github.com/XiaoMi/ozhera/blob/master/readme/user-manual/user-manual-document.md',
            label: 'mainMenu.manual',
            id: '7-1',
          },
        ],
      },
    };
  },
  methods: {
    setActive() {
      const { path } = this.$route;
      const paths = path.split('/');
      const projectName = paths[1];
      if (projectName !== 'project-target-monitor') {
        const activeObjectiveObj = this.menuData
          .filter((item) => item.path.indexOf(projectName) >= 0);
        this.activeIndex = activeObjectiveObj[0].id;
      } else {
        const secondPath = paths.splice(2).join('/');
        this.activeIndex = (secondPath === 'application' || secondPath === '') ? '1' : '2';
        if (secondPath === 'aggregation') {
          this.activeIndex = '8';
        }
      }
    },
    getMode() {
      onGlobalStateChange((state) => {
        const { menuMode } = state;
        this.isMioneLog = menuMode === 'all';
      });
    },
  },
  watch: {
    $route() {
      this.setActive();
    },
  },
  mounted() {
    this.setActive();
  },
  created() {
    this.getMode();
  },
  beforeDestroy() {
    offGlobalStateChange();
  },
};
</script>
<style scoped>
.logo-box{
  width: 170px;
}
.logo-text {
  color:#1890ff;
  font-weight: bolder;
  font-size: 25px;
  margin-left: 3px;
}
.logo-img {
  width: 43px;
}
.menu-box {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding-right:20px;
  height: 50px;
  box-shadow: 0px 3px 5px rgb(170 170 170 / 27%);
  background: #fff;
  z-index: 1000;
  min-width: 1260px;
}

.menu-right {
  display: flex;
}

.ivu-menu-horizontal  > .ivu-menu-item {
  font-size: 0;
}
.ivu-menu-horizontal  > .ivu-menu-item.ivu-menu-item-active a {
  color: var(--ant-primary-color);
}
.ivu-menu-horizontal  > .ivu-menu-item a:hover{
  background: #ecf5ff;
  color: var(--ant-primary-color);
}
.menu-box >>> .ivu-menu-item{
  padding: 0;
}
.menu-box >>> .ivu-menu-item a,.menu-box >>> .ivu-menu-submenu-title{
  display: inline-block;
  width: 100%;
  height: 100%;
  padding:0 18px;
  line-height: 50px;
  font-size:16px;
  vertical-align: top;
  font-weight: 700;
  color: var(--usual__title_color);
}
.menu-box >>> .ivu-menu-submenu-title{
  padding:0;
}
.sub-item a.jump-text{
  font-size: 14px;
  font-weight: normal;
  line-height: 20px;
  padding:0;
  color:#515a6e;
}
.menu-box >>> .ivu-menu-horizontal.ivu-menu-light:after{
  background: #fff;
}
.jump-box{
  float: left;
  height: 50px;
}
.main-menu{
  height:100%;
}
.hera-logo{
  display: flex;
  align-items: center;
  padding-left: 40px;
  height: 50px;
}
.help-li >>> .ivu-menu-submenu-title>i{
  margin-right: 0;
}
</style>
