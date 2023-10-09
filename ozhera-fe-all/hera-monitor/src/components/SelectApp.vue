<template>
  <el-select
    v-model="val"
    :clearable="true"
    filterable
    remote
    reserve-keyword
    :placeholder="$t('enterNameSearch')"
    size="mini"
    :remote-method="remoteMethod"
    :loading="loading"
  >
    <el-option
      v-for="item in options"
      :key="item.appId"
      :label="item.appName"
      :value="item.appId"
    >
    </el-option>
  </el-select>
</template>

<script>
import server from "@/api/service/application"
export default {
  props:{
    value:{},
    platformType:{
      type: Number
    }
  },
  data() {
    return {
      form: {
        page: 1,
        pageSize: 200,
        appName:'',
        platformType:null
      },
      options: [],
      loading: false,
      timer:null
    }
  },
  computed:{
    val:{
      get(){
        return this.value
      },
      set(val){
        this.$emit('input',val);
        this.$emit('change',val);
      }
    },
    platform(){
      return this.platformType
    }
  },
  mounted() {
    this.getOptions()
  },
  methods: {
    remoteMethod(query) {
      this.form.appName = query;
      if(this.timer){
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(()=>{
        this.getOptions();
        this.timer = null;
      }, 1500);
    },
    getOptions(){
      this.loading = true
      let req = {...this.form, platformType:this.platform};
      server.getIndexProjects(req).then(({ list }) => {
        this.options = list
        this.loading = false
      })
    }
  },
}
</script>