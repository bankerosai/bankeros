import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import { copilotRoutes } from './routes';

async function main() {
  const provider = (process.env.COPILOT_PROVIDER ?? 'anthropic').toLowerCase();
  if (provider === 'openrouter' && !process.env.OPENROUTER_API_KEY) {
    console.warn('[banker-copilot] OPENROUTER_API_KEY not set — model calls will fail.');
  } else if (provider !== 'openrouter' && !process.env.ANTHROPIC_API_KEY) {
    console.warn('[banker-copilot] ANTHROPIC_API_KEY not set — model calls will fail.');
  }
  console.log(`[banker-copilot] provider=${provider}`);
  const app = await createServer({ serviceName: 'Banker Copilot Service' });
  await app.register(copilotRoutes, { prefix: '/v1/copilot' });
  const port = parseInt(process.env.PORT || '3017');
  await startServer(app, port, 'Banker Copilot Service');
}

main();
