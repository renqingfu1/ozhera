<template>
  <el-select
    v-model="selVal"
    :placeholder="$t('pleaseSel')"
    @change="changeSel"
    size="mini"
    style="min-width:341px;"
    multiple
  >
    <el-option
      v-for="item in options"
      :key="item.baseUrl"
      :label="item.name"
      :value="item.baseUrl"
    >
    </el-option>
  </el-select>
</template>

<script>
import server from "@/api/service/alarm-srategy.js"
export default {
  props: {
    value: {
      type: Array,
    },
  },
  data() {
    return {
      selectDisabled: false,
      options: [],
    }
  },
  computed: {
    selVal: {
      get() {
        return this.value
      },
      set(newV) {
        return newV
      },
    },
  },
  mounted() {
    server.taslaGateWay().then(res => {
      this.options = res && res.list || []
    })
  },
  methods: {
    changeSel(val) {
      this.$emit("input", val)
    },
  },
}
</script>