module.exports = {
  toSerachTraceId(traceId, params) {
    const domain = window.location.origin;
    let url = `${domain}/project-hera-tracing/traceid/${traceId}`;
    if (params) {
      url += `?${Object.keys(params).map((item) => `${item}=${params[item]}`).join('&')}`;
    }
    console.log('url', url);
    window.open(url, 'blank');
  },
};
