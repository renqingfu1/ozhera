class TranslateListener {
  constructor(callback) {
    this.callback = callback;
    document.addEventListener('DOMSubtreeModified', this.handler.bind(this), true);
    this.call(document.querySelector('html').className);
  }

  handler() {
    // 微前端下的回调里没有HTML标签，以下方法得不到调用
    // if (e.target.tagName === 'HTML') {
    //   this.call(e.target.className);
    // }
    const { className } = document.querySelector('html');
    if (this.lastClassName !== className) {
      this.call(className);
    }
  }

  call(className) {
    this.lastClassName = className;
    if (/translated-/.test(className)) {
      this.callback(true);
    } else {
      this.callback(false);
    }
  }

  destroy() {
    document.removeEventListener('DOMSubtreeModified', this.handler, true);
  }
}

export default TranslateListener;
