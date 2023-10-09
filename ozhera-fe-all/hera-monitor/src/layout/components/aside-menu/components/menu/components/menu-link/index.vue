<template>
  <el-menu-item :index='index'>
    <a :href="href" target='_blank'>
      <lone-icon :name='icon' class='menu-icon'/>
      {{ title }}
    </a>
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
    href: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: '未命名菜单'
    }
  }
}
</script>