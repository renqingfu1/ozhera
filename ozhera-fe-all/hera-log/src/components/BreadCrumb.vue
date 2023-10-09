<template>
    <el-breadcrumb separator="/" class="bread-crumb">
      <template  v-for="(item,index) in items">
          <el-breadcrumb-item v-if="item.to" :to="item.to" :key="index">
              {{item.label}}</el-breadcrumb-item>
              <el-breadcrumb-item v-else :key="index">
              {{item.label}}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
</template>
<script>
export default {
  props: {
    items: {

    },
  },
};
</script>
<style scoped>

</style>
