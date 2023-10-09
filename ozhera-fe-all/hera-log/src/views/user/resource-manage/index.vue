<template >
  <TableBox>
    <template slot="header">
      <BreadCrumb :items="breadItems" />
    </template>
    <el-tabs type="border-card">
      <el-tab-pane
        v-for="(item,index) in typeOptions"
        :key="item.value"
        :label="item.label"
        :name="index+''"
      >
        <IndexTabItem :type="item.value"/>
      </el-tab-pane>
    </el-tabs>
  </TableBox>
</template>
<script>
import BreadCrumb from '@/components/BreadCrumb.vue';
import TableBox from '@/components/TableBox.vue';
import { mapState, mapActions } from 'vuex';
import IndexTabItem from './IndexTabItem.vue';

export default {
  components: {
    BreadCrumb,
    TableBox,
    IndexTabItem,
  },
  data() {
    return {
      breadItems: [{ label: this.$t('resourceManage.title') }],
    };
  },
  computed: {
    ...mapState({
      typeOptions: (state) => state.moduleMQConfig.typeOptions,
    }),
  },
  methods: {
    ...mapActions('moduleMQConfig', ['GETTYPEOPTIONSAPI']),
  },
  mounted() {
    this.GETTYPEOPTIONSAPI(1008);
  },
};
</script>
