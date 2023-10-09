// params 需要包含spaceId，storeId，dashboardId，layoutL
export default function toCreateChart(params) {
  const keys = Object.keys(params).sort();
  const keysArr = ['spaceId', 'storeId', 'dashboardId', 'layoutL'].sort();
  if (keys.length !== 4) {
    console.log('参数非法，请检查参数！');
    return;
  }
  let nums = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] !== keysArr[i]) {
      nums += 1;
    }
  }
  if (nums > 0) {
    console.log('参数非法，请检查参数！');
    return;
  }

  this.$router.push({
    name: 'CreateChart',
    params: {
      spaceId: params.spaceId,
      storeId: params.storeId,
    },
    query: {
      dashboardId: params.dashboardId,
      layoutL: params.layoutL,
    },
  });
}

export function returnChartOptions() {
  const options = [
    {
      name: '饼图',
      typeCode: '1',
      otherData: {
        type: 'pie',
        radius: '70%',
        roseType: false,
      },
    },
    {
      name: '折线图',
      typeCode: '2',
      otherData: {
        type: 'line',
        areaStyle: {
          opacity: 0,
        },
      },
    },
    {
      name: '垂直条形图',
      typeCode: '3',
      otherData: {
        type: 'bar',
      },
    },
    {
      name: '水平条形图',
      typeCode: '4',
      otherData: {
        type: 'bar',
      },
    },
    {
      name: '面积图',
      typeCode: '5',
      otherData: {
        type: 'line',
        areaStyle: {
          opacity: 0.8,
        },
        roseType: false,
      },
    },
    {
      name: '圆环图',
      typeCode: '8',
      otherData: {
        type: 'pie',
        radius: ['30%', '70%'],
        roseType: false,
      },
    },
    {
      name: '南丁格尔玫瑰图',
      typeCode: '9',
      otherData: {
        type: 'pie',
        radius: ['40%', '75%'],
        roseType: 'area',
      },
    },
  ];
  console.log('options', options);
  return options;
}
