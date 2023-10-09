import { Service } from '@/common/server/index';

// eslint-disable-next-line import/prefer-default-export
export const getServerEnvList = (params) => Service({
  method: 'post',
  contentType: 'application/json',
  url: '/api-monitor/prometheus/serverEnvList',
  params,
});
