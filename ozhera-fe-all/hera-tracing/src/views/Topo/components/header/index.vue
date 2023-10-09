<template>
  <div class="header">
    <el-form :inline="true" :model="form" ref="ruleFormRef">
      <div class="main">
        <el-row>
          <el-col :span="12">
            <el-form-item label="应用名:" prop="app" style="width: 100%">
              <el-select-v2
                @change="onAppChange"
                filterable
                :options="apps"
                v-model="form.app"
                style="width: 40%"
              >
                <template #default="{ item }">
                  <el-tooltip
                    effect="dark"
                    placement="bottom-start"
                    :show-after="100"
                  >
                    <template #content>
                      {{ item.label }}
                    </template>
                    <span class="app-item">{{ item.label }}</span>
                  </el-tooltip>
                </template>
              </el-select-v2>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-space>
              <el-form-item>
                <el-date-picker
                  v-model="form.dates"
                  type="datetimerange"
                  :shortcuts="shortcuts"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="small"
                  @change="onDateChange"
                />
              </el-form-item>
              <el-button color="#1890FF" @click="onMore" plain
                >高级筛选</el-button
              >
            </el-space>
          </el-col>
        </el-row>
      </div>
      <div class="more" v-show="showMore">
        <el-row>
          <el-col :span="colspan">
            <el-form-item label="应用环境:" prop="env" style="width: 100%">
              <el-select v-model="form.env" style="width: 80%">
                <el-option
                  v-for="item in envs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="colspan">
            <el-form-item label="服务:" prop="service" style="width: 100%">
              <el-select v-model="form.service" style="width: 80%">
                <el-option
                  v-for="item in services"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="colspan">
            <el-form-item label="深度: " prop="depth">
              <el-select v-model="form.depth">
                <el-option :value="1">1</el-option>
                <el-option :value="2">2</el-option>
                <el-option :value="3">3</el-option>
                <el-option :value="4">4</el-option>
                <el-option :value="5">5</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="colspan" style="text-align: right">
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed, defineEmits, defineExpose } from "vue";
import moment from "moment";
import { getServicesList } from "@/api/application-link";
import { getServerEnvList } from "@/api/monitor";
import getServiceName from "@/utils/getServiceName";

const showMore = ref(false);
const emit = defineEmits(["submit"]);
const colspan = 6;
const ruleFormRef = ref();
const form = ref({
  app: "",
  env: "",
  service: "",
  dates: [moment().subtract(1, "hours"), moment()],
  depth: 1,
});

defineExpose({
  form,
});
const apps = ref([]);
const envs = ref([]);
const envData = ref({});
const shortcuts = [
  {
    text: "最近1小时",
    value: () => {
      return [moment().subtract(1, "hours"), moment()];
    },
  },
  {
    text: "最近2小时",
    value: () => {
      return [moment().subtract(2, "hours"), moment()];
    },
  },
  {
    text: "最近3小时",
    value: () => {
      return [moment().subtract(3, "hours"), moment()];
    },
  },
  {
    text: "最近6小时",
    value: () => {
      return [moment().subtract(6, "hours"), moment()];
    },
  },
  {
    text: "最近12小时",
    value: () => {
      return [moment().subtract(12, "hours"), moment()];
    },
  },
  {
    text: "最近24小时",
    value: () => {
      return [moment().subtract(24, "hours"), moment()];
    },
  },
  {
    text: "最近2天",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
      return [start, end];
    },
  },
  {
    text: "最近一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "最近一个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: "最近三个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];

const onMore = () => {
  showMore.value = !showMore.value;
};

const getData = async () => {
  const { data, code } = await getServicesList();
  if (code === 0) {
    const serviceRouteLine = localStorage.getItem(
      "HeraTracingServiceRouteLine"
    );
    if (serviceRouteLine === "1") {
      apps.value = data.map((item) => {
        return {
          label: item,
          value: item,
        };
      });
      form.value.app = data && data.length > 0 ? data[0] : "";
    } else if (serviceRouteLine === "2") {
      const { list } = data;
      const getSource = (platformType) =>
        platformType >= 6 && platformType <= 10 ? "MITELEMETRY" : "HERA";
      apps.value = list?.map((item) => {
        return {
          label: getServiceName(item),
          value: getServiceName(item),
          source: getSource(item.appSource),
          id: item.projectId,
          name: item.projectName,
        };
      });
      form.value.app = list && list.length > 0 ? getServiceName(list[0]) : "";
      if (form.value.app) {
        onSubmit();
      }
    }
    onAppChange(form.value.app);
  }
};

const loadEnv = async (value) => {
  const app = apps.value.find((v) => v.value === value);
  const { data, code } = await getServerEnvList({
    projectId: app?.id,
    projectName: app?.name,
  });
  if (code === 0) {
    if (data) {
      envData.value = data;
      const { envIpMapping } = data;
      if (envIpMapping) {
        envs.value = Object.keys(envIpMapping).map((item) => ({
          label: item,
          value: item,
        }));
      }
    }
  }
};

const services = computed(() => {
  const { envIpMapping } = envData.value;
  if (form.value.env && envIpMapping && envIpMapping[form.value.env]) {
    const { serviceList } = envIpMapping[form.value.env];
    return Object.keys(serviceList || {}).map((item) => ({
      label: item,
      value: item,
    }));
  } else {
    return [];
  }
});

const onAppChange = (value) => {
  form.value.env = "";
  form.value.service = "";
  envs.value = [];
  if (value) {
    loadEnv(value);
    onSubmit();
  }
};

const onDateChange = () => {
  onSubmit();
};

onBeforeMount(() => {
  getData();
});

const onSubmit = async () => {
  if (ruleFormRef.value) {
    ruleFormRef.value.validate((valid) => {
      if (valid) {
        emit("submit", form.value);
      }
    });
  }
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
