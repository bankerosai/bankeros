import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import { journalRoutes } from './routes/journal';
import { startGlConsumers } from './consumers';

async function main() {
  const app = await createServer({ serviceName: 'GL Service' });
  await app.register(journalRoutes, { prefix: '/v1/gl' });

  if (process.env.KAFKA_BROKERS) {
    startGlConsumers().catch((err) => app.log.error({ err }, 'GL consumers failed to start'));
  }

  const port = parseInt(process.env.PORT || '3002');
  await startServer(app, port, 'GL Service');
}

main();
