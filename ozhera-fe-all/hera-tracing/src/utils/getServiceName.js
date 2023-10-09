export default (item) => {
  let service;
  if (item.appSource >= 6 && item.appSource <= 10) {
    service = `${item.projectId}_${item.projectName}`;
  } else if (item.appSource === 0 || item.appSource === 2) {
    service = `${item.projectId}-${item.projectName}`;
  } else {
    service = item.projectName;
  }
  return service;
};
