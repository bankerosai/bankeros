import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { auditRoutes } from './routes/audit';

async function main() {
  const app = await createServer({ serviceName: 'IAM Service' });

  await app.register(authRoutes, { prefix: '/v1/iam' });
  await app.register(userRoutes, { prefix: '/v1/iam' });
  await app.register(auditRoutes, { prefix: '/v1' });

  const port = parseInt(process.env.PORT || '3001');
  await startServer(app, port, 'IAM Service');
}

main();
