import { isCreateStoreApi } from '@/common/req/list/resource-manage';
import { Message } from 'element-ui';

// 没有资源时给提示，且不允许创建Store
export default async function judegeCreateStore(params) {
  const { data } = await isCreateStoreApi(params);
  this.$store.dispatch('moduleCreateStoreResource/SETRESOURCEDATA', data);

  if (!data.initializedFlag) {
    Message({
      message: data.notInitializedMsg,
      type: 'error',
      duration: 5 * 1000,
    });
  }
}
