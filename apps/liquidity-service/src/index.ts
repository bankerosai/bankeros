import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import { liquidityRoutes } from './routes/liquidity';

async function main() {
  const app = await createServer({ serviceName: 'Liquidity Service' });
  await app.register(liquidityRoutes, { prefix: '/v1/liquidity' });

  const port = parseInt(process.env.PORT || '3009');
  await startServer(app, port, 'Liquidity Service');
}

main();
