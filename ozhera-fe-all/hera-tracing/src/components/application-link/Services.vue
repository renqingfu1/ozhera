<template>
  <div class="services">
    <span>{{ $t("applicationName") }}：</span>
    <div :class="['services-content', focus ? 'services-focus' : '']">
      <div
        :class="['services-link', services ? '' : 'services-placeholder']"
        @click="servicesClick"
      >
        <span class="services-value">{{
          services || servicesPlaceholder
        }}</span>
        <el-icon :size="20">
          <CaretBottom />
        </el-icon>
      </div>
      <el-select-v2
        v-model="services"
        :options="servicesList"
        :placeholder="servicesPlaceholder"
        @change="changeService"
        filterable
        @focus="servicesFocus"
        @blur="servicesBlur"
        popper-class="select-v2-popper"
      >
        <template #default="{ item }">
          <el-tooltip effect="dark" placement="bottom-start" :show-after="100">
            <template #content>
              {{ item.label }}
            </template>
            <span class="services-list-item">{{ item.label }}</span>
          </el-tooltip>
        </template>
      </el-select-v2>
    </div>
  </div>
</template>

<script>
import { CaretBottom } from "@element-plus/icons-vue";
// 获取应用列表api
import { getServicesList } from "../../api/application-link";
import getServiceName from "../../utils/getServiceName";

export default {
  name: "Services",
  components: {
    CaretBottom,
  },
  props: {
    service: {},
    getTraces: {},
  },
  data() {
    return {
      services: this.$props.service, // 选中的值
      servicesPlaceholder: this.$t("pleaseSelectAnApplication"), // 应用提示
      servicesList: [], // 应用列表
      focus: false, //是否获取了焦点
    };
  },
  watch: {
    service(newValue) {
      this.services = newValue;
    },
  },
  mounted() {
    getServicesList().then((res) => {
      const initials = res.data;
      const serviceRouteLine = localStorage.getItem(
        "HeraTracingServiceRouteLine"
      );
      if (serviceRouteLine === "1") {
        this.servicesList = Array.from({ length: initials.length }).map(
          (_, idx) => ({
            value: `${initials[idx]}`,
            label: `${initials[idx]}`,
          })
        );
        this.selectServices(this.services ? this.services : res.data[0]);
      } else if (serviceRouteLine === "2") {
        const data = initials.list; //api-monitor/mimonitor/heraApps
        const getSource = (platformType) =>
          platformType >= 6 && platformType <= 10 ? "MITELEMETRY" : "HERA";
        this.servicesList = Array.from({ length: data.length }).map(
          (_, idx) => ({
            value: getServiceName(data[idx]),
            label: getServiceName(data[idx]),
            source: getSource(data[idx].appSource),
            id: data[idx].projectId,
            name: data[idx].projectName,
          })
        );
        const firstServiceName = getServiceName(data[0]);
        this.selectServices(this.services ? this.services : firstServiceName);
      }
    });
  },
  methods: {
    changeService(value) {
      this.$router.push({
        query: { ...this.$route.query, service: value },
      });
    },
    // 选择应用
    selectServices: function (value) {
      this.services = value;
      const item = this.servicesList.find((item) => {
        return item.value === value;
      });
      const servicesObj = {
        service: value,
        source: item?.source,
      };
      localStorage.setItem("HeraTracingServices", value);

      this.$emitter.emit("serviceChangemoreFilter", servicesObj);
      this.$emitter.emit("serviceItemChanged", { ...item });
      // 向applicationLink组件传值
      Promise.resolve(this.$emitter.emit("applicationLink", servicesObj)).then(
        () => {
          this.getTraces(); // 更新数据
        }
      );
    },
    // 获取焦点
    servicesFocus() {
      this.focus = true;
    },
    // 失去焦点
    servicesBlur() {
      this.focus = false;
    },
    //应用点击
    servicesClick() {
      this.focus = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/theme.scss";
@import "../../style/common.scss";
.services {
  color: $deep-black-color;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  line-height: 32px;
  .services-content {
    position: relative;
    display: flex;
    align-items: center;
  }
  .services-link {
    padding-right: 10px;
    display: flex;
    align-items: center;
    .services-value {
      padding-right: 10px;
      @include text-ellipsis;
      max-width: 300px;
      display: inline-block;
    }
    &.services-placeholder {
      color: $light-black-color;
    }
  }
}
</style>
<style lang="scss">
@import "../../style/common.scss";
.services-content {
  .el-select-v2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    opacity: 0;
    height: 100%;
    padding-right: 26px;
    .el-select-v2__suffix {
      opacity: 0;
      z-index: -1;
    }
  }
  .el-select-v2__wrapper {
    border: none;
    font-size: 16px;
    font-weight: bold;
    line-height: 32px;
    padding-right: 0px !important;
    margin-inline-start: 0px;
  }
  .el-select-v2__placeholder {
    @include text-ellipsis;
    margin-inline-start: 0px;
    margin-top: 1px;
    max-width: 300px;
    display: inline-block;
  }
  .el-select-v2__wrapper .el-select-v2__input-wrapper {
    margin-inline-start: 0px;
  }
  &.services-focus {
    .el-select-v2 {
      opacity: 1;
    }
    .services-value {
      opacity: 0;
    }
  }
}
.services-list-item {
  @include text-ellipsis;
  max-width: 246px !important;
  width: auto !important;
  display: inline-block;
}
</style>
