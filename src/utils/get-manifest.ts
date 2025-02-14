const manifestV3 = {
  "name": "不摸鱼",
  "version": "0.0.1",
  "manifest_version": 3,
  "description": "chrome-extension-framework",
  "icons": {
    "16": "logo_16.png",
    "48": "logo_48.png"
  },
  "chrome_url_overrides": { // 占用浏览器新开页，若不需要则注释掉
    "newtab": "admin.html"
  },
  "permissions": [
    "tabs",
    "storage"
  ],
  "action": {
    "default_icon": {
      "16": "logo_16.png",
      "48": "logo_48.png"
    },
    "default_title": "不摸鱼",
    "default_popup": "popup.html"
  },
  "background": {
    "service_worker": "js/background.js",
    "type": "module"
  },
  "content_scripts": []
}



export default manifestV3