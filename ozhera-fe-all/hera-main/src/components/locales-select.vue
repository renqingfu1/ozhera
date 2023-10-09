<template>
<div class="dropdown">
  <Dropdown @on-click="setLocale">
    <span>
      {{ language == 'en-US' ? 'English' : '中文' }}
      <Icon type="ios-arrow-down"></Icon>
    </span>
    <template #list>
      <DropdownMenu>
        <DropdownItem name="zh-CN">中文</DropdownItem>
        <DropdownItem name="en-US">English</DropdownItem>
      </DropdownMenu>
    </template>
  </Dropdown>
</div>
</template>

<script>
import { initGlobalState } from 'qiankun';
import { mapState, mapActions } from 'vuex';

const { setGlobalState } = initGlobalState({});
export default {
  computed: {
    ...mapState('appModule', ['language']),
  },
  methods: {
    ...mapActions('appModule', ['setLanguage']),
    setLocale(locale) {
      const oldLocale = this.$i18n.locale;
      if (oldLocale !== locale) {
        this.$i18n.locale = locale;
        this.setLanguage(locale);
        setGlobalState({
          type: 'lang',
          value: locale,
        });
      }
    },
  },
};
</script>

<style scoped>
.dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.menu {
  position: absolute;
}
</style>
