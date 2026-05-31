import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import { cdpRoutes } from './routes/cdp';
import { startCdpConsumers } from './consumers';

async function main() {
  const app = await createServer({ serviceName: 'CDP Service' });
  await app.register(cdpRoutes, { prefix: '/v1/insights' });
  await app.register(cdpRoutes, { prefix: '/v1/analytics' });

  if (process.env.KAFKA_BROKERS) {
    startCdpConsumers().catch((err) => app.log.error({ err }, 'CDP consumers failed'));
  }

  const port = parseInt(process.env.PORT || '3014');
  await startServer(app, port, 'CDP Service');
}

main();
