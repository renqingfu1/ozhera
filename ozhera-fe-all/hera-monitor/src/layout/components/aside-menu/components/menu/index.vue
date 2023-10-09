<template>
  <el-menu
    class='menucomp'
    :default-active='defaultActive'
    :text-color='textColor'
    :active-text-color='activeTextColor'
    :default-openeds='defaultOpeneds'
    :collapse='collapse'>
    <template v-for='item in menuList'>
      <menu-item
        v-if='item.path'
        :key='item.index'
        :index='item.index'
        :icon='item.icon'
        :path='item.path'
        :title='item.title'/>
      <menu-link
        v-else-if="item.href"
        :key='item.index'
        :index='item.index'
        :icon='item.icon'
        :href='item.href'
        :title='item.title'/>
      <menu-sub
        v-else
        :key='item.index'
        :index='item.index'
        :title='item.title'
        :icon='item.icon'
        :children='item.children'/>
    </template>
  </el-menu>
</template>

<script>
import menuItem from './components/menu-item'
import menuLink from './components/menu-link'
import menuSub from './components/menu-sub'

export default {
  data(){
    return {}
  },
  props: {
    textColor: {
      type: String,
      required: false,
      default: 'black'
    },
    activeTextColor: {
      type: String,
      required: false,
      default: '#1890ff'
    },
    defaultActive: {
      type: String,
      required: false,
      default: '2.1'
    },
    defaultOpeneds: {
      type: Array,
      required: false
    },
    menuList: {
      type: Array,
      required: true
    },
    collapse: {
      type: Boolean,
      required: true
    }
  },
  components: {
    menuItem,
    menuLink,
    menuSub
  }
}
</script>

<style lang='less'>
.el-menu.menucomp {
  width: 236px;
  border-right: none;
  .menu-icon {
    font-size: 16px;
    margin: 0 9px;
    vertical-align: 0;
  }

  .el-menu-item.is-active {
    position: relative;
    background-color: #e6f7ff;
  }
  .el-menu-item.is-active::after{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    border-right: 3px solid #1790ff;
    transform: scaleY(.0001);
    opacity: 0;
    transition: transform .15s cubic-bezier(.215,.61,.355,1),opacity .15s cubic-bezier(.215,.61,.355,1);
    content: "";
    transform: scaleY(1);
    opacity: 1;
    transition: transform .15s cubic-bezier(.645,.045,.355,1),opacity .15s cubic-bezier(.645,.045,.355,1);
  }
  // .el-submenu__title{
  //   color:black;
  // }
  .el-submenu__title i {
    font-weight: bold;
  }
  .el-menu-item a {
    width: 100%;
    height: 100%;
    display: inline-block
  }
}
// 收缩后宽度
.el-menu.el-menu--collapse {
  width: 58px
}
// 收缩后'弹出菜单'
.el-menu--vertical {
  .el-menu--popup-right-start {
    margin: 0px;
    background: rgb(30, 34, 44);
    .el-menu-item:hover {
      background-color: #ecf8ff
    }
    a {
      width: 100%;
      height: 100%;
      display: inline-block;
      color:red;
    }
    a,a:active {
      color: #fff;
    }
  }
}
</style>
<style scoped>
.el-menu-item >>> a{
  color:#000000d9;
}
</style>