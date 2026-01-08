import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ["cst-production.up.railway.app"],
  },
  resolve: {
    dedupe: ["react", "react-dom", "react-router", "react-router-dom"],
  },
});
