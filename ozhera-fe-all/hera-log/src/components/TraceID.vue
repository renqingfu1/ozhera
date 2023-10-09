<template>
  <div class="trace-id" v-if="traceId && traceId.length===32 && reg.test(traceId) ">
    <div class="trace-id-box" >
      <span>traceId:
        <i
        :class="[pureTraceID.indexOf(traceIdComputed)>-1?'highlight':'','trace-id-text']">
          {{traceIdComputed}}</i>
        </span>
      <span @click="clickTrace" class="btn">查看链路</span>
    </div>
  </div>
</template>
<script>
import { toSerachTraceId } from '@/common/fun/to-trace-id';

export default {
  props: {
    traceId: {
      require: true,
    },
    source: {
      require: false,
    },
    startTime: {
      require: true,
    },
    endTime: {
      require: true,
    },
    highlight: {},
  },
  data() {
    return {
      reg: /^[0-9a-fA-F]+$/,
    };
  },
  computed: {
    traceIdComputed() {
      return this.traceId;
    },
    pureTraceID() {
      if (!this.highlight) {
        return '';
      }
      const regEM = new RegExp('<em>', 'g');
      const regEMend = new RegExp('</em>', 'g');
      let pureTaraceId = '';
      if (typeof this.highlight === 'string') {
        pureTaraceId = this.highlight.replace(regEM, '').replace(regEMend, ''); // 没有em的字符串
      } else if (typeof this.highlight === 'object') {
        pureTaraceId = this.highlight.map(
          (item) => item.replace(regEM, '').replace(regEMend, ''), // 没有em的字符串
        );
      }
      return pureTaraceId;
    },
  },
  methods: {
    clickTrace() {
      if (this.source) {
        toSerachTraceId(this.traceId, { source: 'MITELEMETRY', startTime: this.startTime, endTime: this.endTime });
      } else {
        toSerachTraceId(this.traceId, { startTime: this.startTime, endTime: this.endTime });
      }
      this.$emit('click');
    },
  },
};
</script>
<style>
.trace-id{
  display: inline-block;
}
.trace-id-box{
  border: solid 1px #54b399;
  display: inline-block;
  background: #fff;
}
.btn{
  display: inline-block;
  border-left: solid 1px #54b399;
  width: 60px;
  cursor: pointer;
}
.trace-id-box span{
  font-size: 12px;
  color: #54b399;
  padding:0 5px ;
}
.trace-id-text{
  font-style: normal;
}
.highlight{
  background: #ffff00;
}
</style>
