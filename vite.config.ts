import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/features/common/utils', import.meta.url)),
      '@common': fileURLToPath(new URL('./src/features/common', import.meta.url)),
      '@home': fileURLToPath(new URL('./src/features/home', import.meta.url)),
      '@news': fileURLToPath(new URL('./src/features/news', import.meta.url)),
      '@projects': fileURLToPath(new URL('./src/features/projects', import.meta.url)),
    },
  },
});
