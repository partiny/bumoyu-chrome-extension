import { fileURLToPath, URL } from 'node:url'
import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ManifestJson from './src/utils/get-manifest'
import { resolve } from 'node:path'
import UnoCss from 'unocss/vite'

const OUTPUT_DIR = 'dist_crx'
// 编写导出manifest.json的插件
const jsonPlugin: Plugin = {
  name: 'json-plugin',
  writeBundle() {
    const outputPath = `${OUTPUT_DIR}/manifest.json`
    fs.writeFileSync(outputPath, JSON.stringify(ManifestJson, null, 2))
  }
}
export default defineConfig({
  publicDir: 'src/public',
  plugins: [
    vue(),
    UnoCss(),
    jsonPlugin,
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000
  },
  build: {
    outDir: OUTPUT_DIR,
    assetsDir: 'assets', // 指定生成静态资源的存放路径，默认assets
    rollupOptions: {
      input: {
        'background': resolve(__dirname, 'src/utils/background.ts'),
        'popup': resolve(__dirname, 'popup.html'),
        'admin': resolve(__dirname, 'admin.html')
      },
      output: {
        entryFileNames: 'js/[name].js'
      }
    }
  }
})
