export default (appName, appType, appTypeList) => {
  const typeItem = appTypeList.find((item) => item.value === appType);
  if (typeItem) {
    return `${typeItem.label}_${appName}`;
  }
  return appName;
};
