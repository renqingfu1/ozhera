import { badge } from './badge'

/**
 * 实现复制文本功能
 * @param {Strng} val
 * @return {Boolean}
 */
const copyText = val => {
  let result = false
  let oInput = document.createElement('input')
  oInput.value = val
  document.body.appendChild(oInput)
  oInput.select()
  result = document.execCommand('Copy')
  oInput.remove()
  return result
}

/**
 * 格式化时间
 * @param {number} now 时间戳
 * @return {string}
 */
const formatTime = timeStamp => {
  let time = new Date(timeStamp)
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let day = time.getDate()
  let hour = time.getHours()
  let minutes = time.getMinutes()
  return `
    ${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')} 
    ${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

const getTimeSeconds = date => {
  return Math.floor(date.getTime() / 1000)
}

const getAxisMin = title => title.includes('可用率') ? function(value) {
  return Math.floor(value.min)
} : 0
const getAxisMax = title => title.includes('可用率') ? function(value) {
  return Math.ceil(value.max)
} : undefined

const linkTo = id => {
  const link = document.createElement("a")
  link.href = "#" + id
  link.click()
}

// 获取选中数据name
const getDataName = (id, data, valKey, labelKey) => {
  const value = valKey ? valKey : 'value';
  const label = labelKey ? labelKey : 'label';
  if (`${id}` && data && data.length) {
    const name = data.find(item => String(item[value]) === String(id));
    return name && name[label];
  }
}
// 获取url参数
const getQueryString = (name) => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const num1 = 1;
  let urlSearch = window.location.search;
  const hashParam = window.location.hash.split('?')[num1];
  if (hashParam) {
    urlSearch = `${urlSearch}&${hashParam}`;
  }
  if (!urlSearch) {
    urlSearch = window.location.href.split('?')[num1];
    if (urlSearch && urlSearch.indexOf('?') === -1) {
      urlSearch = `?${urlSearch}`;
    }
  }
  const param = urlSearch ? urlSearch.substr(num1).match(reg) : '';
  if (param) {
    const num2 = 2;
    return decodeURI(param[num2]);
  }
  return null;
};

export {
  badge,
  copyText,
  formatTime,
  getTimeSeconds,
  getAxisMin,
  getAxisMax,
  linkTo,
  getDataName,
  getQueryString
}
