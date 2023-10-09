<template>
  <div id="app">
    <!-- <el-select v-model="langMode" :placeholder="$t('pleaseSel')">
      <el-option
        size="small"
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select> -->
    <router-view></router-view>
  </div>
</template>

<script>
import {mapMutations} from 'vuex';
export default {
  data() {
    return {
      options:[
        {
          label:'英文',
          value:'en'
          },{
          label:'中文',
          value:'zh'
        }
      ]
    }
  },
  computed: {
    langMode:{
      get(){
        return this.$store.state.moduleLang.langMode;
      },
      set(val){
        this.$emit('input',val);
        this.setLang(val);
        this.$i18n.locale=val
      }
    }
  },
  components: {},
  methods:{
    ...mapMutations('moduleLang',['setLang']),
  },
  mounted(){
    console.log('this.')
  }
}
</script>

<style lang="less">
// 全局
@import '~@/assets/style/global';
</style>
