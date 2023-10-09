import { Service } from '@/common/req/service';

// eslint-disable-next-line import/prefer-default-export
export function impowerSpace(params) {
  return Service({ //
    url: 'milog/store/space/auth',
    method: 'post',
    params,
    baseURL: process.env.VUE_APP_MIONEDOMAIN,
  });
}
