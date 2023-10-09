<template>
  <div class="create-resourve">
    <el-dialog
      :title="(itemId?$t('edit'):$t('create'))+$t('resourceManage.name')"
      :visible.sync="isShow"
      width="860px">
      <CreateForm
        v-if="isShow"
        :machineType="type" :itemId="itemId"
        @closeDialog="closeDialog"
        @getListFn="getListFn"/>
    </el-dialog>
  </div>
</template>
<script>
import CreateForm from './CreateForm.vue';

export default {
  components: {
    CreateForm,
  },
  props: {
    dialogVisible: {
      type: Boolean,
    },
    type: {
      required: true,
    },
    itemId: {},
  },
  computed: {
    isShow: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit('changeDialog', val);
      },
    },
  },
  methods: {
    closeDialog() {
      this.$emit('changeDialog', false);
    },
    getListFn(params) {
      this.$emit('getListFn', params);
    },
  },
};
</script>
