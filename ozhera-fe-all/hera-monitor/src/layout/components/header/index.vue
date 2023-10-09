<template>
  <div class='header'>
    <div class='left'>
      <div class='logo'></div>
      <div class='name' v-if='expandAside'>{{ title }}</div>
      <div class='expand' @click='handleToggleAside'>
        <lone-icon name='bars' class='icon'/>
      </div>
    </div>
    <div class='right'>
      <header-user/>
    </div>
  </div>
</template>

<script>
import headerUser from './components/header-user'
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      title: process.env.VUE_APP_TITLE || 'HERA'
    }
  },
  components: {
    headerUser
  },
  computed: {
    ...mapState('menu',['expandAside'])
  },
  methods: {
    ...mapMutations('menu',['toggleAside']),
    handleToggleAside() {
      this.toggleAside()
    }
  }
}
</script>

<style lang="less">
.header {
  // min-width: 1280px;
  height: 100%;
  margin-right: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    height: 100%;
    display: flex;
    align-items: center;
    .logo {
      margin-left: 8px;
      width: 60px;
      height: 50px;
      cursor: pointer;
      background-image: url('~@/assets/images/header/logo.png');
      background-size: 100% 100%;
    }
    .name {
      width: 140px;
      margin-left: 5px;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 2px
    }
    .expand {
      padding: 5px;
      text-align: center;
      width: 28px;
      margin-left: 30px;
      .icon {
        cursor: pointer;
        font-size: 26px;
        color: #fff
      }
    }
    .expand:hover {
      background: #518BE0;
      border-radius: 50%;
      opacity: 0.5
    }
  }
}
</style>