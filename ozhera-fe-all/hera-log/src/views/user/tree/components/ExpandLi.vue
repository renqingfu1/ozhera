<template>
  <el-tabs >
    <el-tab-pane :label="$t('logQuery.table')">
      <ul>
        <li class="item-li title-li">
          <span class="item-key item-span">{{ $t('logQuery.field') }}</span>
          <span class="item-span">{{ $t('logQuery.value') }}</span>
        </li>
        <li  v-for="item in keys" :key="item" class="item-li">
          <span class="item-key item-span">{{ item }}</span>
          <span class="item-span" v-html="val.logOfKV[item]"></span>
        </li>
      </ul>
    </el-tab-pane>
    <el-tab-pane label="JSON">
      <json-view
        :data="val.logOfKVJSON || {}"
        class="json-view-box"
      />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import jsonView from 'vue-json-views';

export default {
  props: {
    val: {},
  },
  components: {
    jsonView,
  },
  computed: {
    keys() {
      return Object.keys(this.val.logOfKV || {});
    },
  },
};
</script>
<style lang="scss" scoped>
.json-view-box.json-view-container {
  background: transparent;
}
.item-li{
  display: flex;
  min-height: 30px;
  line-height: 30px;
  align-items: center;
  color:#000;
  border-bottom: 1px solid #d3dae6;
  .item-span{
    width: calc(100% - 160px);
    word-wrap: break-word;
    font-size: 13px;
    padding: 0 3px;
  }
  &:hover{
    background: rgba(217,236,255,0.4);
  }
}

.item-key{
  min-width: 160px;
}
.title-li{
  .item-span{
    font-size: 13px;
    font-weight: 500;
  }
}
</style>
