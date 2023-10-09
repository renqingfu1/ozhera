<template>
  <el-dropdown class="app-list-drop-down"  @command="handleCommand">
    <span class="el-dropdown-link">
      ···
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="delete">{{cancleText}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import server from "@/api/service/application";
import {mapActions, mapMutations} from 'vuex';

export default {
  props:{
    item:{},
    index:{}
  },
  computed:{
    detail(){
      return this.item;
    },
    cancleText(){
      return this.detail.owner?this.$t('canclePar'):this.$t('cancleAtt')
    },
    typeText(){
      return this.detail.owner?this.$t('participation'):this.$t('cancleAtt')
    },
    curIndex(){
      return this.index;
    }
  },
  methods:{
    ...mapActions('moduleIndexPage', ['ADDONEAPP']),
    ...mapMutations('moduleIndexPage',['updateIndexLoading']),
    handleCommand(command){
      if(command =='delete'){
        this.deleteApp();
      }
    },
    // 删除应用
    deleteApp() {
      self.delLoading = true;
      this.$confirm(`确定要取消${this.typeText} ${this.detail.projectName} 应用吗?`, this.$t('prompt'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancle'),
        type: 'warning',
      }).then(() => {
        const param = {
          id: this.detail.id, // 应用 id
        }
        this.updateIndexLoading(true);
        server.delApp(param).then(() => {
          this.$message.success(`取消${this.typeText}成功！`);
          this.updateIndexLoading(false);
          this.ADDONEAPP(this.curIndex);
        }).catch(()=>{
          this.updateIndexLoading(false);
        });
      }).catch(() => {
        // self.delLoading = false;
      });
    },
  }
}
</script>
<style lang="less" scoped>
.app-list-drop-down{
  width: 100%;
  height: 100%;
}
.el-dropdown-link{
  display: inline-block;
  width: 100%;
  height: 32px;
  font-size: 12px;
}
</style>
