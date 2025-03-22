import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Vite als Library konfigurieren
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/Widget.tsx"),
      name: "Widget",
      fileName: (format) => `widget.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "framer-motion"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "framer-motion": "framerMotion",
        },
      },
    },
  },
});
