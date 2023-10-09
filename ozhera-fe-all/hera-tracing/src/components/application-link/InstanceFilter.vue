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
import { getServerEnvList } from "../../api/monitor";
import InstanceSelect from "../../components/custom/InstanceSelect.vue";
export default {
  name: "InstanceFilter",
  props: {
    modelValue: {},
  },
  emits: ["update:modelValue"],
  components: {
    InstanceSelect,
  },
  data() {
    const init = this.modelValue || {};
    return {
      serverData: {},
      filters: init,
    };
  },
  watch: {
    filters: {
      handler(val) {
        console.log("InstanceFilter watch filters", val);
        this.$emit("update:modelValue", val);
      },
    },
  },
  methods: {
    onInstanceChange(param) {
      console.log("onInstanceChange", param.env, param.service);
      this.$emit("change", param);
    },
  },
  mounted() {
    this.$emitter.on("serviceItemChanged", (item) => {
      console.log("Instance Filter service", item);
      getServerEnvList({
        projectId: item.id,
        projectName: item.name,
      }).then((res) => {
        this.serverData = res.data;
      });
    });
  },
  unmounted() {
    this.$emitter.off("serviceItemChanged");
  },
};
</script>

<style lang="scss" scoped></style>
