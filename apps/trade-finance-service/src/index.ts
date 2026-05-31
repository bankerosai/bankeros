import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import { tradeFinanceRoutes } from './routes/trade-finance';

async function main() {
  const app = await createServer({ serviceName: 'Trade Finance Service' });
  await app.register(tradeFinanceRoutes, { prefix: '/v3/trade-finance' });

  const port = parseInt(process.env.PORT || '3007');
  await startServer(app, port, 'Trade Finance Service');
}

main();
