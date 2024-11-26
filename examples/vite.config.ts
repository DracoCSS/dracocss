import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dracoCss from "../dist/index.js";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), dracoCss()],
})
