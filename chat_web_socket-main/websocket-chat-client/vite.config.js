import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/chatrooms': {
        target: 'http://localhost:8788',
        changeOrigin: true,
      },
      '/studygroups': { // ✅ 요거 추가
        target: 'http://localhost:8788',
        changeOrigin: true,
      },
      '/ws': {
        target: 'http://localhost:8788',
        ws: true,
      },
    },
  },
  define: {
    global: 'globalThis',
  },
});
