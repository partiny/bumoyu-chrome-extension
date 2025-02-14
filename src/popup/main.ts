import { createApp } from "vue";
import Popup from './popup.vue'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(Popup)

app.use(ElementPlus)
app.mount('#app')