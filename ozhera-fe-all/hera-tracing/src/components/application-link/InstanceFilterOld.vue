<template>
  <div>
    <ServerCase :data="serverData" @changDateFn="serverCaseChangFn" />
  </div>
</template>

<script>
import { getServerEnvList } from "../../api/monitor";
import ServerCase from "../custom/server-case.vue";
export default {
  name: "InstanceFilter",
  props: {},
  components: {
    ServerCase,
  },
  data() {
    return {
      serverData: {},
    };
  },
  methods: {
    serverCaseChangFn(param) {
      console.log(
        "serverCaseChangFn",
        param.env,
        param.service,
        param.instance
      );
      // this.env = param.env
      // this.searchParams.service = param.service
      // this.instance = param.instance
      // this.selectChange()
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

<style lang="scss" scoped>
.select {
  width: 50%;
}
</style>
