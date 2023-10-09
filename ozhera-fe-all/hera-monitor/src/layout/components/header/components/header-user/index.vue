<template>
  <div class='user'>
    <div class="name">{{(userInfo && userInfo.name) || 'Hera'}}</div>
    <el-dropdown size='small' disabled>
      <span class="el-dropdown-link userimage">
        <span class='image'>
          <img :src="avatarImg" alt="">
        </span>
        <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
      </span>
      <el-dropdown-menu slot='dropdown'>
        <!-- <el-dropdown-item>
          <lone-icon name='cube'/>
          个人中心
        </el-dropdown-item>
        <el-dropdown-item>
          <lone-icon name='cube'/>
          自定义配置
        </el-dropdown-item>
        <el-dropdown-item>
          <lone-icon name='cube'/>
          退出
        </el-dropdown-item> -->
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {
      avatarImg: '',
      userInfo: {}
    }
  }
}
</script>

<style lang="less">
.user {
  display: flex;
  align-items: center;
  .name {
    margin-right: 10px;
  }
  .userimage {
    display: flex;
    align-items: center;
    cursor: pointer;
    .image {
      width: 36px;
      height: 36px;
      // border-radius: 50%;
      background: #a3a3a3;
      margin-right: 3px
    }
  }
}
</style>