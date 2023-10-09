import server from "@/api/service/alarm-srategy.js"

export function changeCheckAll(val){
  this.formInline.rules.map((item)=>{
    return item.checked = val;
  })
}
export function deleteMultiple(){
  this.loadingMultiple = true;
  let {rules} =this.formInline;
  let toOptionsIds = [],toDeleteIndex=[];
  for(let i=0;i<rules.length; i++){
    let item = rules[i];
    if(item.checked){
      toDeleteIndex.push(i);
      item.loading = true;
      if(item.id) toOptionsIds.push(item.id);
    }
  }
  if(toDeleteIndex.length<1){
    this.$message.warning('请选择要删除的规则');
    this.loadingMultiple = false;
    return;
  }
  if(toOptionsIds.length<1){ // 即将删除的全部是新增的数据
    let indexLen = toDeleteIndex.length-1;
    for(let j=indexLen; j>=0 ;j--){
      console.log('j',j);
      this.formInline.rules.splice(toDeleteIndex[j], 1)
    }
    this.loadingMultiple = false;
  }else{
    server
    .deleteRule(toOptionsIds)
    .then(() => {
      for(let k = rules.length-1;k>=0;k--){
        let item = rules[k];
        if(item.checked){
          this.formInline.rules.splice(k, 1)
          this.updateModel()
          item.loading = false
        }
      }
      this.loadingMultiple = false;
    })
    .catch(() => {
      this.loadingMultiple = false;
    })
  }
}
export function editItem(item){
  item.active = true;
}
export function saveItem(item){
  item.loading = true;
  let itemIndex=  this.returnSingleRule(item,this.strategyType,this.baseEditData)
  delete itemIndex.teslaGroup;
  server.editRuleSingle(itemIndex).then(()=>{
    item.loading = false;
    item.active = false;
  }).catch(()=>{
    item.loading = false;
  })
}
export function removeItem(item, index) {
  item.loading = true
  if(!item.id){
    this.formInline.rules.splice(index, 1)
    this.updateModel()
    return;
  }
  server
    .deleteRule([item.id])
    .then(() => {
      this.formInline.rules.splice(index, 1)
      this.updateModel()
      item.loading = false
      this.$message.success("删除成功")
    })
    .catch(() => {
      item.loading = false
    })
}

export function clickItem(item){
  if(!item.active){
    this.$message.warning('请点击编辑按钮开始编辑!');
  }
}
export function getSingleEditData(res){
  this.baseEditData = {
    includeServices:res.includeServices,
    exceptServices:res.exceptServices,
    includeEnvs:res.includeEnvs,
    exceptEnvs:res.exceptEnvs,
    alertMembers:res.alertMembers,
    alertTeam:res.alertTeam,
  }
}