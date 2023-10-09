export const createTenentIdRules = (formData) => [
  { required: true, message: this.$t('resourceManage.enterTeamId'), trigger: 'change' },
  {
    pattern: formData.appType === 6 ? /^\d+/g : /CL\d+/g,
    message: this.$t('resourceManage.enterTeamId'),
    trigger: 'change',
  },
];

export const createDeploySpaceValidator = (formData) => (rule, value, callback) => {
  if (formData.app_name) {
    if (value) {
      if (value.startsWith(formData.app_name)) {
        callback();
      } else {
        callback(new Error(`部署空间名称应该以应用名称【${formData.app_name}】为前缀`));
      }
    } else {
      callback();
    }
    return;
  }

  if (value) {
    callback(new Error('应用名称为空，部署空间名称也应该为空'));
  } else {
    callback();
  }
};

export const createDeploySpaceRules = (formData) => [
  { validator: createDeploySpaceValidator(formData), trigger: 'change' },
];
