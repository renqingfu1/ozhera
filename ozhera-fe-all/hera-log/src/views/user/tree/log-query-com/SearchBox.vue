<template>
  <div v-bind="$attrs" ref="projectButton" class="input-container">
    <SearchRecord
      v-if="!hideSaveM"
      :storeId="storeId"
      :param="inputV"
      :startTime="startTime"
      :endTime="endTime"
      @afterSavedRecord="afterSavedRecord"
      @searchSubmit="recordSubmit"
      :tailId="tailIdProps"
      :page="page">
    </SearchRecord>
    <div  class="input-content">
      <el-popover
        placement="bottom-start"
        width="170"
        popper-class="log-query-pop"
        trigger="manual"
        v-model="visible">
        <div class="inner-data">
          <ul v-if="!showAnd && keyListArr.length>0">
            <li :class="['list-item',selectedIndex===index?'selected':'']"
                v-for="(item,index) in keyListArr" :key="item" @click="clickItem(item)">
              {{item}}
            </li>
          </ul>
          <ul v-if="showAnd">
            <li
              v-for="(item,index) in andNot"
              :key="item.value"
              :class="['list-item',selectedIndex===index?'selected':'']"
              @click="clickItem(item.value)">
              {{item.value}}
            </li>
          </ul>
        </div>
        <div slot="reference">
          <div class="input-box">
            <SearchMsg v-model="showMsg" @changeEn="changeEn"/>
            <el-input v-model="inputV" :placeholder="$t('pleaseEnter.base')"
            size="normal"
            :disabled="disabled"
            autosize
            class="search-input"
            @focus="focusInput"
            @keyup.enter.native="keyEnter"
            @keyup.native="directionKey"
            @input="inputVal">
            </el-input>
        </div>
        <div class="tips-box">
          <el-popover
            slot="suffix"
            placement="bottom"
            width="220"
            popper-class="log-query-tips"
            trigger="hover">
            <div class="tips">
              <p class="title">模糊查询</p>
              <ul><li class="tip">关键字查询，速度较慢</li></ul>
              <p  class="title">精确查询</p>
              <ul><li class="tip">key : value查询，速度较快</li></ul>
            </div>
            <i slot="reference" class="iconfont icon-ask"></i>
          </el-popover>
        </div>
      </div>
      </el-popover>
    </div>
  </div>
</template>
<script>
import SearchRecord from '@/views/user/tree/log-query-com/SearchRecord.vue';
import SearchMsg from './components/SearchMsg.vue';

const andReg = new RegExp(/[\s]*(and|not|or)[\s]*/g);
const maohaoReg = new RegExp(/[\s]*:[\s]*/g);

