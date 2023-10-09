<template>
  <div class='menu'>
    <menu-comp
      style="background: inherit"
      :menuList='menuList'
      :defaultActive='defaultActive'
      :defaultOpeneds='defaultOpeneds'
      :collapse='!expandAside'/>
  </div>
</template>

<script>
import menuComp from './components/menu'
import { mapState } from 'vuex'
import {setSelectStorage} from "@/utils/localStorage";

export default {
  data() {
    return {
      iscollapse: false,
      defaultActive: '1',
      defaultOpeneds:['1','2']
    }
  },
  components: {
    menuComp
  },
  computed: {
    ...mapState('menu',['menuList','expandAside'])
  },
  methods:{
    setActive(){
      const path = this.$route.path;
      this.menuList.forEach(item => {
        if(!item.children) {
          item.path == path && (this.defaultActive = item.index)
        } else {
          const child = item.children.find(it => path.includes(it.path));
          child && (this.defaultActive = child.index)
        }
      })
    },
    // 本地存储 大盘日期选中数据
    setSelectLocalData() {
      // 获取url携带时间参数
      const query = this.$route.query
      const urlTime = [query.from || query.startTime, query.to || query.endTime]
      if (!urlTime[0] || !urlTime[1]) {
        return false
      }
      let time = ''
      if (urlTime[1] == 'now') {
        time = urlTime[0].split('-')[1]
      }
      const param = {
        value: urlTime,
        quickValue: time, // 日期快捷选项选中值
      }
      setSelectStorage('datePickerSelect', param) // 存储选中数据
    },
  },
  watch: {
    "$route"() {
      this.setActive();
    }
  },
  mounted(){
    this.setActive();
  },
  created() {
    this.setSelectLocalData() // 本地存储日期选中数据
  }
}
</script>
