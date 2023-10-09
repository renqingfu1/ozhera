<template>
  <div id="container" :style="{'height': height}"></div>
</template>
<script>
import * as monaco from 'monaco-editor';

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '440px',
    },
    lang: {
      type: String,
      default: 'java',
    },
    theme: { // 官方自带三种主题vs, hc-black, or vs-dark
      type: String,
      default: 'vs-dark',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value(newV, oldV) {
      if (oldV !== newV) {
        this.editor.setValue(newV);
      }
    },
  },
  data() {
    return {
      editor: null, // 文本编辑器
    };
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    initEditor() {
      // 初始化编辑器，确保dom已经渲染
      this.editor = monaco.editor.create(document.getElementById('container'), {
        value: this.value, // 编辑器初始显示文字
        language: this.lang, // 语言支持自行查阅demo
        automaticLayout: true, // 自动布局
        theme: this.theme, // 官方自带三种主题vs, hc-black, or vs-dark
        readOnly: this.readonly,
      });
    },
    getValue() {
      return this.editor.getValue(); // 获取编辑器中的文本
    },
  },
};
</script>
