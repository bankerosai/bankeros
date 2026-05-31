import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import { wealthRoutes } from './routes/wealth';

async function main() {
  const app = await createServer({ serviceName: 'Wealth Service' });
  await app.register(wealthRoutes, { prefix: '/v1/wealth' });

  const port = parseInt(process.env.PORT || '3008');
  await startServer(app, port, 'Wealth Service');
}

main();
