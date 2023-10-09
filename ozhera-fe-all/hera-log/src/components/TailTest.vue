<template>
  <div class="tail-test-box">
    <div class="btn-box">
      <el-button type="text" class="switch-show-btn" @click="switchShowFn">
        {{activeNames === '1'?'折叠测试模块':$t('createTail.TestConfiguration')}}
        <i :class="activeNames===''?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
      </el-button>
    </div>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1">
        <div class="text-box">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}"
          placeholder="请输入内容" v-model="msg" size="large" class="tail__item--400"></el-input>
          <el-button type="text" class="test-btn" @click="clickTest">测试</el-button>
        </div>
        <div class="res-box" v-if="JSON.stringify(res)!== '{}'">
          <json-view :data="res" />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import { testTailConfig } from '@/common/req/list/logConfig';
import jsonView from 'vue-json-views';

export default {
  components: { jsonView },
  props: {
    formData: {
      type: Object,
    },
    keyListArr: {

    },
  },
  data() {
    return {
      activeNames: '',
      msg: '',
      res: {},
    };
  },
  methods: {
    handleChange(val) {
      console.log('val', val);
    },
    switchShowFn() {
      this.activeNames = this.activeNames === '1' ? '' : '1';
    },
    clickTest() {
      const params = {
        storeId: this.formData.storeId,
        parseScript: this.formData.parseScript,
        valueList: this.keyListArr.map((item) => item.key).join(','),
        parseType: this.formData.parseType,
        msg: this.msg,
      };
      console.log('params', params);
      testTailConfig(params).then((res) => {
        this.res = res.data || {};
      });
    },
  },
};
</script>
<style scope lang="scss">
.tail-test-box .el-collapse{
  border: none;
  & .el-collapse-item__wrap{
    border:none;
  }
  & .el-collapse-item__header{
    display: none;
  }
}
.tail-test-box{
  margin-left: 104px;
  width: 400px;
  & .switch-show-btn{
    padding:0;
    margin-bottom: 10px;
  }
}
.text-box{
  position: relative;
  & .test-btn{
    position: absolute;
    right:4px;
    bottom: 2px;
    padding:0;
  }
  & .el-textarea__inner{
    resize:none;
  }
}
.res-box{
  margin-top:10px;
  border: solid 1px #e9e9e9;
}
</style>
