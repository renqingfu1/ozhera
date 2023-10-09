<template>
  <el-select
    class="member-select"
    v-model="val"
    multiple
    filterable
    remote
    reserve-keyword
    placeholder="请输入账户名"
    :remote-method="remoteMethod"
    :loading="loading">
    <el-option
      v-for="item in options"
      :key="item.name"
      :label="item.name"
      :value="item.name">
    </el-option>
  </el-select>
</template>
<script>
  import server from "@/api/service/alarm-srategy";
  export default {
    props:{
      value:{}
    },
    data() {
      return {
        options: [],
        list: [],
        loading: false,
      }
    },
    computed:{
      val:{
        get(){
          return this.value
        },
        set(val){
          this.$emit('input', val);
        }
      }
    },
    mounted() {
      this.remoteMethod('');
    },
    methods: {
      remoteMethod(query) {
        this.loading = true;
        server.searchGroupApi({name:query}).then(res=>{
          this.loading = false;
          this.options = res.list ||[];
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.member-select{
  width: 100%;
  /deep/ .el-input.el-input--small{
    width: 100%;
  }
}
</style>
