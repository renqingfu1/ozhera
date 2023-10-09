<template>
  <el-select
   :value="value"
   filterable
   reserve-keyword
   placeholder="请输入服务应用名"
   @change="changeApp"
   value-key="groupId"
   :disabled="disabled"
   :loading="loading"
   :size="size"
   :remote="isRemote"
   :remote-method="getData"
 >
   <el-option
     v-for="item in options2"
     :key="item.value + item.label"
     :label="item.label"
     :value="item.value">
   </el-option>
</el-select>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import lodash from 'lodash';

function getData(appName = '') {
  if (this.appType === null) return;
  let params = { type: this.appType, appName };
  const platformTypes = { 2: 6, 3: 7, 6: 8 };
  if (this.appType === 2 || this.appType === 3 || this.appType === 6) { // 部署系统」「mice」「matrix」
    params = {
      ...{ ...params },
      distinct: 1,
      viewType: 0,
      platFormType: platformTypes[this.appType],
    };
  }
  this.GETAPPDIC(params);
}

export default {

  data() {
    return {
      loading: false,
      options2: this.disabled ? [this.extraOption] : [],
    };
  },
  props: {
    value: {},
    disabled: {
      type: Boolean,
    },
    appType: { // 必传
      require: true,
    },
    size: {
      type: String,
      default: 'mini',
    },
    machineRoom: {
      type: String,
      require: true,
    },
    extraOption: {
      type: Object,
    },
  },
  computed: {
    ...mapState({
      options: (state) => state.moduleLogconfig.appDic,
      user: (state) => state.moduleUserInfo.userInfo?.user,
    }),
    isRemote() {
      return true; // 之前的逻辑，只有2，3能远程查，loki不能远程查，现在是全部可以远程搜索
      // return this.appType === 2 || this.appType === 3;
    },
  },
  watch: {
    appType(newV, oldV) {
      if (newV !== oldV) {
        this.SETAPPDIC([]);
        this.$emit('changeAppProp', '');
        this.getData();
      }
    },
    options(val) {
      this.options2 = this.disabled ? [this.extraOption].concat(val) : val;
    },
  },
  methods: {
    ...mapMutations('moduleLogconfig', ['SETAPPDIC']),
    ...mapActions('moduleLogconfig', ['GETAPPDIC']),
    changeApp(app) {
      const filter = this.options2.filter((item) => item.value === app);
      const appName = filter && filter[0] && filter[0].label;
      const appKey = filter && filter[0] && filter[0].key;
      this.$emit('input', app);
      this.$emit('changeApp', app, appName, appKey);
    },
    getData: lodash.debounce(getData, 300),

  },
  mounted() {
    this.getData();
  },
};

</script>
