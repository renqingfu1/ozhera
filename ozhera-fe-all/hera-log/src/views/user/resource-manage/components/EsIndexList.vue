<template lang="">
  <div class="es-index-list">
    <i class="el-icon-circle-plus-outline i-btn" @click="clickAddEsIndex" v-if="!disabled"/>
    <div class="es-index-item" v-for="(item,index) in multipleEsIndex" :key="index">
      <LogTypeSelect v-model="item.logTypeCode" :options="logTypeOptions" :disabled="disabled"/>
      <el-input type="textarea"
      :disabled="disabled"
      :class="disabled?'disabel-class':'disabel-not-class'"
      v-model="item.esIndexList"
      :autosize="{ minRows: 1}"
      placeholder="es索引,若多个请换行分隔"
      ></el-input>
      <i class="el-icon-remove-outline i-btn i-btn-reduce" @click="reduceEsIndex(index)"
      v-if="!disabled"/>
    </div>
  </div>
</template>
<script>
import LogTypeSelect from '@/components/LogTypeSelect.vue';

export default {
  components: {
    LogTypeSelect,
  },
  props: {
    value: {},
    logTypeOptions: {
      required: true,
    },
    disabled: {
      default: false,
    },
  },
  computed: {
    multipleEsIndex: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  methods: {
    clickAddEsIndex() {
      this.multipleEsIndex.push({
        logTypeCode: '',
        esIndexList: '',
      });
    },
    reduceEsIndex(index) {
      this.multipleEsIndex.splice(index, 1);
    },
  },
};
</script>
<style lang="scss" scoped>

.i-btn{
  font-size: 16px;
  vertical-align: middle;
  line-height:30px;
  color:#a3a4a7;
}
.i-btn-reduce{
  margin-left:3px;
}
.es-index-list{
  .es-index-item {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top:5px;
    .disabel-class{
      margin-left: 5px;
      width: 414px;
    }
    .disabel-not-class{
      margin-left:5px;
      width: 375px;
    }
  }

}

</style>
