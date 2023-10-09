<template>
  <el-popover
    popper-class="table-key-filter-pop"
    placement="right"
    width="200"
    trigger="hover">
    <ul>
      <li v-for="item in keyList" :key="item" class="key-item"
      :class="selKeys.indexOf(item)>=0?'active':''">
        <span class="key-name" >{{ item }}</span>
        <el-button
        :icon="selKeys.indexOf(item)>=0?'el-icon-minus':'el-icon-plus'"
        circle class="filter-btn" @click="optionKey(item)"></el-button>
      </li>
    </ul>
    <el-button slot="reference" size="mini" type="text">
      <span >{{$t('logQuery.filerFiled')}}</span>
      <i class="iconfont icon-filter"></i></el-button>
  </el-popover>
</template>
<script>

export default {
  props: {
    keyList: {},
    selKeys: {},
  },
  methods: {
    optionKey(val) {
      this.$emit('changeSel', {
        type: this.selKeys.indexOf(val) >= 0 ? 'del' : 'add',
        val,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.filter-btn{
  padding:2px;
}
.icon-filter{
  font-size: 13px;
}
.key-item{
  height:24px;
  padding:2px 10px;
  display: flex;
  align-items: center;
  &:hover{
    background: #F5F7FA;
  }
  .key-name{
    display: inline-block;
    height: 100%;
    flex:1;
    max-width: 160px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
.active{
  .key-name{
    color: #409EFF;
  }
}

</style>
<style>
.table-key-filter-pop{
  padding-left:0;
  padding-right:0;
}
</style>
