const isMiFELogSpace = (label) => {
  if (!label) {
    return false;
  }
  const endStr = '_代理日志';
  const start = label.indexOf(endStr);
  if (start > 0 && label.endsWith(endStr)) {
    const arr = label.substring(0, start).split('.');
    if (arr.length === 4) {
      const regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
      return arr.every((name) => regex.test(name));
    }
  }
  return false;
};

export default isMiFELogSpace;

// console.log(isMiFELogSpace('b2c.b2cdevops.work-be-mi-com.work-be-mi-com_代理日志'));
