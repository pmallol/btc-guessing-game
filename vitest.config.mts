import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'
import path from 'path';


export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  plugins: [react()]
});
