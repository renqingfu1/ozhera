<template>
  <div class="app-list-box">
    <div v-if="listData.length == 0" class="empty-box">
      <el-empty description="暂无数据"></el-empty>
    </div>
    <div class="appliction-list" v-else v-loading="loading ">
      <ScrollBoxVue @reqMore="loadMore" ref="ScrollBox">
        <ul>
          <li v-for="(item, index) in listData" :key="index" class="app-li">
            <div>
              <p
                v-html="item.nameHtml"
                style="margin-right: 5px"
                class="app-name"
              ></p>
              <p class="detail-info">
                <Platfrom :platformType="item.platformType" />
                <el-tag el-tag class="join-tag" v-if="item.participant == 1">{{ $t('participation') }}</el-tag>
                <span class="li-item-des">{{ item.desc || $t('noDes') }}</span>
              </p>
            </div>
            <div>
              <el-button
                type="primary"
                icon="el-icon-plus"
                plain
                size="small"
                class="add-app"
                @click="addApp(item, item.participant == 1?'join':'attention',index)"
                :disabled="returnDisabled(item)"
                element-loading-spinner="el-icon-loading"
                v-loading="item.loading ||loadingAppList"
                >{{ $t('add') }}</el-button
              >
            </div>
          </li>
        </ul>
      </ScrollBoxVue>
    </div>
  </div>
</template>
<script>
import Platfrom from "@/components/application/platform.vue"
import { mapState,mapActions } from "vuex"
import ScrollBoxVue from "../ScrollBox.vue"
import server from "@/api/service/application"

export default {
  components: {
    Platfrom,
    ScrollBoxVue,
  },
  computed: {
    ...mapState({
      indexAppList: state => state.moduleIndexPage.indexAppList,
      loadingAppList: state => state.moduleIndexPage.loadingAppList,
    }),
    participantApp (){
      return this.indexAppList.filter((app)=>{
        return app.owner;
      })
    },
    focusApp(){
      return this.indexAppList.filter((app)=>{
        return !app.owner;
      })
    }
  },
  data(){
    return {
      loading:false
    }
  },
  props: {
    listData: {
      require: true,
    },
  },
  methods: {
    ...mapActions('moduleIndexPage', ['GETINITAPPLIST']),
    loadMore() {
      this.$emit("loadMore")
    },
    addApp(item,type,index){ // type join 添加到我参与，attention添加到我关注
      this.$emit('changeItemLoading', {index,loading:true});
      let params = {
        projectId:item.appId,
        projectName:item.appName,
        owner:type=='join'?'yes':'', //owner=yes 我参与应用 否则我关注的
        iamTreeId:item.iamTreeId,
        iamTreeType:item.iamTreeType||'',
        appSource: item.platformType, //app来源null或0是mione,1信息部 2有品
        projectCName:item.projectCName||'',
        bindType:item.bindType||0,
        appLanguage:item.appLanguage ||'',
        appType:item.appType||0,
        envMapping:JSON.stringify(item.envMapping)||'',
      }
      console.log('params',params);
      server.addApp([params]).then(() => {
        this.$emit('changeItemLoading', {index,loading:false});
        this.GETINITAPPLIST();
      }).catch(err=>{
        this.$emit('changeItemLoading', {index,loading:false});
        console.log(err);
      })
    },
    returnDisabled(item) {
      let joinItem = this.participantApp.filter(optionsItem => {
        return (
          optionsItem.projectId == item.appId &&
          optionsItem.appSource == item.platformType
        )
      })
      let focusItem = this.focusApp.filter(optionsItem => {
        return (
          optionsItem.projectId == item.appId &&
          optionsItem.appSource == item.platformType
        )
      })
      if(joinItem.length>0){ // 已参与
        return true;
      }else if(joinItem<=0 && focusItem.length>0){ // 已关注
        if(item.participant==1){ // 已关注但是能参与
          return false;
        }else{ // 已关注但是不能参与
          return true;
        }
      }else{
        return false;
      }
    },
    scrollToTop(){
      if(this.$refs.ScrollBox){
        this.$refs.ScrollBox.scrollToTop();
      } 
    }
  },
}
</script>
<style scoped lang="less">
.app-li {
  height: 64px;
  display: flex;
  justify-content: space-between;
  border-bottom: solid 1px #e9e9e9;
  align-items: center;
  padding: 0 10px;
}
.app-li p {
  height: 25px;
  line-height: 25px;
}
.app-li button {
  height: 24px;
  padding: 0 5px;
}
.app-li:nth-of-type(even) {
  background: #fbfbfb;
}
.join-tag {
  height: 20px;
  line-height: 20px;
  padding: 0 8px;
  border-radius: 0;
  margin-left: 10px;
}
.li-item-des {
  color: #aaaaaa;
  margin-left: 10px;
  max-width: 190px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.empty-box {
  width: 100%;
  height: 324px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.appliction-list {
  height: 324px;
  /* overflow: auto; */
}
.app-list-box {
  border: solid 1px #ddd;
  border-top: none;
}
.app-name {
  display: inline-block;
  max-width: 288px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  vertical-align: top;
}
.detail-info {
  display: flex;
  align-items: center;
}
.add-app {
  /deep/ .el-loading-spinner{
    margin-top: -5px;
  }
}
</style>
