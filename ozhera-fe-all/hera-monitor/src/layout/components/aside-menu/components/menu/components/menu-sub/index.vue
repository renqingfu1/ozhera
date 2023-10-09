<template>
  <el-submenu 
    :index='index' class="my-submenu">
    <template slot="title">
      <lone-icon :name='icon' class='menu-icon'/>
      {{ $t(`${title}`) }}
    </template>
    <template v-for='item in children'>
      <menu-item 
        v-if='item.path'
        :key='item.index'
        :index='item.index'
        :icon='item.icon'
        :path='item.path'
        :title="$t(`${item.title}`)">
        <span class="name">
        </span>
      </menu-item>
      <menu-link
        v-else-if="item.href"
        :key='item.index'
        :index='item.index'
        :icon='item.icon'
        :href='item.href'
        :title='item.title'/>
    </template>
  </el-submenu>
</template>

<script>
import menuItem from '../menu-item'
import menuLink from '../menu-link'

export default {
  data() {
    return {}
  },
  props: {
    index: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: '未命名菜单'
    },
     icon: {
      type: String,
      required: false,
      default: 'font-awesome'
    },
    children: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  components: {
    menuItem,
    menuLink
  }
}
</script>
<style scoped>
.my-submenu:hover >>> .el-submenu__title{
  background-color: transparent;
}
.my-submenu:hover >>> .el-submenu__title {
  color: #1890ff;
}
</style>
