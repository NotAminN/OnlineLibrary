import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'Front',
  envDir: '../',
  // Use relative base so the build can be served from any static host or a subpath.
  base: '/static/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'Front/index.html'),
        explore: resolve(__dirname, 'Front/explore.html'),
        categories: resolve(__dirname, 'Front/categories.html'),
        authors: resolve(__dirname, 'Front/authors.html'),
        collections: resolve(__dirname, 'Front/collections.html'),
        book: resolve(__dirname, 'Front/book.html'),
        reader: resolve(__dirname, 'Front/reader.html'),
        library: resolve(__dirname, 'Front/library.html'),
        dashboard: resolve(__dirname, 'Front/dashboard.html'),
        favorites: resolve(__dirname, 'Front/favorites.html'),
        history: resolve(__dirname, 'Front/history.html'),
        shelves: resolve(__dirname, 'Front/shelves.html'),
        statistics: resolve(__dirname, 'Front/statistics.html'),
        profile: resolve(__dirname, 'Front/profile.html'),
        settings: resolve(__dirname, 'Front/settings.html'),
        login: resolve(__dirname, 'Front/login.html'),
        register: resolve(__dirname, 'Front/register.html'),
        about: resolve(__dirname, 'Front/about.html'),
        faq: resolve(__dirname, 'Front/faq.html'),
        contact: resolve(__dirname, 'Front/contact.html')
      }
    }
  },
  server: {
    port: 5173,
    open: false,
    // Forward API calls to the Django backend during development.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8800',
        changeOrigin: true
      },
      '/media': {
        target: 'http://127.0.0.1:8800',
        changeOrigin: true
      }
    },
    // Prevent the browser from caching modules/assets in dev so edits always show up.
    headers: {
      'Cache-Control': 'no-store'
    }
  }
});
