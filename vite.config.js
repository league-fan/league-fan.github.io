import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "",
  define: {
    // Vue 3 esm-bundler feature flags (silence dev warnings / better tree-shake)
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  },
  optimizeDeps: {
    include: ["@magicwenli/league-fan-assets"],
  },
  server: {
    port: 5173,
    strictPort: false,
  },
});
