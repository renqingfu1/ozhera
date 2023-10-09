<template>
  <div>
    <template v-if='logType!==6'>
      <slot name="logContext"></slot>
      <TraceID
      v-if="showTraceId"
      :traceId="itemData.logOfKVJSON.traceId || itemData.logOfKVJSON.trace_id ||
        matchTraceId(itemData.logOfString)"
      :source="logType ===7 ? 'MITELEMETRY' : undefined"
      :highlight="itemData.highlight && itemData.highlight.traceId"
      :startTime="formInline.timer[0]"
      :endTime="formInline.timer[1]"
      style="margin:3px 0 5px 0;"/>
      <div class="detail-info">
        <span
          v-for="item in Object.keys(itemData.logOfKV).filter((item)=>
            (item!=='timestamp' && item!=='traceId')
          )"
          :key="item"
          class="detail-item"
        >
          <span class="title">{{item}}:</span> <span v-html="itemData.logOfKV[item]"
          class="content-text"></span>
          <b> </b>
        </span>
      </div>
    </template>
    <template v-else>
      <slot name="logContext"></slot>
      <TraceID
      v-if="showTraceId"
      :traceId="matchTraceId(itemData.logOfString)"
      source="MITELEMETRY" :startTime="formInline.timer[0]"
      :highlight="itemData.highlight && itemData.highlight.traceId"
      :endTime="formInline.timer[1]"/>
      <div class="detail-info">
        <span v-html="itemData.logOfString"></span>
      </div>
    </template>
  </div>
</template>
<script>
import TraceID from '@/components/TraceID.vue';

export default {
  components: {
    TraceID,
  },
  props: {
    logType: {
      required: true,
    },
    itemData: {
      required: true,
    },
    formInline: {
      required: true,
    },
    showTraceId: {
      default: true,
    },
  },
  methods: {
    matchTraceId(str) {
      const regs = this.logType === 6 ? [/traceId=(\w+)/, /trace_id=(\w+)/]
        : [/traceId\\u003d(\w+)/, /trace_id\\u003d(\w+)/];
      for (let i = 0; i < regs.length; i += 1) {
        const res = str.match(regs[i]);
        if (res) return res[1];
      }

      return null;
    },
  },
};
</script>
<style  scoped>
.content-text{
  margin-right: 5px;
}
.detail-info{
  max-height: 300px;
  overflow-y:auto;
}
</style>
