<template>
  <div class="box">
    <p class="top-title">HERA - {{ $t('firstCard.title') }}</p>
    <div class="main">
      <SelectStore v-model="detailInfo" @change="selectStore" />
      <el-button size="big" class="save-btn" @click.stop="reSaveRecord" v-if="detailInfo.storeId">
        <i class="el-icon-mobile"></i>
      </el-button>
      <div class="input-box">
        <SearchBox
        :keyListStr="keyListStr"
        :hideSave="detailInfo.storeId?false:true"
        v-model="formInline.inputV"
        :storeId="detailInfo.storeId"
        :startTime="formInline.timer?formInline.timer[0]:''"
        :endTime="formInline.timer?formInline.timer[1]:''"
        @afterSavedRecord="afterSavedRecord"
        page="index"/>
        <ChangeTail
        v-if="detailInfo.type ==='space-store'"
        :tailsOptions="tailsOptions" v-model="formInline.tail"
        style="margin-top:5px"/>
        <MySaved @changeInputV="changeInputV" @changeSpaceStoreTail="changeDetailInfo"
        @changeTime="changeTime"/>
      </div>
      <div>
        <MiDatePicker v-model="formInline.timer"
        class="index-time"
        @nearTimeText="nearTimeText"
        :showPicker="isNearText?true:false"/>
      </div>
      <div style="height:38px;">
        <el-button type="primary" class="search-btn" @click="toSearchPage"
        >{{  $t('firstCard.query')  }}</el-button>
      </div>
    </div>
    <IndexSaveRecordDialog
    :searchRecordDialog="searchRecordDialog"
    :closeRecordDialog="closeRecordDialog"
    :param="formInline.inputV"
    :storeId="detailInfo.storeId"
    :startTime="formInline.timer?formInline.timer[0]:''"
    :endTime="formInline.timer?formInline.timer[1]:''"
    :editInfo="{}"
    :tailId="formInline.tail.map(item=>item.id)"
    @afterSaved="afterSavedRecord"
    />
  </div>
</template>
<script>
import SearchBox from '@/views/user/tree/log-query-com/SearchBox.vue';
import MiDatePicker from '@/components/MiDatePicker.vue';
import ChangeTail from '@/views/user/tree/log-query-com/ChangeTailIndex.vue';
import { nearTimeText } from '@/common/fun/log-query';
import { getStoreById } from '@/common/req/list/logConfig';
import { mapActions, mapState } from 'vuex';
import { getTailOptions } from '@/common/req/list/user/saved-api';
import MySaved from './components/MySaved.vue';
import SelectStore from './components/StoreSelect.vue';

export default {
  components: {
    SearchBox,
    MiDatePicker,
    SelectStore,
    ChangeTail,
    MySaved,
    IndexSaveRecordDialog: () => import('@/views/user/tree/log-query-com/SearchRecordDialog.vue'),
  },
  computed: {
    ...mapState({
      allStore: (state) => state.moduleSaved.allStore,
    }),
  },
  data() {
    return {
      searchRecordDialog: false,
      keyListStr: '',
      isNearText: '', // 是否选择的是最近时间
      formInline: {
        timer: [
          new Date().setTime(new Date().getTime() - 15 * 60 * 1000),
          new Date().getTime(),
        ],
        inputV: '',
        tail: [], // 对象类型的数组
      },
      detailInfo: {
        type: '', //  app | space-store
        spaceName: '',
        storeName: '',
        spaceId: null,
        storeId: null,
      },
      tailsOptions: [],
    };
  },
  watch: {
    'detailInfo.storeId': function (newV, oldV) {
      if (newV !== oldV) {
        this.getStoreDetail();
        getTailOptions({ storeId: newV }).then(({ data }) => {
          this.tailsOptions = data;
        });
      }
    },
  },
  mounted() {
    this.GetTreeAction();
  },
  methods: {
    ...mapActions('moduleSaved', ['GetTreeAction', 'GetSaveKeyList']),
    nearTimeText,
    selectStore(val) {
      this.changeTail(val);
      if (val.type === 'app') {
        const { tailId, tailName } = val;
        this.formInline.tail = [{ id: tailId, tail: tailName }];
      }
    },
    changeTime(timer) {
      this.formInline.timer = timer;
    },
    afterSavedRecord() {
      this.GetSaveKeyList();
    },
    toSearchPage() {
      if (!this.detailInfo.spaceId || !this.detailInfo.storeId) {
        this.$message.warning(this.$t('indexPage.selTips'));
        return;
      }
      const tailName = this.formInline.tail.map((item) => item.tail).join(',');
      const { spaceId, storeId } = this.detailInfo;
      this.$router.push({
        name: 'User-SpaceTree',
        query: {
          spaceId,
          storeId,
          tailName,
          startTime: this.formInline.timer[0],
          endTime: this.formInline.timer[1],
          isNearText: this.isNearText,
          inputV: this.formInline.inputV,
          type: 'search',
        },
      });
    },
    async getStoreDetail() {
      const storeDetail = await getStoreById({ id: this.detailInfo.storeId });
      const { data } = storeDetail;
      if (data.logType === 7) {
        this.keyListArr = [];
        return;
      }
      this.keyListStr = data.keyList || '';
    },
    changeTail(val) {
      if (val.type === 'app') {
        this.formInline.tail = val.tailId ? this.returnTailArr(val) : [];
      } else {
        this.formInline.tail = [];
      }
    },
    changeDetailInfo(val) {
      this.detailInfo = {
        ...this.detailInfo,
        ...val,
      };
      this.changeTail(val);
      if (val.startTime && val.endTime) {
        this.formInline.timer = [val.startTime, val.endTime];
      }
    },
    returnTailArr(val) {
      const tailIds = (`${val.tailId}`).split(',');
      const tailNames = val.tailName.split(',');
      const res = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < tailIds.length; i++) {
        res.push({
          tail: tailNames[i],
          id: tailIds[i],
        });
      }
      return res;
    },
    changeInputV(val) {
      this.formInline.inputV = val;
    },
    reSaveRecord() {
      this.searchRecordDialog = true;
    },
    closeRecordDialog() {
      this.searchRecordDialog = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.top-title{
  margin:10px 0 20px 0;
  text-align: center;
  font-size: 28px;
  color: #1890ff;
  font-weight: 400;
}
.main{
  display: flex;
}
.input-box{
  flex: 1;
  width: 0;
}
.box{
  padding:30px 20px;
}
.search-btn{
  height: 38px;
}
.save-btn{
  border-radius: 0;
  height: 38px;
  padding: 10px;
}
</style>
