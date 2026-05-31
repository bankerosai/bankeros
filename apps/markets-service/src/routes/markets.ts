import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '@bankeros/shared-utils/src/auth';
import { success, failure } from '@bankeros/shared-utils';
import { FxService } from '../services/fx.service';

const fxSvc = new FxService();

const TradeSchema = z.object({
  accountId: z.string().uuid(),
  buyCurrency: z.string().length(3),
  sellCurrency: z.string().length(3),
  buyAmount: z.string().optional(),
  sellAmount: z.string().optional(),
  tradeType: z.enum(['SPOT', 'FORWARD']).default('SPOT'),
  settlementDate: z.string().optional(),
  quoteId: z.string().optional(),
}).refine((d) => d.buyAmount || d.sellAmount, { message: 'Provide buyAmount or sellAmount' });

export async function marketRoutes(app: FastifyInstance) {
  // Register WebSocket support
  await app.register(import('@fastify/websocket'));

  // GET /v1/markets/fx/quotes  — Point-in-time FX quote (Module 8)
  app.get('/fx/quotes', { preHandler: [requireAuth] }, async (request, reply) => {
    const { base, quote, notional } = request.query as { base: string; quote: string; notional?: string };
    if (!base || !quote) return reply.status(400).send(failure('MISSING_PARAMS', 'base and quote currencies required'));

    try {
      const fxQuote = await fxSvc.getQuote(base, quote, notional);
      return reply.send(success(fxQuote));
    } catch (err: any) {
      return reply.status(500).send(failure('QUOTE_ERROR', err.message));
    }
  });

  // GET /v1/markets/fx/quotes/streaming  — WebSocket real-time streaming (Module 8)
  app.get('/fx/quotes/streaming', { websocket: true }, (socket, request) => {
    const pairs = [['EUR', 'USD'], ['GBP', 'USD'], ['USD', 'JPY'], ['USD', 'CNY'], ['GBP', 'EUR']];

    const stream = setInterval(async () => {
      if (socket.readyState !== 1) { clearInterval(stream); return; }

      const quotes = await Promise.all(
        pairs.map(([base, quote]) => fxSvc.getQuote(base, quote)),
      );
      socket.send(JSON.stringify({ type: 'FX_QUOTE_UPDATE', quotes, timestamp: new Date().toISOString() }));
    }, 1000); // Tick every second

    socket.on('close', () => clearInterval(stream));
    socket.on('error', () => clearInterval(stream));

    // Send initial snapshot
    fxSvc.getQuote('EUR', 'USD').then((q) => {
      socket.send(JSON.stringify({ type: 'CONNECTED', message: 'FX streaming active', initialQuote: q }));
    });
  });

  // POST /v1/markets/fx/trades  — Execute spot/forward FX trade (Module 8)
  app.post('/fx/trades', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = TradeSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid trade request', body.error.flatten()));

    try {
      const trade = await fxSvc.executeFxTrade(body.data);
      return reply.status(201).send(success(trade));
    } catch (err: any) {
      return reply.status(400).send(failure('TRADE_ERROR', err.message));
    }
  });

  // GET /v1/markets/fx/rates/multi  — Multi-currency rates for dashboard
  app.get('/fx/rates/multi', { preHandler: [requireAuth] }, async (request, reply) => {
    const { base = 'USD' } = request.query as { base?: string };
    const targets = ['EUR', 'GBP', 'JPY', 'CNY', 'HKD', 'SGD', 'AUD', 'CHF', 'CAD'].filter((c) => c !== base);

    const quotes = await Promise.allSettled(
      targets.map((t) => fxSvc.getQuote(base, t)),
    );

    const rates = quotes
      .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
      .map((r) => r.value);

    return reply.send(success({ baseCurrency: base, rates, updatedAt: new Date().toISOString() }));
  });

  // GET /v1/markets/health
  app.get('/health', async () => ({ status: 'ok', service: 'Markets Service' }));
}
