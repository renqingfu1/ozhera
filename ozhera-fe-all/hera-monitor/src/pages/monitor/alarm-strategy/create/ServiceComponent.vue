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
    <el-select v-model="service" :placeholder="$t('pleaseSel')"
      multiple
      class="env-select"
     style="width:405px">
      <el-option
        v-for="item in optionsList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script>

export default {
  props: {
    options:{},
    switchChoose:{
      require: true,
    },
    value:{}
  },
  data() {
    return {
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
    service:{
      get(){
        return this.value
      },
      set(val){
        this.$emit('input', val);
      }
    },
    booleanVal:{
      get(){
        return this.switchChoose
      },
      set(val){
        this.$emit('changeBoolean',val);
      }
    },
    optionsList(){
      return this.options;
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