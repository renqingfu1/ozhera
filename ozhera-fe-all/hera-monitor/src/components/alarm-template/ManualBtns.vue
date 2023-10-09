<template>
  <div>
    <el-button v-for="item in options" :key="item.value" @click="clickBtn(item)" 
    :type="item.value ===btnVal?'primary':''"
    :plain="item.value ===btnVal?true:false"
    >{{item.name}}</el-button>
  </div>
</template>
<script>
import server from '@/api/service/alarm-srategy';
export default {
  props:{
    value:{}
  },
  computed:{
    btnVal(){
      return this.value
    }
  },
  data(){
    return {
      options:[{
        label:'按钮名字',
        value: '1'
      },{
        label:'1按钮名字',
        value: '2'
      }]
    }
  },
  mounted(){
    this.getBtns();
  },
  methods:{
    getBtns(){
      server.manualTemListApi({
        paging:false
      }).then(res=>{
        this.options = res?.list || [];
      })
    },
    clickBtn(item){
      this.$emit("input", item.promql)
    }
  }
}
</script>