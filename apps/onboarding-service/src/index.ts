import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import { customerRoutes } from './routes/customers';

async function main() {
  const app = await createServer({ serviceName: 'Onboarding Service' });
  await app.register(customerRoutes, { prefix: '/v1/customers' });

  const port = parseInt(process.env.PORT || '3003');
  await startServer(app, port, 'Onboarding Service');
}

main();
