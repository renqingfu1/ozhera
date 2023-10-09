// eslint-disable-next-line import/prefer-default-export
export function addIp() {
  if (this.formInline.isMatrixApp) {
    return;
  }
  if (!this.inputIp) {
    this.$message.warning('请输入内容');
    return;
  }
  this.ipsOptions.push(this.inputIp);
  // this.formInline = { ...this.formInline, ips: [...this.formInline.ips, this.inputIp] };
  this.inputIp = '';
}
