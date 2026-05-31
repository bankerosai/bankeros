import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import { marketRoutes } from './routes/markets';

async function main() {
  const app = await createServer({ serviceName: 'Markets Service' });
  await app.register(marketRoutes, { prefix: '/v1/markets' });

  const port = parseInt(process.env.PORT || '3011');
  await startServer(app, port, 'Markets Service');
}

main();
