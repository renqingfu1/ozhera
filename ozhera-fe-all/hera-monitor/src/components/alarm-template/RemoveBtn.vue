<template>
  <el-button type="text" @click="clickBtn" style="padding:0;" >
    <i class="el-icon-remove-outline" style="font-size: 20px;color:#b3b3b3;" />
  </el-button>
</template>
<script>
export default {
  methods:{
    clickBtn(){
      this.$emit('click');
    }
  }
}
</script>