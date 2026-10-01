import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: ruta del repo en GitHub Pages
export default defineConfig({
  base: "/guerrafria/",
  plugins: [react()],
  build: {
    outDir: "dist"
  }
});
