// 全局组件注册
import Vue from 'vue'
import LoneIcon from './lone-icon';
import LonePagination from './lone-pagination';
import LoneModule from './lone-module';
import LoneCodediff from './lone-codediff';
import LoneDialog from './lone-dialog';

Vue.component('lone-icon',LoneIcon)
Vue.component('lone-pagination',LonePagination)
Vue.component('lone-module',LoneModule)
Vue.component('lone-codediff',LoneCodediff)
Vue.component('lone-dialog',LoneDialog)