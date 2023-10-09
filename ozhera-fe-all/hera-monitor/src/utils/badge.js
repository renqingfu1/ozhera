/**
 * 自定义控制台徽章
 * @param {*} title 
 */
const badge = (title) => {
  console.log(`%c${title}`, "color:#fff;background-color:#0AA6F3;padding:4px; border-radius:6px")
}

export { badge }