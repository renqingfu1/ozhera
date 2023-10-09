import { deleteStore } from '@/common/req/list/logConfig';

// eslint-disable-next-line import/prefer-default-export
export function deleteStoreFn(id, cb, cbParams) { // 编辑过回显
  this.$confirm(this.$t('delTips'), this.$t('prompt'), {
    confirmButtonText: this.$t('confirm'),
    cancelButtonText: this.$t('cancle'),
    type: 'warning',
  }).then(() => {
    deleteStore({ id }).then(() => {
      if (cb) { cb(cbParams); }
      this.$message({
        type: 'success',
        message: '删除成功!',
      });
    });
  });
}
