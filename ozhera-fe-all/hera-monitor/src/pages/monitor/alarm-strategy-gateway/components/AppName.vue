<template>
  <div v-if="teslaOptions.filter(item=>item.projectKey===this.appName).length>0">
    {{
      this.teslaOptions.filter(item=>item.projectKey===this.appName).length>0 && 
      this.teslaOptions.filter(item=>item.projectKey===this.appName)[0].projectCName
    }}
  </div>
</template>
<script>
export default {
  props:{
    appName:{
      type:String
    },
    teslaOptions:{
      type:Array
    }
  }
}
</script>