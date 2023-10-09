<template>
  <div class="method-input">
    <el-input
      v-model="methodName"
      :placeholder="$t('enterMethodName')"
      style="width:190px;"
      @input="changeData"
      @keyup.enter.native="keyDownFn"
      size="small"
    >
    <template slot="append"><el-button slot="append" icon="el-icon-search" class="search-btn" @click="confirm"></el-button></template>
    </el-input>
  </div>
</template>
<script>
export default {
  props:{
    value:{}
  },
  computed:{
    methodName:{
      get(){
        return this.value
      },
      set(val){
        return val
      }
    }
  },
  methods:{
    keyDownFn(){
      var event = window.event || arguments.callee.caller.arguments[0];
      if (event.keyCode == 13){
        this.confirm();
      }
    },
    confirm(){
      this.$emit('input', this.methodName);
      this.$emit('change');
      this.$router.push({
        query:{
          ...this.$route.query,
          method_name :  this.methodName,
        }
      })
    },
    changeData(val){
      this.$emit('input', val);
    }
  }
}
</script>
<style lang="less" scoped>
.method-input{
  /deep/ .el-input-group__append{
    background: #fff;
    border:none;
  }
  .el-input{
    border: solid 1px #DCDFE6;
  }
  .el-input__inner{
    border:none;
  }
}
</style>