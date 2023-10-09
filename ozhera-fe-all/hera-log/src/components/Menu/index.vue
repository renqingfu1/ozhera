<template>
  <div class="menu-box">
    <el-menu
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      :unique-opened="false"
    >
      <template v-for="item in menu">
        <div v-if="item.child && item.child.length>0" :key="item.key" >
           <el-submenu  :index="item.key" >
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.text }}</span>
            </template>
            <el-menu-item
              v-for="second in item.child"
              :key="second.key"
              :index="second.key"
            >
              <router-link :to="second.path">{{ second.text }}</router-link>
            </el-menu-item>
          </el-submenu>
        </div>
        <div v-if="!item.child || (item.child && item.child.length===0)" :key="item.key">
          <el-menu-item else :key="item.key" :index="item.key">
            <i :class="item.icon"></i>
            <router-link :to="item.path">{{ item.text }}</router-link>
          </el-menu-item>
        </div>

      </template>
    </el-menu>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  computed: mapState({
    menu: (state) => state.moduleMenu.list,
    defaultActive: (state) => state.moduleMenu.defaultActive,
  }),
  methods: {
    ...mapMutations('moduleMenu', ['updateActiveMutation']),
  },
  mounted() {
    this.updateActiveMutation(this.$route.path);
  },
};
</script>
<style  scoped>
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
.menu-box >>> .iconfont {
  margin:0 10px 0 5px;
}
.el-menu-item:hover a{
  color:var(--ant-primary-color);
}

</style>
