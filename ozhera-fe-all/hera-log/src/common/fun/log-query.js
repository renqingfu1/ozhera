function transformLoki(str, arr) {
  if (arr.length === 0) return str;
  if (arr.length === 1) return str.split(arr[0].key).join(arr[0].value);
  if (arr.length > 1) {
    const slices = str.split(arr[0].key);
    const join = arr[0].value;
    arr.splice(0, 1);
    const res = slices.map((item) => transformLoki(item, arr)).join(join);
    return res;
  }
  return str;
}
export function transformLokiHighLight(str, highLights) {
  if (!highLights) return str;
  const arr = [];
  Object.keys(highLights).forEach((key) => {
    arr.push({ key, value: `<i class="i-high-light">${key}</i>` });
  });
  const res = transformLoki(str, arr);
  return res;
}
// eslint-disable-next-line import/prefer-default-export
export function transformAll(item, logType) {
  const { logOfKV, highlight } = item;
  // eslint-disable-next-line no-param-reassign
  item.logOfKVJSON = JSON.parse(JSON.stringify(logOfKV));
  if (logType === 6) { // Loki应用日志
    // eslint-disable-next-line no-param-reassign
    item.logOfString = transformLokiHighLight(item.logOfString, item.highlight);
    return;
  }
  const keyArr = Object.keys(highlight || {});
  const all = Object.keys(logOfKV);
  const regEM = new RegExp('<em>', 'g');
  const regEMend = new RegExp('</em>', 'g');
  // eslint-disable-next-line no-control-regex
  const regRN = new RegExp('(\r){0,1}\n', 'g');// matrix es日志的换行只有\n，不带\r
  // eslint-disable-next-line no-control-regex
  const regT = new RegExp('\t', 'g');
  const regError = new RegExp('ERROR', 'g');
  all.forEach((ele) => {
    if (keyArr.indexOf(ele) > -1) { // 处理
      const curStr = highlight[ele];
      const noEmStrArr = []; // 没有em的字符串
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < curStr.length; i++) {
        noEmStrArr.push(curStr[i].replace(regEM, '').replace(regEMend, ''));
      }
      const curVal = item.logOfKV[ele];

      let newStr1 = typeof curVal === 'object' ? `${curVal[0]}` : `${curVal}`;
      noEmStrArr.forEach((noEmItem, index) => {
        newStr1 = newStr1.replace(noEmItem, `${curStr[index]}`);
      });
      // eslint-disable-next-line no-param-reassign
      item.logOfKV[ele] = newStr1;
    }
    // eslint-disable-next-line no-control-regex
    const str = (typeof logOfKV[ele] === 'string' && logOfKV[ele].replace(regRN, '</br>')) || logOfKV[ele];
    const str1 = (typeof str === 'string' && str.replace(regT, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')) || str;
    let newStr = (typeof str1 === 'string' && str1.replace(regError, '<b class="red">ERROR</b>')) || str1;
    if (newStr.length === 0 && ele !== 'traceId') {
      newStr = '<i class="empty-i">(空)</i>';
    }
    // eslint-disable-next-line no-param-reassign
    logOfKV[ele] = newStr;
  });
}

export function nearTimeText(text) {
  this.isNearText = text;
}

export function returnTimeOptions() {
  const start = new Date();
  const minute1 = 60 * 1000;
  const hour1 = 60 * minute1;
  const day1 = 24 * hour1;
  const today0 = new Date().setHours(0, 0, 0, 0);
  const now = start.getTime();
  return [
    {
      text: this.$t('commonDatePicker.last15m'),
      timer: [now - 15 * minute1, now],
    },
    {
      text: this.$t('commonDatePicker.last30m'),
      timer: [now - 30 * minute1, now],
    },
    {
      text: this.$t('commonDatePicker.last1h'),
      timer: [now - hour1, now],
    },
    {
      text: this.$t('commonDatePicker.last2h'),
      timer: [now - 2 * hour1, now],
    },
    {
      text: this.$t('commonDatePicker.last4h'),
      timer: [now - 4 * hour1, now],
    },
    {
      text: this.$t('commonDatePicker.last8h'),
      timer: [now - 8 * hour1, now],
    },
    {
      text: this.$t('commonDatePicker.last12h'),
      timer: [now - 12 * hour1, now],
    },
    {
      text: this.$t('commonDatePicker.last1d'),
      timer: [now - day1, now],
    },
    {
      text: this.$t('commonDatePicker.last2d'),
      timer: [now - 2 * day1, now],
    },
    {
      text: this.$t('commonDatePicker.last3d'),
      timer: [now - 3 * day1, now],
    },
    {
      text: this.$t('commonDatePicker.last7d'),
      timer: [now - 7 * day1, now],
    },
    {
      text: this.$t('commonDatePicker.today'),
      timer: [today0, now],
    },
    {
      text: this.$t('commonDatePicker.yesterday'),
      timer: [today0 - day1, today0],
    },
  ];
}
