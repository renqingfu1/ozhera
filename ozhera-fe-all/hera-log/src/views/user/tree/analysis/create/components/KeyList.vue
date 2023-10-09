<template>
  <ul class="list-ul">
    <li
      @click="selectKey(item.keyName)"
      class="key-item"
      v-for="(item,index) in keyList" :key="item.keyName +'_'+ index">
      {{item.keyName}}
    </li>
  </ul>
</template>
<script>
import {
  getKeyList,
} from '@/common/req/list/user/charts';

export default {
  data() {
    return {
      keyList: [],
    };
  },
  mounted() {
    this.getKeys();
  },
  methods: {
    getKeys() {
      const params = { storeId: this.$route.params.storeId };
      getKeyList(params).then(({ data }) => {
        const keyListArr = data.map((item) => ({
          keyName: item,
          keyType: item,
        }));
        this.keyList = [...keyListArr];
      });
    },
    selectKey(key) {
      this.$emit('changeKey', key);
    },
  },
};
</script>
<style scoped>
.key-item{
  display: flex;
  text-align: left;
  padding: 8px;
  display: flex;
  align-items: flex-start;
  line-height: normal;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0.8px 0.8px rgb(0 0 0 / 4%), 0 2.3px 2px rgb(0 0 0 / 3%);
  margin-bottom: 5px;
  font-size: 12px;
  color: rgb(52, 55, 65);
  cursor: pointer;
}
.list-ul{
  padding: 0 10px;
}
</style>
