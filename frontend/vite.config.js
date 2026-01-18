import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const BASE_URL = env.VITE_APP_BASE_NAME || "/";

  return {
    base: BASE_URL,

    plugins: [react()],

    resolve: {
      alias: {
        layouts: path.resolve(__dirname, "src/layouts"),
        components: path.resolve(__dirname, "src/components"),
        views: path.resolve(__dirname, "src/views"),
        assets: path.resolve(__dirname, "src/assets"),
        variables: path.resolve(__dirname, "src/variables"),
        routes: path.resolve(__dirname, "src/routes.jsx"),
        context: path.resolve(__dirname, "src/context"),
        "@tabler/icons-react":
          "@tabler/icons-react/dist/esm/icons/index.mjs",
      },
    },

    define: {
      global: "window",
    },

    server: {
      open: true,
      port: 3000,
      host: true,
      proxy: {
        "/api": {
          target: "http://localhost:9000",
          changeOrigin: true,
          secure: false,
        },
        "/uploads": {
          target: "http://localhost:9000",
          changeOrigin: true,
        },
        "/static": {
          target: "http://localhost:9000",
          changeOrigin: true,
        },
      },
    },

    preview: {
      open: true,
      host: true,
    },

    build: {
      chunkSizeWarningLimit: 1600,
    },
  };
});
