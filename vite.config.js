import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import vercelConfig from "./vercel.json" with { type: "json" };

const apiProxyTarget = new URL(vercelConfig.rewrites[0].destination).origin;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (
          warning.code === "INVALID_ANNOTATION" &&
          warning.id?.includes("/node_modules/zod/")
        ) {
          return;
        }
        defaultHandler(warning);
      },
      output: {
        manualChunks(id) {
          if (!id.includes("/node_modules/")) return;
          if (/\/(react|react-dom|scheduler)\//.test(id)) return "react-vendor";
          if (/\/(react-router|react-router-dom)\//.test(id)) {
            return "router-vendor";
          }
          if (/\/(@tanstack\/react-query|axios)\//.test(id)) {
            return "data-vendor";
          }
          if (/\/(react-hook-form|@hookform\/resolvers|zod)\//.test(id)) {
            return "forms-vendor";
          }
          if (/\/(leaflet|react-leaflet|@react-leaflet\/core)\//.test(id)) {
            return "map-vendor";
          }
        },
      },
    },
  },
});
