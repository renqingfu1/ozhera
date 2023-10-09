
// 获取选中数据name
const getAppSource = (project,id) => {
  let {appData} = project;
  let curAppData = appData.filter((item)=>item.projectId==id);
  let appSource = curAppData.length>0?curAppData[0].appSource:'';
  return appSource;
}

export {
  getAppSource
}