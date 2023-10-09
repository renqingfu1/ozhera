<!--
  图标icon组件：基于Font Awesome [font-awesome-4.7.0]
 -->
<template>
  <i :class="`iconfont ${name}`"></i>
</template>

<script>
export default {
  name: 'lone-icon',
  props: {
    name: {
      type: String,
      required: false,
      default: 'font-awesome'
    }
  }
}
</script>