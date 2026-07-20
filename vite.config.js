import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '',
  optimizeDeps: {
    include: ['@magicwenli/league-fan-assets'],
  },
})
