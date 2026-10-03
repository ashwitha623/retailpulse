import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        dashboard: resolve(import.meta.dirname, 'dashboard/index.html'),
        charts: resolve(import.meta.dirname, 'charts/index.html'),
        insights: resolve(import.meta.dirname, 'insights/index.html'),
      },
    },
  },
});
