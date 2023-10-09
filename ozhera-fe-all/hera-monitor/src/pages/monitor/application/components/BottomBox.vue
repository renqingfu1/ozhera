<template>
  <div class="index-page-footer">
    <div class="left">
      <i class="left-i">powered by</i>
      <el-button
        type="text"
        class="odin-btn open-btn"
        @click="clickOdin"
        >{{ odinText }}</el-button
      >
      <el-button type="text" class="star-btn" @click="clickStar">
        <i class="iconfont icon-github"></i>
        star
      </el-button>
    </div>
    <div class="center">
      <span class="title">Copyright © 2021 OzHera {{$t('powerTip')}}</span>
    </div>
    <div class="right"></div>
  </div>
</template>
<script>
import InnerQrcode from '@/assets/images/topic-class-qrcode.jpg';
export default {
  data() {
    return {
      odinText: 'odin',
      InnerQrcode
    }
  },
  methods: {
    clickStar() {
      window.open('https://github.com/XiaoMi/ozhera', '_blank')
    },
    clickOdin() {
      return
    },
  },
}
</script>
<style lang="less" scoped>
@indexBackColor: #f5f7fa;
.index-page-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:0 10px;
  height: 50px;
  background: @indexBackColor;
  color: #7f7f7f;
  border: solid 1px #e9e9e9;
  border-left: none;
  border-right: none;
  font-size: 14px;
}
.left {
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;
  .el-button + .el-button {
    margin-left: 6px;
  }
  .open-btn:focus,
  .open-btn:hover {
    color: #7f7f7f;
    cursor: auto;
  }
  .left-i {
    font-style: normal;
  }
  .odin-text {
    margin-right: 8px;
  }
  .odin-btn,
  .odin-text {
    margin-left: 5px;
  }
  .odin-text {
    margin-right: 0;
  }
  .star-btn {
    position: relative;
    padding-left: 7px;
    padding: 7px 5px 7px 9px;
  }

  .star-btn::before {
    position: absolute;
    left: 0;
    top: 8px;
    content: '';
    width: 1px;
    height: 14px;
    background: #7f7f7f;
  }
  .open-btn {
    color: #7f7f7f;
    font-weight: normal;
  }
}
.right{
  width: 180px;
  height: 100%;
}
.qrcode-img{
  width:40px;
  margin-left: 5px;
}
.title,.qrcode-img{
  vertical-align: middle;
}
.qrcode-img-content{
  width: 80px;
}

</style>
<style >
.btm-pop{
  min-width:105px!important;
  line-height: 10px!important;
}
</style>