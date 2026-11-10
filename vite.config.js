import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./react-site', import.meta.url));
const pages = ['index', 'explore', 'fuxi', 'bronze', 'apple', 'maiji', 'river', 'quiz'];

export default defineConfig({
  root,
  base: './',
  plugins: [react()],
  build: {
    outDir: '../docs',
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(pages.map(page => [page, resolve(root, `${page}.html`)])),
    },
  },
});
