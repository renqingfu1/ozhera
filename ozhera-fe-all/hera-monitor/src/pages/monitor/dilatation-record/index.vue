<template>
  <ContainerBox title="自动扩容记录">
    <DialationList/>
  </ContainerBox>
</template>
<script>
import ContainerBox from "@/components/ContainerBox.vue";
import DialationList from './list/dialation-list.vue';
export default {
  components:{
    ContainerBox,
    DialationList,
  }
}
</script>