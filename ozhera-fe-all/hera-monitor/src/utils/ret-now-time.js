/**
 * 带有now字段的时间
 * @param {*} time
 */
const reRealTime = (preTime) => {
  const now = new Date().getTime();
  const newStr = preTime.replace('now', now).replace('s','*1000').replace('m','*1000*60').replace('h','*1000*60*60').replace('d','*1000*60*60*24');
  const newT = eval(newStr);
  return newT;
}

export { reRealTime }