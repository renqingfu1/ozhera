<template lang="">
  <div class="add-input-box" >
    <i class="el-icon-circle-plus-outline add-btn" @click="addInput"
      v-if="!disabled">
    </i>
    <ul>
      <li v-for="(item,index) in inputs" :key="index">
        <el-input-number v-model="item.value" v-if="type=='number'"
          class="input-item"></el-input-number>
        <el-input :placeholder="placeholder || '请输入内容'" style="width:300px;" v-model="item.value"
          class="input-item"
          v-else>
        </el-input>
        <i class="el-icon-remove-outline add-btn remove-btn"
          v-if="!disabled"
          @click="removeInput(index)">
        </i>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      default: 'text',
    },
    value: {
      type: Array,
    },
    disabled: {
      type: Boolean,
    },
    placeholder: {
      type: String,
    },
  },
  computed: {
    inputs: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  methods: {
    removeInput(index) {
      this.inputs.splice(index, 1);
    },
    addInput() {
      this.inputs.push({
        value: '',
      });
    },
  },
};
</script>
<style lang="less" scope>
.add-input-box{
  .add-btn{
    line-height: 40px;
    cursor:pointer;
    font-size: 18px;
    color: #8d8e91;
  }
}

.remove-btn{
  margin-left:4px;
}
.input-item{
  margin-bottom:2px;
}
</style>
