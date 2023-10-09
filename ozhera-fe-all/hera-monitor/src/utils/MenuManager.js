export const isAllMenuMode = mode => {
  return mode !== "general" //非中国区、全集团通用模式
}

export const filterMenuByMode = (arr, mode) => {
  console.log("MenuManager filterMenuByMode", mode)
  if (mode) {
    const arr2 = []
    arr.forEach(m => {
      if (m.children) {
        const m2 = { ...m }
        m2.children = m.children.filter(c => c.mode !== mode)
        arr2.push(m2)
      } else {
        if (m.mode !== mode) {
          arr2.push(m)
        }
      }
    })
    return arr2
  }
  return arr
}

// 以下方式，在父子应用间没法跑通，环境是隔离的
const KEY_HERA_MENU_MODE = "hera-menu-mode"

export const getMenuMode = () => {
  return localStorage.getItem(KEY_HERA_MENU_MODE) || "all"
}

export const listenMenuModeStorageChange = cb => {
  const listener = event => {
    if (event.key === KEY_HERA_MENU_MODE) {
      console.log("MenuManager listen", event.newValue)
      cb(event.newValue)
    }
  }
  window.addEventListener("storage", listener)
  return () => window.removeEventListener("storage", listener)
}
