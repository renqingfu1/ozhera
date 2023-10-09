<template>
  <div>
    <el-select
      class="select1"
      v-model="selectedEnv"
      placeholder="请选择环境"
      :clearable="true"
      @change="onEnvChanged"
    >
      <el-option
        v-for="item in envOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-select
      class="select2"
      v-model="selectedService"
      placeholder="请选择服务"
      :disabled="!selectedEnv"
      :clearable="true"
      @change="onServiceChanged"
    >
      <el-option
        v-for="item in serviceOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
const mapOption = (v) => ({ label: v, value: v });
export default {
  props: {
    servers: {
      required: true,
    },
    value: {},
  },
  computed: {
    envOptions() {
      if (this.servers && this.servers.envIpMapping) {
        return Object.keys(this.servers.envIpMapping).map(mapOption);
      }
      return [];
    },
    serviceOptions() {
      if (this.selectedEnv && this.servers.envIpMapping[this.selectedEnv]) {
        return Object.keys(
          this.servers.envIpMapping[this.selectedEnv].serviceList || {},
        ).map(mapOption);
      }
      return [];
    },
  },
  watch: {
    value(val) {
      const init = val || {};
      this.selectedEnv = init.env;
      this.selectedService = init.service;
    },
    servers(serverData) {
      // 默认选中第一个服务，减少用户操作
      if (serverData && serverData.envIpMapping) {
        const env = Object.keys(serverData.envIpMapping)[0];
        if (env) {
          this.selectedEnv = env;
          const service = Object.keys(
            serverData.envIpMapping[env].serviceList || {},
          )[0];
          if (service) {
            this.selectedService = service;
            this.selectChange();
          }
        }
      }
    },
  },
  data() {
    const init = this.value || {};
    return {
      selectedEnv: init.env,
      selectedService: init.service,
    };
  },
  methods: {
    onEnvChanged(env) {
      this.selectedService = '';
      if (env && this.servers && this.servers.envIpMapping) {
        // 默认选中第一个service
        const service = Object.keys(
          this.servers.envIpMapping[env].serviceList || {},
        )[0];
        if (service) {
          this.selectedService = service;
        }
      }
      this.selectChange();
    },
    onServiceChanged() {
      this.selectChange();
    },
    selectChange() {
      const value = { env: this.selectedEnv, service: this.selectedService };
      this.$emit('input', value);
    },
  },
  mounted() {
    console.log('InstanceSelect servers:', this.servers, this.value);
  },
};
</script>
<style scoped>
.select1 {
  width: 30%;
}
.select2 {
  width: 70%;
}
</style>
