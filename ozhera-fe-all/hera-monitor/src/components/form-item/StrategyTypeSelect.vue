<template>
  <el-select v-model="selectedVal" 
    :placeholder="$t('policyPage.selectType')"
    @change="changeType"
    size="small" 
    clearable
    filterable>
    <el-option
      v-for="item in strategyOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>
<script>
import {mapState} from 'vuex'; 

export default {
  props:{
    value:{

    },
    type:{
      
    }
  },
  data(){
    return {
      searchAppParams:{
        viewType:0,
        appName:''
      },
    }
  },
  computed:{
    ...mapState({
      strategyOptions: (state) => state.moduleStrategyList.strategyOptions, 
    }),
    ...{
      selectedVal:{
        get(){
          return this.value
        },
        set(val){
          return val;
        }
      }
    }
  },
  methods:{
    changeType(val){
      this.$emit('input',val);
    }
  }
}
</script>