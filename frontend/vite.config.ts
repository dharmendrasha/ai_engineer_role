import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // change dev server port if needed
    open: true, // auto-open browser
  },
  build: {
    outDir: "dist", // default
  },
  resolve: {
    alias: {
      "@": "/src", // allows import like "@/components/Button"
    },
  },
});
