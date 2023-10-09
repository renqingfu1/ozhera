<template>
  <div class="item-list">
    <div class="top-box">
      <MiTimer v-model="timer" @change="changeTime" />
      <MethodName v-model="methodName" @change="refresh"/>
    </div>
    <list
      :listData="item"
      :type="type"
      :ref="item.value"
      v-if="activeName === item.value && inited"
      :method="methodName"
      :timer="timer"
    />
  </div>
</template>
<script>
import MiTimer from '@/pages/slowquery-exception/search/MiTimer.vue';
import MethodName from '@/pages/slowquery-exception/search/MethodName.vue';
import list from "./list.vue";
import { mapMutations } from 'vuex';

export default {
  components:{
    list,
    MiTimer,
    MethodName,
  },
  computed:{
    timer:{
      get(){
        return this.$store.state.slowquery.timer
      },
      set(val){
        this.setTimer(val);
      }
    }
  },
  data(){
    // const now = (new Date()).getTime();
    return {
      methodName:'',
      // timer:[now-1000*60*30,now], // 默认是最近半小时
      inited: false
    }
  },
  props:{
    item:{},
    activeName:{},
    type:{},
  },
  mounted(){
    this.initTimeAndMethod();
    this.inited = true;
  },
  methods:{
    ...mapMutations('slowquery',['setTimer']),
    changeParams(params){
      this.$refs[this.activeName].refreshMethod(params);
    },
    refresh(){
      this.$nextTick(()=>{
        if (this.$refs[this.activeName]) {
          this.$refs[this.activeName].getList();
        }
      })
    },
    changeTime(val){
      this.setRouteTimer(val);
      this.refresh();
    },
    initTimeAndMethod(){
      let {method_name} = this.$route.query;
      if(method_name){
        this.methodName = method_name;
      }
    },
    setRouteTimer(val){
      if(!val[0] || !val[1]) return;
      let {query} = this.$route;
      this.$router.push({
        query:{
          ...query,
          start_time: val[0],
          end_time:val[1],
          from: val[0],
          to:val[1]
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.top-box{
  display: flex;
  justify-content: space-between;
}
</style>
