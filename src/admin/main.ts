import { createApp } from "vue";
import Admin from './admin.vue'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import 'element-plus/dist/index.css'

createApp(Admin).mount('#app')