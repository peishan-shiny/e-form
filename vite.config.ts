import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})

// export default defineConfig(({ command, mode }) => {
//   // 根據當前工作目錄中的 `mode` 加載 .env 文件
//   // 設置第三個參數為 '' 來加載所有環境變量，而不管是否有 `VITE_` 前綴。
//   const env = loadEnv(mode, process.cwd())
//   console.log( env.VITE_BASE); //輸出VITE_BASE的環境變數
//   return {
//     plugins: [vue()],
//     base: env.VITE_BASE,
//     resolve: {
//       alias: {
//         '@': fileURLToPath(new URL('./src', import.meta.url))
//       }
//     },
//     css: {
//       preprocessorOptions: {
//         scss: {
//           additionalData: `@import "@/styles/main.css";`
//         }
//       }
//     },
//     // server: {
//     //   proxy: {
//     //     // 字串寫法
//     //     '/foo': 'http://localhost:4567',
//     //     // 選項寫法
//     //     '/api': {
//     //       target: 'http://jsonplaceholder.typicode.com',
//     //       changeOrigin: true,
//     //       rewrite: (path) => path.replace(/^\/api/, '')
//     //     },
//     //     // 正則寫法
//     //     '^/fallback/.*': {
//     //       target: 'http://jsonplaceholder.typicode.com',
//     //       changeOrigin: true,
//     //       rewrite: (path) => path.replace(/^\/fallback/, '')
//     //     },
//     //   }
//     // }
//   }
// })
