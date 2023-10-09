<template>
  <div class="log-timeline" v-loading="loading">
    <el-timeline  v-if="activities.length>0">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :timestamp="$dateFormat(activity.timestamp, 'yyyy-mm-dd HH:MM:ss')"
        placement="top"
      >
        <span slot="dot" :class="['dot-box', index === 0 ? 'dot-end' : '']">
          {{
            index === 0
              ? "终"
              : activities.length - 1 === index
              ? "始"
              : activities.length - index
          }}
        </span>
        <div class="inner-item">
          <template v-if="typeof activity!=='string'">
            <span
              v-for="(item, index) in Object.keys(activity)"
              :key="item + index"
              class="item-data"
            >
              <span class="title">{{ item }}</span
              >:<span v-html="activity[item]"></span
              >&nbsp;
            </span>
          </template>
          <template v-else>
            <span
              class="item-data"
            >
              <span v-html="activity"></span>&nbsp;
            </span>
          </template>
        </div>
      </el-timeline-item>
    </el-timeline>
    <p v-else class="empty-p">暂无数据！</p>
  </div>
</template>
<script>
import server from "@/api/service/slowQueryException.js"
export default {
  props: {
    detailInfo: {
      type: Object,
      require: true,
    },
    logType:{}
  },
  data() {
    return {
      loading: false,
      activities: [],
    }
  },
  computed:{
    level(){
      return this.logType;
    }
  },
  mounted() {
    this.getDetailData()
  },
  methods: {
    getDetailData() {
      this.loading = true;
      let params = {
        projectId: this.detailInfo.projectId,
        serverIp: this.detailInfo.serverIp,
        traceId: this.detailInfo.traceId,
        area: this.detailInfo.area || '',
        generationTime:this.detailInfo.generationTime,
        level: this.level
      }
      server
        .getLogList(params)
        .then(res => {
          this.loading = false
          let resData = res.list || []
          let resParse = resData.map(item => {
            return JSON.parse(item)
          })
          this.activities = resParse
          //this.activities = this.activities.map(item => {
            //delete item.timestamp
            //return item
          //})
          this.activities = this.transformReturn(this.activities);
        })
        .catch(() => {
          this.loading = false
        })
    },
    transformReturn(resList) {
      const resListNew = resList.map((item) => {
        this.transformAll(item);
        return item;
      });
      return resListNew;
    },
    transformAll(item) {
      const all = Object.keys(item)
      // eslint-disable-next-line no-control-regex
      const regRN = new RegExp("\r\n", "g")
      // eslint-disable-next-line no-control-regex
      const regT = new RegExp("\t", "g")
      const regError = new RegExp("ERROR", "g")
      all.forEach(ele => {
        // eslint-disable-next-line no-control-regex
        const str = item[ele].replace(regRN, "</br>")
        const str1 = str.replace(
          regT,
          "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        )
        const newStr = str1.replace(regError, '<b class="red">ERROR</b>')
        // eslint-disable-next-line no-param-reassign
        item[ele] = newStr
      })
    },
  },
}
</script>
<style scoped>
.inner-item {
  border-bottom: solid 1px #c9c9c9;
  word-break: break-all;
  padding: 0 15px 15px 0;
  line-height: 20px;
}
.el-timeline-item {
  padding-bottom: 15px;
}
.log-timeline {
  padding: 10px 10px 0 30px;
  min-height: 60px;
}
.title {
  background: #dee6ff;
  padding: 0 5px;
  border-radius: 3px;
  box-sizing: border-box;
  word-break: normal;
  font-weight: 800;
}
.item-data {
  line-height: 18px;
  font-size: 12px;
}
.dot-box {
  width: 20px;
  height: 20px;
  line-height: 20px;
  background: #67c23a;
  color: #fff;
  border-radius: 10px;
  text-align: center;
  margin-left: -5px;
  font-size: 12px;
}
.dot-end {
  background: #f56c6c;
}
.empty-p{
  padding: 20px;
  text-align: center;
  font-size: 12px;
}
</style>