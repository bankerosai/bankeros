import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import { syndicationRoutes } from './routes/syndication';

async function main() {
  const app = await createServer({ serviceName: 'Syndication Service' });
  await app.register(syndicationRoutes, { prefix: '/v1/lending' });

  const port = parseInt(process.env.PORT || '3013');
  await startServer(app, port, 'Syndication Service');
}

main();
