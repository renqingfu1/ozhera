<template>
  <el-popover trigger="hover" :width="200">
    <template #reference>
      <el-tag size="small">{{ sla }}%</el-tag>
    </template>
    <template #default>
      <div class="info">
        <p>每分钟请求量：{{ props.value?.cpm }}</p>
        <p>延迟：{{ props.value?.latency }}</p>
      </div>
    </template>
  </el-popover>
</template>

<script setup>
import { ElTag, ElPopover } from "element-plus";
import { defineProps, computed } from "vue";
const props = defineProps({ value: Object });

const sla = computed(() => {
  const slaValue = props.value?.sla;
  if (slaValue) {
    if (slaValue === 100) {
      return slaValue;
    }
    return Number(slaValue).toFixed(2);
  }
  return slaValue;
});
</script>

<style scoped lang="scss">
.info {
  p {
    padding: 5px 0;
  }
}
</style>
