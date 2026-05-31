import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import { loanRoutes } from './routes/loans';

async function main() {
  const app = await createServer({ serviceName: 'Lending Service' });
  await app.register(loanRoutes, { prefix: '/fineract-provider/api/v1/loans' });

  const port = parseInt(process.env.PORT || '3004');
  await startServer(app, port, 'Lending Service');
}

main();
