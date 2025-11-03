// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, './src/components'),
      "@styles": path.resolve(__dirname, './src/styles'),
      "@pages": path.resolve(__dirname, './src/pages'),
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:5000", // Thêm dòng này để proxy API sang backend
    },
  },
});