export default {
  name: 'SearchBox',
  components: {
    SearchRecord,
    SearchMsg,
  },
  data() {
    return {
      showMsg: false,
      visible: false,
      allList: [], // 所有key
      keyListArr: [],
      showAnd: false,
      emptyReg: null,
      selectedIndex: -1,
      selectedItem: '',
      andNot: [{
        value: 'and',
      }, {
        value: 'not',
      }, {
        value: 'or',
      }],
    };
  },
  mounted() {
    this.emptyReg = new RegExp(/(^[\s]+|[\s]+$)/g); // 去掉开头结尾的空格
    this.show();
  },
  unmounted() {
    this.hide();
  },
  computed: {
    inputV: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    hideSaveM() {
      return this.hideSave;
    },
    tailIdProps() {
      return this.tailId;
    },
  },
  watch: {
    keyListStr(newV) {
      if (newV.length === 0) return [];
      const arr = newV.split(',');
      let newArr = arr.map((item) => item.split(':')[0]);
      newArr = newArr.filter((item) => !(item === 'timestamp' || item === 'logstore' || item === 'tail'));
      this.allList = newArr;
      this.keyListArr = newArr;
      return null;
    },
    inputV(str) {
      // 双引号 左双 \u201c，右双\u201d
      // 单引号 左单：\u2018 右单\u2019
      // 冒号\uff1a
      const reg = new RegExp('([\u2018]|[\u2019]|[\u201c]|[\u201d]|[\uff1a])+', 'g');
      this.showMsg = !!(reg.test(str));
    },
  },
  props: {
    keyListStr: {
      type: String,
      require: true,
    },
    value: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    storeId: {
      type: Number,
      default: () => ({}),
    },
    // 开始时间
    startTime: {
    },
    // 结束时间
    endTime: {
    },
    hideSave: {
      type: Boolean,
    },
    page: {
      type: String,
    },
    tailId: {
      type: Array,
    },
  },
  methods: {
    afterSavedRecord() {
      this.$emit('afterSavedRecord');
    },
    changeEn() {
      const singleQ = new RegExp('\u2018|\u2019', 'g');
      const doubleQ = new RegExp('\u201c|\u201d', 'g');
      const colon = new RegExp('\uff1a', 'g');
      this.inputV = this.inputV.replace(singleQ, '\'').replace(doubleQ, '"').replace(colon, ':');
    },
    show() {
      document.addEventListener('click', this.hidePanel, false);
    },
    hide() {
      document.removeEventListener('click', this.hidePanel, false);
    },
    hidePanel(e) {
      if (this.$refs.projectButton && !this.$refs.projectButton.contains(e.target)) {
        this.visible = false;
      }
    },
    switchShowPop(bool) {
      let newVal = bool;
      if (newVal && !this.showAnd && this.keyListArr.length === 0) { // 如果keyList 长度是0则不需要展示任何
        newVal = false;
      }
      this.visible = newVal;
    },
    switchShowAnd(bool) {
      this.showAnd = bool;
    },
    keyEnter(e) {
      if (e.keyCode === 13) {
        if (this.selectedIndex === -1) {
          this.inputV = this.inputV.substr(0, this.inputV.length);
          this.$emit('searchSubmit');
        } else {
          this.clickItem(this.showAnd ? this.selectedItem.value : this.selectedItem);
        }
      }
    },
    filterSelect() {
      const arr = this.inputV.split(andReg);
      const newArr = JSON.parse(JSON.stringify(this.allList));
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        const itemArr = item.split(maohaoReg);
        if (itemArr.length === 2) {
          if (newArr.indexOf(itemArr[0]) > -1) { // 说明这个值已经存在
            const index = newArr.indexOf(itemArr[0]);
            newArr.splice(index, 1);
          }
        }
      }
      return newArr;
    },
    focusInput(event) {
      this.selectedIndex = -1;
      this.inputVal(event.target.value);
    },
    // 方向键
    directionKey(e) {
      const curArr = this.showAnd ? this.andNot : this.keyListArr;
      if (e.key === 'ArrowUp') {
        // 上,选中最后一个
        if (this.selectedIndex === -1 || this.selectedIndex === 0) {
          this.selectedIndex = curArr.length - 1;
        } else {
          this.selectedIndex -= 1;
        }
      } else if (e.key === 'ArrowDown') {
        // 下，选中第一个
        if (this.selectedIndex === -1 || this.selectedIndex === curArr.length - 1) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex += 1;
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        // 左,右，取消选中
        this.selectedIndex = -1;
      }
      this.selectedItem = curArr[this.selectedIndex];
    },
    inputVal(value) {
      if (this.isNull(value)) { // 输入的全是空格
        this.keyListArr = this.allList;
        this.switchShowAnd(false);
        this.switchShowPop(true);
        this.inputV = '';
      } else {
        const lastCharStr = this.retLastCharStr(value);
        const lastPreCharStr = this.retLastPreCharStr(value);
        if (lastCharStr === '') { // 如果最后一位是空格
          const allStr = value.replace(this.emptyReg, 'g');
          if (this.andNot.findIndex((item) => item.value === lastPreCharStr) > -1) {
            // 最后一个字符是and 或 not or
            // 用户第一输入的值就是and 则把这个‘and’当成key // 输入内容是：and把'and'当成key
            if (this.andNot.findIndex((item) => item.value === allStr) > -1) {
              this.switchShowAnd(true);
              this.switchShowPop(true);
            } else { // 最后一位是空格
              this.keyListArr = this.filterSelect();
              this.switchShowAnd(false);
              this.switchShowPop(true);
            }
          } else if (lastPreCharStr === ':') { // 把最后一个字符当成key
            this.switchShowPop(false);
          } else {
            this.switchShowAnd(true);
            this.switchShowPop(true);
          }
        } else if (this.retInputingKey(value)) { // 输入的一个不是空格,而且是key
          this.filterLi(value);
          if (this.keyListArr.length === 0) {
            this.switchShowPop(false);
            return;
          }
          this.switchShowAnd(false);
          this.switchShowPop(true);
        }
      }
      this.$emit('input', value);
    },
    retInputingKey(value) { // 是否正在输入ker
      const str = value.replace(this.emptyReg, 'g');
      const retKeyValArr = str.split(andReg); // 返回key：val结构的数组
      let res = false;
      if (retKeyValArr.length > 0) {
        const lastItem = retKeyValArr[retKeyValArr.length - 1];
        const keyValArr = lastItem.split(maohaoReg);
        if (keyValArr.length === 1) { // 正在输入key
          res = true;
        }
      }
      return res;
    },
    retLastCharStr(val) { // 返回最后一个字符
      const arr = val.split(' ');
      const last = arr[arr.length - 1];
      return last;
    },
    retLastPreCharStr(val) { // 返回最后一个个不是空格的字符
      const arr = val.split(' ');
      let lastPreChar = '';
      // eslint-disable-next-line no-plusplus
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] !== '') {
          lastPreChar = arr[i];
          break;
        }
      }
      return lastPreChar;
    },
    retLastItem() {
      const str = this.inputV;
      const arr = str.split(andReg);
      const lastArr = arr[arr.length - 1];
      const lastItem = lastArr.split(':');
      return lastItem;
    },
    filterLi(val) {
      const str = this.retLastPreCharStr(val);
      const filters = this.allList.filter((item) => item.indexOf(str) >= 0);
      this.keyListArr = filters;
    },
    isNull(str) {
      if (str === '') return true;
      const regu = '^[ ]+$';
      const re = new RegExp(regu);
      return re.test(str);
    },
    clickItem(val) {
      const lastCharArr = this.retLastItem();
      // 如果选择的是and not or
      const valIsSpecial = this.andNot.findIndex((item) => item.value === val) > -1;
      if (lastCharArr.length === 1) {
        const lastChar = lastCharArr[0];
        const str = this.inputV;
        if (!valIsSpecial) {
          const newS = str.substr(0, str.length - 1 - (lastChar.length));
          const newStr = newS.replace(/(^[\s]+|[\s]+$)/g, ''); // 删除两头的空格
          this.inputV = newStr.length > 0 ? `${newStr} ${val} : ` : `${val} : `;
        } else {
          this.inputV = str.length > 0 ? `${str} ${val} ` : `${val} `;
        }
        this.switchShowPop(false);
      } else if (lastCharArr.length === 2) {
        if (valIsSpecial) {
          const deleteEmpty = this.inputV.replace(/(^[\s]+|[\s]+$)/g, ''); // 删除两头的空格
          this.inputV = `${deleteEmpty} ${val} `;
          this.keyListArr = this.filterSelect();
          this.switchShowAnd(false);
          this.switchShowPop(true);
        } else {
          this.switchShowPop(false);
        }
      }
      // 点击后让选中位回到-1
      this.selectedIndex = -1;
    },
    // 提交
    recordSubmit(data) {
      this.inputV = data.queryText;
      this.$emit('searchSubmit', {
        startTime: data.startTime,
        endTime: data.endTime,
        source: 'recordSubmit',
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.input-container{
  display: flex;
}
.input-content{
  flex: 1;
  position: relative;
  min-height: 28px;
  ::v-deep .el-input--mini{
    width: 100%;
    .el-textarea__inner{
      line-height: 30px;
      border-color: #e9e9e9;
      font-size: 14px;
      padding: 0px 15px;
    }
  }
  ::v-deep .el-textarea__inner{
    resize: none;
  }
  .tips-box{
    position: absolute;
    right: 5px;
    top:8px;
  }
}
.list-item{
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  color: rgba(0,0,0,0.65);
  cursor: pointer;
  padding-left: 10px;
  &:hover,&.selected{
    background-color: var(--ant-primary-1);
  }
}
.icon-ask{
  color: #c9cdd4;
  font-size: 14px;
}

.search-input {
  ::v-deep .el-input__inner{
    height: 38px;
    line-height: 38px;
  }
}
.input-box{
  position: relative;
}

</style>
<style>
.log-query-pop.el-popper[x-placement^=bottom]{
  border-radius: 0;
  border: solid 1px #e9e9e9;
  margin-top:0;
  box-shadow: none;
  max-height: 300px;
  overflow-y: scroll ;
  padding: 0;
}
.log-query-pop.el-popper .popper__arrow{
  display: none;
}
.log-query-tips .title{
  color: rgba(0,0,0,0.4);
  font-size: 12px;
  height: 20px;
  line-height: 20px;
}
.log-query-tips .tip{
  font-size: 12px;
  color:rgb(0,0,0,0.65);
  list-style:disc;
  list-style-position:inside;
  height: 20px;
  line-height: 20px;
  padding-left: 20px;
}

</style>
