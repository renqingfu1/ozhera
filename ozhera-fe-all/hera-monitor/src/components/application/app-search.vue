<template>
  <div class="search-box">
   <div class="search-input">
     <div class="search-wrap" ref="search-wrap-box">
       <el-input
         :placeholder="$t('enterNameSearch')"
         v-model="searchKey"
         clearable
         @input="inputSearchKey"
         @focus="inputFocus"
         size="mini"
       />
       <el-checkbox v-model="checkMyParticipant" class="depart-app-check"
       @change="getAppListPage1">{{ $t('SearMyPartici') }}</el-checkbox>
     </div>
     <div class="app-header-list" id="app-header-list" v-loading="loading">
       <TabDetail :listData="data" @loadMore="loadMore" ref="appList" @changeItemLoading="changeItemLoading"/>
     </div>
   </div>
  </div>
</template>

<script>
import server from "@/api/service/application"
import TabDetail from '@/components/application/tab-detail';

export default {
 name: "app-list",
 components: {TabDetail},
 data() {
   return {
     inputTimer:null,
     switchShow: false,
     visibleSearch: false, // 显示搜索下拉框提示
     loading: false, // 搜索下拉框loading
     searchKey: "", // 搜索关键件词
     data:[],
     total:0,
     noMore:false,
     checkMyParticipant:false,
     form:{ 
       page:1,
       pageSize:20,
     },
   }
 },
 mounted() {
   this.getAppList();
 },
 methods: {
   changeType(){
     if(this.switchShow){
       this.getAppListPage1();
     }
   },
   showPop() {
     this.getAppListPage1();// 获取应用列表
   },
   inputSearchKey() {
     clearTimeout(this.inputTimer); // 把上一次的定时器清除，重新创建定时器
     this.inputTimer = null;
     this.inputTimer = setTimeout(()=>{
       this.getAppListPage1();
       clearTimeout(this.inputTimer);
       this.inputTimer = null;
     }, 500);
   },
   getAppListPage1(){
     this.$refs.appList.scrollToTop();
     this.form = {...this.form,...{page:1}};
     this.getAppList();
   },
   highLight(list){
     let listRes = list.map(item=>{
       item.nameHtml = item.name || item.appName ;
       let serachData = this.searchKey;
       item.nameHtml =item.nameHtml.replace(serachData,`<span style="color:#1790ff;">${serachData}</span>`);
       item.loading = false;
       return item;
     })
     return listRes;
   },
   inputFocus(){
     this.switchShow = true;
   },
   // 获取应用列表
   getAppList() {
     this.sendReq();
   },
   sendReq(){
     let _this = this;
     _this.loading= true;
     server.getIndexProjects({
       viewType:  1, // 查询类型： 0我参与的应用，1全部应用
       appName: _this.searchKey,
       user : _this.$store.state.moduleUserInfo.userInfo.user,
       myParticipant:this.checkMyParticipant?'yes':'no',
       ..._this.form
     }).then(res => {
       let listRes = _this.highLight(res.list||[]);
       _this.data = listRes || [];
       _this.total= res.total;
       _this.loading = false
       _this.noMore = listRes.length<_this.form.pageSize?true:false;
     }).catch(() => {
       _this.loading = false
     })
   },
   loadMore(){
     if(this.loading ){
       return;
     }
     if(this.noMore){
       return;
     }
     this.form = {...this.form,...{page:this.form.page+1}}
     this.loading = true;
     server.getIndexProjects({
       viewType:  1, // 查询类型： 0我的应用，1全部应用
       appName: this.searchKey,
       user:this.$store.state.moduleUserInfo.userInfo.user,
       myParticipant:this.checkMyParticipant?'yes':'no',
       ...this.form
     })
     .then(res => {
       let listRes = this.highLight(res.list||[]);
       this.data =this.data.concat( listRes || []);
       this.loading = false
       this.noMore = listRes.length<this.form.pageSize?true:false;
     })
     .catch(() => {
       this.loading= false
     })
   },
   changeItemLoading({index,loading}){
     this.$set(this.data, index, {
       ...this.data[index],
       loading: loading
     });
   }
 },
}
</script>

<style scoped>
.search-wrap{
 padding: 10px;
 border: solid 1px #ddd;
 background: #fafafa;
}
.search-wrap >>> .el-input {
 vertical-align: middle;
}
.search-wrap >>> .el-input__inner {
 height: 40px;
 font-size: 14px;
 border-color: #e8e8e8;
 border-radius: 2px 0 0 2px;
}

.app-header-list >>> .el-tabs__nav-scroll{
 padding:0 20px;
 background-color: #fefefe;
}
.app-header-list >>> .el-tabs__header {
 margin-bottom: 0;
}

</style>
<style lang="less" scoped>
.main .app-header {
 border-top: 0;
 text-align: center;
 padding: 40px;
 h2 {
   font-size: 28px;
   color: #1890ff;
   font-weight: 400;
   padding-bottom: 20px;
 }
}
.app-header-list {
 height: 324px;
}
.applist-el-tabs{
 height: 100%;
 overflow: hidden;
}
.search-box{
 width: 370px;
 margin:0 auto;
 .search-input{
   flex:1;
 }
}
.depart-app-check{
 margin-top: 3px;
 /deep/ .el-checkbox__label{
   color: #949495;
   font-size: 13px;
   padding-left: 5px;
 }
}
</style>
