import path from "path"
import react from "@vitejs/plugin-react-swc"
import tailwind from "@tailwindcss/vite"
import {defineConfig} from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
