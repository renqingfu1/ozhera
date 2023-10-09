import {
  getEnvsFromApp,
  addTailReq,
  updateTail, getTailRateDic,
} from '@/common/req/list/logConfig';

export function getEnvsByApp(params) {
  getEnvsFromApp(params)
    .then((res) => {
      this.envsOptions = res.data || [];
      const curEnv = this.envsOptions.filter((item) => item.value === this.formInline.envId);
      const resIps = (curEnv[0] && curEnv[0].ips) || [];
      const formIps = this.formInline.ips || [];
      this.ipsOptions = Array.from(new Set(resIps.concat(formIps)));
    })
    .catch((err) => {
      console.log('err', err);
    });
}

export function changeEnv(val, isEditInit) {
  this.formInline = {
    ...this.formInline,
    ...{ ips: [] },
  };
  const cur = this.envsOptions.filter((item) => item.value === val);
  if (isEditInit) { // 编辑回显
    this.ipsOptions = Array.from(new Set(((cur[0] && cur[0].ips) || [])
      .concat(this.formInline.ips || [])));
  } else {
    this.ipsOptions = (cur[0] && cur[0].ips) || [];
  }
}

export function handleCheckAllChange(val) {
  this.formInline.ips = val ? this.ipsOptions : [];
}

export function deleteValueList(item, index) {
  this.keyListArr.splice(index, 1);
}
export function selfValid() {
  if (this.formInline.appType === 0) { // mione
    if (!this.formInline.envId || this.formInline.ips.length === 0) {
      this.$message({
        type: 'error',
        message: '当前选择的"服务应用名"环境、ip信息不完整',
      });
      return false;
    }
  } else if (this.formInline.appType === 0 && typeof (this.formInline.machineType) !== 'number') {
    this.$message({
      type: 'error',
      message: '请选择机器类型',
    });
    return false;
  }
  return true;
}

export function addFn() {
  const params = {
    ...this.formInline,
    ...this.returnEnvAppName(),
    ...{ valueList: this.returnValueList() },
  };
  const arr = Object.keys(params);
  arr.forEach((item) => {
    if (item === 'envId' && !params[item]) {
      params.envId = null;
    }
  });
  if (this.type === 'edit') {
    updateTail(params)
      .then((res) => {
        this.sucCB(res);
      })
      .catch((err) => {
        console.log('err', err);
      });
  } else {
    addTailReq(params)
      .then((res) => {
        this.sucCB(res);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }
  return true;
}

export function sucCB(res) {
  this.$message({
    type: 'success',
    message: res.message,
  });
  this.$emit('getListFn');
}

export function returnEnvAppName() {
  const filterenv = this.envsOptions.filter((item) => item.value === this.formInline.envId);
  return {
    envName: (filterenv && filterenv[0] && filterenv[0].label) || '',
  };
}

export function returnValueList() {
  // 编辑、新增的时候不需要回传 type类型为3的
  const reducer = (accumulator, currentValue) => `${accumulator},${currentValue.key}`;
  const arr = [...this.keyListArr];
  const res = arr.reduce(reducer, '').slice(1);
  return res;
}

export function getTailRateFun() {
  return getTailRateDic();
}

export function changeAppType() {
  this.formInline = { ...this.formInline, ...{ envId: '', milogAppId: '', machineType: '' } };
  this.ipsOptions = [];
}
// export function changeMachineType() {
//   if (this.formInline.appType === 0) return; // mione
//   this.formInline = { ...this.formInline, ...{ milogAppId: '' } };
// }
