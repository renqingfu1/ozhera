<template>
  <ul  v-if="list.length>0">
    <li class="store-item" v-for="(store,index) in list" :key="store.value +''+index">
      <StoreItem
      :data="store"
      @clickStore="clickStore"
      @clickTailFn="clickTailFn"
      @deleteTail="deleteTail"
      @clickProgress="clickProgress"
      @clickAddTail="clickAddTail"
      @showAnalysis="showAnalysis"
      @editStore="editStore"
      />
    </li>
  </ul>
  <div v-else class="empty-store">--- 暂无store ---</div>
</template>
<script>
import StoreItem from './StoreItem.vue';

export default {
  components: { StoreItem },
  props: {
    value: {
      require: true,
      type: Array,
    },
  },
  computed: {
    list() {
      return this.value;
    },
  },
  mounted() {
  },
  methods: {
    clickStore(store) {
      this.$emit('clickStore', store);
    },
    clickTailFn(tailAndStore) {
      this.$emit('clickTailFn', tailAndStore);
    },
    deleteTail(tail) {
      this.$emit('deleteTailFn', tail);
    },
    clickProgress(store) {
      this.$emit('clickProgress', store);
    },
    clickAddTail(store) {
      this.$emit('clickAddTail', store);
    },
    editStore(store) {
      this.$emit('editStore', store);
    },
    showAnalysis(store) {
      this.$emit('showAnalysis', store);
    },
  },
};
</script>
<style scoped>
.empty-store{
  color:rgba(0,0,0,0.85);
  font-size: 12px;
  padding:10px;
  text-align: center;
  margin-top: 20px;
}
</style>
