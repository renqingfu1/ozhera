module.exports = {
  checkMiddlewareConfig(rule, value, callback) {
    if (value && value.length === 1) {
      callback(new Error('请选到第二级'));
    } else {
      callback();
    }
  },
};
