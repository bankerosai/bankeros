import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { copilotDevPlugin } from './src/dev/copilot-dev-plugin';

export default defineConfig(({ mode }) => {
  // Load .env from the monorepo root so OPENROUTER_API_KEY is available
  // to the dev plugin running inside this same Vite process.
  const envFromAppDir = loadEnv(mode, process.cwd(), '');
  const envFromRepoRoot = loadEnv(mode, `${process.cwd()}/../..`, '');
  for (const [k, v] of Object.entries({ ...envFromRepoRoot, ...envFromAppDir })) {
    if (process.env[k] === undefined) process.env[k] = v as string;
  }

  return {
    plugins: [
      react(),
      copilotDevPlugin(), // serves /v1/copilot/* in dev — no separate service needed
    ],
    server: {
      port: 5200,
      // Listen on every interface (IPv4 + IPv6) so localhost / 127.0.0.1 /
      // [::1] all reach the same Vite instance — avoids "browser uses one
      // family, Vite binds the other" confusion.
      host: '0.0.0.0',
      proxy: {
        // Everything else under /api → API Gateway (only if it's running)
        '/api': {
          target: 'http://localhost:3000',
          rewrite: (path) => path.replace(/^\/api/, ''),
          changeOrigin: true,
        },
      },
    },
  };
});
