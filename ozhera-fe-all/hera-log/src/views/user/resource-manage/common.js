module.exports = {
  returnEsIndex(arr) {
    return arr.map((item) => ({
      logTypeCode: item.logTypeCode,
      esIndexList: item.esIndexList.split('\n'),
    }));
  },
  returnResEsIndex(arr) {
    return arr.map((item) => ({
      logTypeCode: item.logTypeCode,
      esIndexList: item.esIndexList.join('\n'),
    }));
  },
};
