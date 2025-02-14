// 监听消息
chrome.runtime.onMessage.addListener((req, send, sendRes) => {
  console.log(req)
  switch (req.action) {
    // 打开管理页面
    case 'PAGE_ADMIN_OPEN':
      handleOpenAdmin()
      break
  }
})

// 打开管理页面
function handleOpenAdmin() {
  // 查询当前窗口的所有标签页数量
  let total = 0
  chrome.tabs.query({ currentWindow: true }, tabList => {
    total = tabList.length
  })
  // 查询插件后台页面打开的数量
  chrome.tabs.query(
    {
      url: 'chrome-extension://*/admin.html*',
      currentWindow: true
    },
    adminTabs => {
      // 如果数量为0，则重新打开
      if (!adminTabs.length) {
        chrome.tabs.create({
          index: total,
          url: chrome.runtime.getURL('admin.html')
        })
        return
      }
      // 如果数量不为0，则跳转到第一个后台页面，并重新加载
      const { id, index } = adminTabs[0]
      if (!id) return
      chrome.tabs.move(
        id, { index },
        () => {
          chrome.tabs.update(id, { highlighted: true })
          chrome.tabs.reload(id)
        }
      )
    }
  )
}