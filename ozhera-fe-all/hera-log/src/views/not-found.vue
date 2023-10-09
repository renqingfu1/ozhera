<template>
  <div class="not-found-box">
    <div class="box">
      <div><img :src="notfoundUrl"/></div>
      <p class="tips">迷路了...</p>
      <div style="text-align:center;">
        <el-button @click="toIndex" type="text" size="small">返回首页</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import notfoundUrl from '@/assets/404.jpg';

export default {
  data() {
    return {
      notfoundUrl,
    };
  },
  methods: {
    toIndex() {
      this.$router.push({ name: 'User' });
    },
  },
};
</script>
<style scope>
.not-found-box{
  background-color: #fff;
  height: 100%;
  display:flex;
  justify-content: center;
  align-items: center;
}
.box{
  font-size: 0;
}
.tips {
  font-size:14px;
  vertical-align: top;
  text-align: center;
  margin: 20px 0 10px 0;
}
</style>
