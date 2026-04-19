import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const uploadsTarget =
    env.VITE_UPLOADS_PROXY_TARGET || env.VITE_API_PROXY_TARGET || "http://127.0.0.1:5000";

  return {
    base: "/",
    plugins: [react(), tailwindcss()],
    build: {
      outDir: "dist",
      assetsDir: "assets",
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    server: {
      port: 3000,
      host: true,
      proxy: {
        "/uploads": {
          target: uploadsTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
