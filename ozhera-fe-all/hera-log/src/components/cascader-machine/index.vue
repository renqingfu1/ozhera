<template>
  <el-cascader
    v-bind="$attrs"
    v-model="machineValue"
    ref="demoCascader"
    :options="machineOptions"
    :props="{ multiple: true }"
    @change="changeValue"
    :size="size"
    clearable
  >
  </el-cascader>
</template>
<script>
import { getMachineByAppId, getStoreById } from '@/common/req/list/logConfig';

export default {
  props: {
    appId: {
      required: true,
    },
    value: Array,
    storeId: {
      // 根据storeId获取storeMachine
      require: true,
    },
    size: {
      type: String,
      default: 'mini',
    },
  },
  model: {
    prop: 'value',
    event: 'modelVal', // 自定义方法，用来更新 model
  },
  data() {
    return {
      machineOptions: [],
      machineValue: [],
      storeMachine: '',
    };
  },
  watch: {
    appId(newV, oldV) {
      if (oldV === newV) return;
      this.getOptions(newV);
    },
    value(newV) {
      this.editShowMotorRooms(newV);
    },
  },
  methods: {
    changeValue(changeV) {
      // 解决方法
      this.$nextTick(() => {
        const nodeObj = this.$refs.demoCascader.getCheckedNodes();
        const newObjArr = nodeObj.filter((item) => item.level === 2);
        const sendData = [];
        newObjArr.forEach((item) => {
          const pData = item.parent.data;
          const pObj = {
            nameCn: pData.nameCn,
            nameEn: pData.nameEn,
          };
          const childData = item.data;
          delete childData.value;
          delete childData.label;
          // eslint-disable-next-line no-unused-expressions
          const hasParent = sendData.some((myitem) => myitem.nameEn === pData.nameEn);
          if (hasParent) {
            const index = sendData.findIndex((val) => val.nameEn === pObj.nameEn);
            sendData[index].podDTOList.push(childData);
          } else {
            pObj.podDTOList = [childData];
            sendData.push(pObj);
          }
        });
        this.machineValue = changeV;
        this.$emit('modelVal', sendData);
      });
    },
    getOptions(val) {
      getMachineByAppId({ milogAppId: val, machineRoom: this.storeMachine })
        .then((res) => {
          const resArr = res.data;
          const resHasChild = resArr.map((item) => {
            // eslint-disable-next-line no-param-reassign
            item = {
              // 给机房的每个数据增加一个children属性
              ...item,
              ...{
                children: item.podDTOList || [],
                label: item.nameCn,
                value: item.nameEn,
              },
            };
            item.children.map((child) => {
              // 给每个children增加label/value属性
              // eslint-disable-next-line no-param-reassign
              child.label = `${child.nodeIP}(${child.podIP})`;
              // eslint-disable-next-line no-param-reassign
              child.value = `${child.nodeIP}(${child.podIP})(${child.nodeName})(${child.podName})`;
              return child;
            });
            return item;
          });
          this.machineOptions = resHasChild || [];
        })
        .catch((err) => {
          console.log('err', err);
        });
    },
    editShowMotorRooms(resData) {
      const motorRoomsArr = resData || []; // 把他转成数组；
      const resArr = [];
      motorRoomsArr.forEach((item) => {
        if (item.podDTOList && item.podDTOList.length > 0) {
          const innerChildren = item.podDTOList;
          innerChildren.forEach((child) => {
            const obj = [];
            obj.push(item.nameEn);
            obj.push(`${child.nodeIP}(${child.podIP})(${child.nodeName})(${child.podName})`);
            resArr.push(obj);
          });
        }
      });
      this.machineValue = resArr;
    },
    getStoreDetail(val, cb) {
      getStoreById({ id: val }).then((res) => {
        this.storeMachine = res.data.machineRoom;
        if (cb) cb();
      });
    },
  },
  mounted() {
    this.editShowMotorRooms(this.value);
    this.getStoreDetail(this.storeId, () => {
      if (!this.appId) return;
      this.getOptions(this.appId);
    });
  },
};
</script>
