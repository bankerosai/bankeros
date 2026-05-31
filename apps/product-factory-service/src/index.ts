import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import { productRoutes } from './routes/products';

async function main() {
  const app = await createServer({ serviceName: 'Product Factory Service' });
  await app.register(productRoutes, { prefix: '/v1/product-factory' });

  const port = parseInt(process.env.PORT || '3012');
  await startServer(app, port, 'Product Factory Service');
}

main();
