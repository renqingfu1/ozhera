<template lang="">
  <span class="date-format">
    {{$dateFormat(timeStamp, 'yyyy/mm/dd HH:MM:ss')}}
  </span>
</template>
<script>
export default {
  props: {
    value: {

    },
  },
  computed: {
    timeStamp() {
      return this.value;
    },
  },
};
</script>
<style lang="">

</style>
