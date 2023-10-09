<template>
  <div>
    <InstanceSelect
      v-model="filters"
      :servers="serverData"
      @change="onInstanceChange"
    />
  </div>
</template>

<script>
import { getServerEnvList } from '../common/server/monitor';
import InstanceSelect from './InstanceSelect.vue';

export default {
  name: 'InstanceFilter',
  props: {
    value: {},
    appDetail: {},
  },
  components: {
    InstanceSelect,
  },
  data() {
    const init = this.value || {};
    return {
      serverData: {},
      filters: init,
    };
  },
  watch: {
    filters: {
      handler(val) {
        console.log('InstanceFilter watch filters', val.env, val.service);
        this.$emit('input', val);
      },
    },
    appDetail: {
      handler(val) {
        if (val) {
          this.filters = {};
          this.serverData = {};
          const vals = val.split('|');
          this.queryEnvList({ id: vals[0], name: vals[1] });
        }
      },
    },
  },
  methods: {
    onInstanceChange(param) {
      console.log('onInstanceChange', param.env, param.service);
      this.$emit('change', param);
    },
    queryEnvList(item) {
      console.log('Instance Filter service', item);
      getServerEnvList({
        projectId: item.id,
        projectName: item.name,
      }).then((res) => {
        this.serverData = res.data;
      });
    },
  },
  mounted() {
    this.$on('serviceItemChanged', this.queryEnvList);
  },
  unmounted() {
    this.$off('serviceItemChanged');
  },
};
</script>

<style lang="scss" scoped></style>
