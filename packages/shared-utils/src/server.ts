import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { registerMetrics } from './metrics';

export interface ServerOptions {
  serviceName: string;
  port?: number;
}

export async function createServer(opts: ServerOptions): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport: process.env.NODE_ENV === 'development'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
    },
    requestIdHeader: 'x-correlation-id',
    genReqId: () => require('uuid').v4(),
  });

  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  await app.register(rateLimit, {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    timeWindow: '1 minute',
  });

  app.get('/health', async () => ({
    status: 'ok',
    service: opts.serviceName,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));

  // Prometheus metrics endpoint
  registerMetrics(app, opts.serviceName);

  app.setErrorHandler((error, request, reply) => {
    app.log.error({ err: error, reqId: request.id }, 'Unhandled error');

    if (error.validation) {
      return reply.status(422).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Request validation failed', details: error.validation },
      });
    }

    const statusCode = error.statusCode || 500;
    return reply.status(statusCode).send({
      success: false,
      error: {
        code: statusCode === 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR',
        message: statusCode === 500 ? 'An internal error occurred' : error.message,
      },
    });
  });

  return app;
}

export async function startServer(app: FastifyInstance, port: number, serviceName: string): Promise<void> {
  try {
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`${serviceName} listening on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
