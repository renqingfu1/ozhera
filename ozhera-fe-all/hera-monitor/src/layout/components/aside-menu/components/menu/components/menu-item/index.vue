<template>
  <el-menu-item :index='index'>
    <router-link :to='path'>
      <lone-icon :name='icon' class='menu-icon'/>
      {{ title }}
    </router-link>
  </el-menu-item>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    index: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: false,
      default: 'font-awesome'
    },
    path: {
      type: String,
      required: false,
      default: '/index'
    },
    title: {
      type: String,
      required: false,
      default: '未命名菜单'
    }
  }
}
</script>
<style scoped>
.is-active > .router-link-active{
  color:#1890ff;
}
.el-menu-item:hover {
  background: transparent;
}
.el-menu-item:hover a{
  color:#1890ff;
}

</style>