import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import { middleOfficeRoutes } from './routes/middle-office';

async function main() {
  const app = await createServer({ serviceName: 'Middle Office Service' });
  await app.register(middleOfficeRoutes, { prefix: '/v1/middle-office' });
  await app.register(middleOfficeRoutes, { prefix: '/v1/documents' });
  await app.register(middleOfficeRoutes, { prefix: '/open-banking/v3.1' });

  const port = parseInt(process.env.PORT || '3016');
  await startServer(app, port, 'Middle Office Service');
}

main();
