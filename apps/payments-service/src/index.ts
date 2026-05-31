import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import { paymentRoutes } from './routes/payments';

async function main() {
  const app = await createServer({ serviceName: 'Payments Service' });
  await app.register(paymentRoutes, { prefix: '/v1/payments' });

  const port = parseInt(process.env.PORT || '3005');
  await startServer(app, port, 'Payments Service');
}

main();
