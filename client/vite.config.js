import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import jsconfigPaths from "vite-jsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), jsconfigPaths()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    commonjsOptions: { transformMixedEsModules: true }
  }
})
