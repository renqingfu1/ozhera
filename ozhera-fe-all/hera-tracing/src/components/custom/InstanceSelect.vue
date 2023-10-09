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
    modelValue: {},
  },
  emits: ["update:modelValue"],
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
          this.servers.envIpMapping[this.selectedEnv].serviceList || {}
        ).map(mapOption);
      }
      return [];
    },
  },
  data() {
    const init = this.modelValue || {};
    return {
      selectedEnv: init.env,
      selectedService: init.service,
    };
  },
  methods: {
    onEnvChanged(val) {
      if (!val) {
        this.selectedService = "";
      }
      this.selectChange();
    },
    onServiceChanged() {
      this.selectChange();
    },
    selectChange() {
      const value = { env: this.selectedEnv, service: this.selectedService };
      this.$emit("update:modelValue", value);
    },
  },
  mounted() {
    console.log("InstanceSelect servers:", this.servers, this.modelVale);
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
