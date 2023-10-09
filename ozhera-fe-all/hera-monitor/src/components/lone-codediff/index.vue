<!--
  代码diff组件：基于codemirror
 -->
<template>
  <div id='codeContent' class='code-content'></div>
</template>

<script>
import codeMirror from 'codemirror'
import 'codemirror/addon/merge/merge.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/merge/merge.css'
import diffMatchPatch from 'diff-match-patch'
window.diff_match_patch = diffMatchPatch
window.DIFF_DELETE = -1
window.DIFF_INSERT = 1
window.DIFF_EQUAL = 0

export default {
  name: 'lone-codediff',
  props: {
    origin: {
      type: String,
      required: true,
      default: ''
    },
    target: {
      type: String,
      required: false,
      default: ''
    }
  },
  mounted() {
    let origin  = JSON.stringify(JSON.parse(this.origin), null, 2);
    let target = JSON.stringify(JSON.parse(this.target), null, 2);
    this.diffCodeUI(origin,target);
  },
  methods: {
    diffCodeUI (origin, target) {
      if (target == null) return
      const container = document.getElementById('codeContent');
      container.innerHTML = '';
      codeMirror.MergeView(container, {
        value: origin, // 原始值
        origLeft: null,
        orig: target, // 目标值
        lineNumbers: true,
        mode: 'shell',
        highlightDifferences: true,
        styleActiveLine: true,
        matchBrackets: true,
        connect: 'align',
        readOnly: 'nocursor',
        revertButtons: false // 关闭'revert chunk'还原模块
      })
    }
  }
}
</script>

<style lang="less">
.code-content {
  .CodeMirror-merge, .CodeMirror-merge .CodeMirror {
    height: 600px;
  }
}
</style>