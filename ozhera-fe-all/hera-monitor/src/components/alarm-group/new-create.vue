<template>
  <el-form ref="form" :model="form" label-width="100px" class="create-group-form">
    <div class="form-item-box">
      <el-form-item label="通知组名称">
        <el-input
          v-model="form.name"
          :placeholder="$t('policyPage.enterNotifyTemName')"
        ></el-input>
      </el-form-item>
      <el-form-item label="通知对象" prop="memberIds" class="select-group">
        <div class="member-box">
          <el-select
          class="member-select"
          v-model="form.memberIds"
          remote
          filterable
          placeholder="请输入通知对象邮箱前缀"
          value-key="id"
          multiple
          :remote-method="searchGroup"
          v-defaultSelect="[myselfInfo]"
        >
          <el-option
            v-for="item in alarmGroupOptions"
            :key="item.id"
            :label="item.name"
            :value="item"
            :disabled="item.name === myselfInfo[0].name"
          >
          </el-option>
        </el-select>
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          :content="$t('policyPage.projectMemTips')">
          <div slot="reference">
            <el-button  @click="addDepart" class="add-depart" size="mini" :disabled="!appDetail.projectId"
              :loading="loadingDepart">+{{ $t('policyPage.projectMem') }}</el-button>
          </div>
        </el-popover>
        </div>
        <p class="tip">
          P0级报警会给每一位通知对象打电话，如想只想电话通话某人，其他人飞书通知，可以只填此人，创建成功后，将其他人拉入飞书通知群即可
        </p>
      </el-form-item>
      <el-form-item label="飞书通知群ID" prop="chatId">
        <el-input
          v-model="form.chatId"
          placeholder="请输入飞书群ID，仅支持填写一个飞书群ID"
        ></el-input>
        <p class="tip">
          如不填，则系统自动创建飞书通知群，同时将通知对象拉入通知群
        </p>
      </el-form-item>
      <el-form-item label="通知组描述" prop="note" class="create-group">
        <el-input
          type="textarea"
          v-model="form.note"
          :rows="2"
          placeholder="请输入通知组描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="通知渠道">
        <div>
          <p>系统根据报警级别，自动匹配不同的接收渠道。</p>
          <div class="warn-box">
            <p>[P0] 级报警为电话通知、飞书通知、邮件通知</p>
            <p>[P1] 级报警为飞书通知、邮件通知</p>
            <p>[P2] 级报警为飞书通知</p>
          </div>
        </div>
      </el-form-item>
    </div>
    <div class="bottom-box">
      <el-button @click="closeDialog">{{$t('cancle')}}</el-button>
      <el-button @click="submit" type="primary">{{$t('confirm')}}</el-button>
    </div>
  </el-form>
</template>
<script>
import server from '@/api/service/alarm-member.js';

export default {
  props:{
    dialogType:{
      type:String
    },
    appDetail:{
      type: Object
    }
  },
  data() {
    return {
      alarmGroupOptions: [],
      form: {
        name: '',
        chatId: '',
        memberIds: [],
        note:''
      },
      myselfInfo: [],
      loadingDepart:false
    };
  },
  methods: {
    closeDialog() {
      this.$emit('switchShowCreate');
    },
    submit() {
      if(!this.form.name){
        this.$message({
          type:'error',
          message:'请输入通知组名称'
        })
        return;
      }
      if(!this.form.note){
        this.$message({
          type:'error',
          message:'请输入通知组描述'
        })
        return;
      }
      const params = this.transformForm();
      this.newCreateSend(params);
    },
    transformForm() {
      const { memberIds } = this.form;
      const newMIds = memberIds.map((item) => item.id);
      return {
        memberIds: newMIds,
        name: this.form.name,
        chatId: this.form.chatId,
        note: this.form.note,
        id: this.form.id,
      };
    },
    newCreateSend(params) {
      server.createAlarmGroup(params)
        .then((res) => {
          this.$message({
            type:'success',
            message:'新建成功'
          })
          this.$emit('addGroups', [res]);
          this.closeDialog();
        })
        .catch((err) => {
          console.log('err', err);
        });
    },
    searchGroup(name) {
      server
        .searchGroupApi({ name })
        .then((res) => {
          this.alarmGroupOptions = res.list;
        })
        .catch((err) => {
          console.log('err', err);
        });
    },
    initMyself() {
      const { userInfo } = this.$store && this.$store.state.moduleUserInfo;
      const userName = userInfo.user;
      if (this.dialogType === 'newCreate') {
        server.searchGroupApi({ name: userName })
          .then((res) => {
            const { list } = res;
            let myDetail  = list.filter(item=>item.name === userName);
            this.myselfInfo = myDetail
            this.form.memberIds = this.form.memberIds.concat(myDetail);
            this.alarmGroupOptions = this.alarmGroupOptions.concat(this.form.memberIds);
          })
          .catch((err) => {
            console.log('err', err);
          });
      } else {
        this.myselfInfo = this.form.memberIds.filter((item) => item.name === userName);
      }
    },
    addDepart(){
      this.loadingDepart = true;
      let params = {
        appId: this.appDetail.projectId,
        platForm: this.appDetail.appSource,
      }
      server.getAppMember(params).then((res)=>{
        let list = res.list ||[];
        let listDeleteMyself = list.filter((item)=>{ // 将自己过略掉
          return item.id !== this.myselfInfo[0].id;
        })
        this.alarmGroupOptions = this.deweight(this.alarmGroupOptions.concat(listDeleteMyself));
        let arr = this.form.memberIds;
        let newArr = this.deweight(arr.concat(listDeleteMyself));
        this.form = {
          ...this.form,
          memberIds: newArr
        }
        this.loadingDepart = false;
      }).catch(()=>{
        this.loadingDepart = false;
      })
    },
    deweight(arr) { // 去重
      let newArr=[]
      arr.forEach(function(a){
        let istrue=newArr.every(function(b){
          return a.id != b.id
        })
        istrue ? newArr.push(a) : ''
      })
      return newArr;
    }
  },
  mounted(){
    this.initMyself();
  }
};
</script>
<style scoped>
.tip {
  line-height: 24px;
  font-size: 12px;
}
.create-group-form >>> .el-form-item {
  width: 550px;
}
.create-group-form >>> .el-select {
  width: 420px;
}

.bottom-box {
  text-align: right;
  padding: 20px;
  border-top: solid 1px #eee;
}
.form-item-box {
  padding: 20px 0 0 30px;
}
.warn-box {
  background-color: #fffbe6;
  border: solid 1px #ffe58f;
  padding:5px 0 5px 10px;
}
.warn-box p{
  line-height: 26px;
}
.select-group >>> .none {
  display: none;
}

.create-group-form >>> .el-input__inner,.create-group-form >>> .create-group .el-textarea__inner{
  width: 450px;
}

.create-group-form >>> .member-select ,.create-group-form >>> .member-select .el-input__inner{
  width: 355px;
}
.member-box{
  display: flex;
  justify-content: space-between;
}
.add-depart{
  height: 40px;
}
</style>
