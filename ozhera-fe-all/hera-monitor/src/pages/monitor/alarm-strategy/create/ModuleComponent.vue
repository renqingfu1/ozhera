<template>
  <div>
    <el-select v-model="booleanVal" :placeholder="$t('pleaseSel')"
      style="width:90px">
      <el-option
        v-for="item in booleanOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-select v-model="formEnv" :placeholder="$t('pleaseSel')"
      class="env-select"
      multiple
      style="width:405px">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="`${item.moduleName}-${item.funName}`"
        :value="item.funId"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script>
import server from "@/api/service/application.js"

export default {
  props: {
    app: {
      require: true,
    },
    switchChoose:{
      require: true,
    },
    value:{}
  },
  data() {
    return {
      options: [],
      booleanOptions: [
        {
          label: "包含",
          value: true,
        },
        {
          label: "不包含",
          value: false,
        },
      ],
    }
  },
  computed: {
    formEnv:{
      get(){
        return this.value
      },
      set(val){
        this.$emit('input', val);
        this.$emit('change', val);
      }
    },
    appDetail(){
        return this.app
    },
    booleanVal:{
      get(){
        return this.switchChoose
      },
      set(val){
        this.$emit('changeBoolean',val);
      }
    }
  },
  watch: {
    appDetail(val, oldV) {
      if (val.projectId !== oldV.projectId) {
        this.getListData();
      }
    },
  },
  methods: {
    getListData() {
      let {projectId}  = this.appDetail
      server.getMifassModules({projectId}).then((res) => {
        this.options = res;
      })
    },
  },
  mounted() {
    if (this.appDetail.projectId) {
      this.getListData()
    }
  },
}
</script>
<style lang="less" scoped>
.env-select{
  margin-left:5px;
  /deep/ .el-input.el-input--small{
    width:100%;
  }
}
</style>