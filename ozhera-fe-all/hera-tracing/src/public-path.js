// src/public-path.ts
if (window.__POWERED_BY_QIANKUN__ && process.env.NODE_ENV === "development") {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
