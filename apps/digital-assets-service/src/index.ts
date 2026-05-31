import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import { digitalAssetsRoutes } from './routes/digital-assets';

async function main() {
  const app = await createServer({ serviceName: 'Digital Assets Service' });
  await app.register(digitalAssetsRoutes, { prefix: '/v1/digital-assets' });

  const port = parseInt(process.env.PORT || '3015');
  await startServer(app, port, 'Digital Assets Service');
}

main();
