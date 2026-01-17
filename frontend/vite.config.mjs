import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = `${env.VITE_APP_BASE_NAME}`;
  const PORT = 3000;

  return {
    server: {
      open: true,
      port: PORT,
      host: true,

      //  Added proxy for backend on port 9000
      proxy: {
        '/api': {
          target: 'http://localhost:9000',
          changeOrigin: true,
          secure: false
        },
        '/uploads': {
          target: 'http://localhost:9000',
          changeOrigin: true
        },
        '/static': {
          target: 'http://localhost:9000',
          changeOrigin: true
        }
      }
    },

    preview: {
      open: true,
      host: true
    },

    build: {
      chunkSizeWarningLimit: 1600
    },

    define: {
      global: 'window'
    },

    resolve: {
      alias: {
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'
      }
    },

    base: API_URL,
    plugins: [react(), jsconfigPaths()]
  };
});
