// eslint-disable-next-line import/prefer-default-export
export function validateInput(inputV) {
  const andReg = new RegExp(/\s*and\s*/); // and 正则
  const maohaoReg = new RegExp(/\s*:\s*/); // : 正则
  const maohaoEndReg = new RegExp(/:\s*$/); // : 正则
  const arr = inputV.split(andReg);
  let specialNums = 0;
  arr.forEach((curV) => {
    const itemArr = curV.split(maohaoReg); // 通过冒号 获取key:val
    if (itemArr.length !== 2) {
      if (itemArr.length > 2) { // 有多个 ：
        const valArr = itemArr.splice(1); // val arr
        const valueStr = valArr.reduce((preV, curVal) => `${preV} : ${curVal}`); //
        const doubleQuotationRegEndStart = new RegExp(/^".*"$/);
        // const doubleQuotationReg = new RegExp(/\s*"\s*/);
        // value 被双引号包围
        const doubleQuotationSurround = doubleQuotationRegEndStart.test(valueStr);
        if (
          (!doubleQuotationSurround && valArr.length > 1)
          || (doubleQuotationSurround && valueStr.split('"').length - 1 > 2)
        ) {
          specialNums += 1000; // 加一个无限大的数字
        }
      }
    } else if (itemArr.length === 2 && itemArr[1] === '') {
      specialNums += 1000; // 加一个无限大的数字
    }
  });
  let res = true;
  if (specialNums > 0) {
    if (specialNums === 1) {
      if (maohaoEndReg.test(inputV)) { // 冒号结尾
        res = false;
      }
    } else if (specialNums > 2) {
      res = false;
    }
  }

  if (!res) {
    this.$message.warning('输入框内只能输入key : value 或 value格式');
  }
  return res;
}
