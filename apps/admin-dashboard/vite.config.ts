import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5200,
    proxy: {
      // Banker Copilot → its dedicated microservice on :3017.
      // Routed before the generic /api proxy so /v1/copilot does NOT go to the gateway.
      '/v1/copilot': {
        target: 'http://localhost:3017',
        changeOrigin: true,
      },
      // Everything else under /api → API Gateway.
      '/api': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/api/, ''),
        changeOrigin: true,
      },
    },
  },
});
