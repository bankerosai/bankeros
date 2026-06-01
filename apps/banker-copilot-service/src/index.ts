import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import { copilotRoutes } from './routes';

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('[banker-copilot] ANTHROPIC_API_KEY not set — service will start but Claude calls will fail.');
  }
  const app = await createServer({ serviceName: 'Banker Copilot Service' });
  await app.register(copilotRoutes, { prefix: '/v1/copilot' });
  const port = parseInt(process.env.PORT || '3017');
  await startServer(app, port, 'Banker Copilot Service');
}

main();
