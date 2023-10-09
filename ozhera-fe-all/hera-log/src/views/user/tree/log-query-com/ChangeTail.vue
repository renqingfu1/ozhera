<template>
  <div class="change-tail">
    <div class="tail-name" v-if="tailName">
      <span>{{ $t('storeSelect.label1') }}：{{tailName}}</span>
      <i class="iconfont icon-wrong" @click="deleteTail"></i>
    </div>
    <el-popover
      placement="bottom-start"
      popper-class="change-tail-pop"
      ref="changeTailPop"
      v-model="showpop"
      trigger="manual">
      <div class="">
        <h3 class="title">{{tailName?$t('edit'):$t('create')}}{{ $t('filter') }}</h3>
        <div class="detail-box">
          <span>{{ $t('storeSelect.label1') }}</span>
          <el-select
            v-model="tail"
            filterable
            :placeholder="$t('logquery.selAppAlias')"
            clearable
            width="300px"
            multiple
          >
            <el-option
              v-for="item in tailsOptions"
              :key="item.id"
              :label="item.tail"
              :value="item.tail"
            >
            </el-option>
          </el-select>
          <div class="bot">
            <el-button size="mini" @click="closePop">{{ $t('cancle') }}</el-button>
            <el-button type="primary" plain size="mini" @click="confirm">
              {{ $t('confirm') }}
            </el-button>
          </div>
        </div>
      </div>
      <el-button type="text" slot="reference" @click="switchShowPop"
      class="btn-filter">+
      {{tailName?$t('edit'):$t('create')}}{{ $t('filter') }}</el-button>
    </el-popover>
  </div>
</template>
<script>
export default {
  props: {
    tailsOptions: {
      type: Array,
    },
  },
  data() {
    return {
      showpop: false,
      tail: [],
      tailName: '',
    };
  },
  methods: {
    confirm() {
      this.tailName = this.tail.join(',');
      this.$emit('input', this.tailName);
      this.closePop();
    },
    switchShowPop() {
      this.showpop = !this.showpop;
    },
    closePop() {
      this.$refs.changeTailPop.doClose();
    },
    deleteTail() {
      this.tail = [];
      this.tailName = '';
      this.$emit('input', this.tailName);
    },
  },
  mounted() {
    const { tailName } = this.$route.query;
    if (tailName) {
      this.tail = tailName.split(',');
      this.confirm();
    }
  },
};
</script>
<style lang="scss">
.tail-name{
  padding:0 5px;
  height: 28px;
  line-height: 28px;
  display: inline-block;
  border:solid 1px #e9e9e9;
  color: rgba(0,0,0,.65);
  margin-right: 10px;
  span,.icon-wrong{
    font-size: 12px;
    vertical-align: top;
  }
  .icon-wrong{
    cursor: pointer;
    margin-left:3px;
  }
}
.el-popover.change-tail-pop{
  padding: 0;
  border-radius: 0;
  margin-top:5px;
  .title{
    border-bottom: solid 1px #d9d9d9;
    padding:0 16px ;
    height: 40px;
    line-height: 40px;
    color:rgba(0, 0, 0, 0.64);
    font-size: 14px;
    font-weight: 400;
  }
  .detail-box{
    padding:20px;
    display: flex;
    .el-input--mini{
      width: 300px;
    }
  }
  .bot{
    padding:0px 0px 0 10px;
    text-align: right;
  }

}
.btn-filter span{
  font-weight: 400;
}
</style>
