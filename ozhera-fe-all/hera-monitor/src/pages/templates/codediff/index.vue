<template>
  <div>
    <lone-module marginBottom>代码diff</lone-module>
    <lone-module>
      <lone-codediff 
        :origin='origin'
        :target='target'/>
    </lone-module>
  </div>
</template>

<script>
import { origin, target } from '@/mock/codeDate'

export default {
  data() {
    return {
      origin,
      target
    }
  }
}
</script>

<style lang="less" scoped>

</style>