<template>
  <el-popover
    placement="right"
    :width="val.width"
    trigger="hover">
    <p class="score-title">{{val.allTips}}</p>
    <el-table :data="val.detailTips" max-height="480" class="pop-table">
      <el-table-column property="label" label="配置项目"></el-table-column>
      <el-table-column property="value" label="分数" width="50px"></el-table-column>
    </el-table>
    <i class="el-icon-question"  slot="reference"></i>
  </el-popover>
</template>
<script>
export default {
  props:{
    value:{
      
    }
  },
  computed:{
    val(){
      return this.value;
    }
  }
}
</script>
<style scoped>
.score-title{
  padding:10px 0 ;
  font-size: 12px;
  padding-left: 3px;
}
.pop-table >>> td, .pop-table >>> th{
  padding: 2px 0;
  font-size: 12px;
}
</style>