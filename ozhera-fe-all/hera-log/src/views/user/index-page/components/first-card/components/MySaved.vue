<template>
  <div class="my-saved">
    <div class="saved-item">
      <p>{{ $t('mySaved.label1') }}</p>
      <SavedItem v-model="keyList" typeName="query" :emptyMsg="$t('noSaveSearch')"
      @selectVal="selectVal" @changeInputV="changeInputV" @changeTime="changeTime"></SavedItem>
    </div>
    <div class="saved-item center-item">
      <p>{{ $t('mySaved.label2') }}</p>
      <SavedItem v-model="tailList" typeName="app" :emptyMsg="$t('noSaveAlias')"
      @selectVal="selectVal"></SavedItem>
    </div>
    <div class="saved-item ">
      <p>{{$t('mySaved.label3')  }}</p>
      <SavedItem v-model="storeList" typeName="store" :emptyMsg="$t('noSaveStore')"
      @selectVal="selectVal"></SavedItem>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import SavedItem from './components/SavedItem.vue';

export default {
  components: {
    SavedItem,
  },
  methods: {
    ...mapActions('moduleSaved', ['GetMySaved']),
    selectVal(val) {
      this.$emit('changeSpaceStoreTail', val);
    },
    changeInputV(val) {
      this.$emit('changeInputV', val);
    },
    changeTime(timers) {
      this.$emit('changeTime', timers);
    },
  },
  computed: {
    ...mapState({
      keyList: (state) => state.moduleSaved.keyList,
      storeList: (state) => state.moduleSaved.storeList,
      tailList: (state) => state.moduleSaved.tailList,
    }),
  },
  mounted() {
    this.GetMySaved();
  },
};
</script>
<style lang="scss" scoped>
.my-saved{
  margin-top: 10px;
  width: 100%;
}
.saved-item{
  display: inline-block;
  vertical-align: top;
  width: 32%;
  border: solid 1px #ecd399;
  height: fit-content;
  p{
    background: #ffeeca;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    font-size: 14px;
    color: #535353;
    font-weight: 500;
  }
}
.center-item{
  margin: 0 10px;
}
</style>
