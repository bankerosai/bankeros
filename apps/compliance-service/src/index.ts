import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import { complianceRoutes } from './routes/compliance';
import { startComplianceConsumers } from './consumers';

async function main() {
  const app = await createServer({ serviceName: 'Compliance Service' });
  await app.register(complianceRoutes, { prefix: '/v1/compliance' });
  await app.register(complianceRoutes, { prefix: '/v1/risk' });

  if (process.env.KAFKA_BROKERS) {
    startComplianceConsumers().catch((err) => app.log.error({ err }, 'Compliance consumers failed'));
  }

  const port = parseInt(process.env.PORT || '3006');
  await startServer(app, port, 'Compliance Service');
}

main();
