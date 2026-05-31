import { prisma } from '@bankeros/database';
import Decimal from 'decimal.js';
import { generateId } from '@bankeros/shared-utils';

export interface FxQuote {
  quoteId: string;
  baseCurrency: string;
  quoteCurrency: string;
  bid: string;
  ask: string;
  mid: string;
  spread: string;
  expiresAt: string;
  timestamp: string;
}

export interface FxTradeInput {
  accountId: string;
  buyCurrency: string;
  sellCurrency: string;
  buyAmount?: string;
  sellAmount?: string;
  tradeType: 'SPOT' | 'FORWARD';
  settlementDate?: string;   // Required for FORWARD
  quoteId?: string;
}

// Simulated FX liquidity pool with indicative spreads (pips)
const SPREAD_PIPS: Record<string, number> = {
  EURUSD: 1, GBPUSD: 1.5, USDJPY: 1, USDCHF: 2, AUDUSD: 2,
  USDCAD: 2, USDCNY: 10, GBPEUR: 2, EURGBP: 2,
};

function getSpreadPips(pair: string): number {
  return SPREAD_PIPS[pair] || SPREAD_PIPS[pair.split('').reverse().join('')] || 3;
}

export class FxService {
  async getQuote(baseCurrency: string, quoteCurrency: string, notional?: string): Promise<FxQuote> {
    // Fetch latest ECB mid-rate from DB
    const fxRate = await prisma.fxRate.findFirst({
      where: { baseCurrency, quoteCurrency },
      orderBy: { rateDate: 'desc' },
    });

    let mid: Decimal;
    if (fxRate) {
      mid = new Decimal(fxRate.rate.toString());
    } else {
      // Try inverse
      const inverse = await prisma.fxRate.findFirst({
        where: { baseCurrency: quoteCurrency, quoteCurrency: baseCurrency },
        orderBy: { rateDate: 'desc' },
      });
      if (inverse) {
        mid = new Decimal(1).dividedBy(inverse.rate.toString());
      } else {
        // Fallback stub rates (production: call Bloomberg/Reuters API)
        const stubs: Record<string, string> = {
          'USD-EUR': '0.9213', 'USD-GBP': '0.7891', 'USD-JPY': '149.87',
          'USD-CNY': '7.2541', 'USD-HKD': '7.8151', 'USD-SGD': '1.3421',
          'EUR-USD': '1.0854', 'GBP-USD': '1.2674',
        };
        const key = `${baseCurrency}-${quoteCurrency}`;
        mid = new Decimal(stubs[key] || '1.0');
      }
    }

    const pairKey = `${baseCurrency}${quoteCurrency}`;
    const spreadPips = getSpreadPips(pairKey);

    // Spread in rate terms — pip value depends on pair
    const pipValue = new Decimal(0.0001);
    const halfSpread = new Decimal(spreadPips).times(pipValue).dividedBy(2);

    // Larger notional = tighter spread (institutional pricing)
    let spreadMultiplier = new Decimal(1);
    if (notional) {
      const amount = new Decimal(notional);
      if (amount.gt(1000000)) spreadMultiplier = new Decimal(0.7);
      if (amount.gt(10000000)) spreadMultiplier = new Decimal(0.5);
    }

    const adjustedHalfSpread = halfSpread.times(spreadMultiplier);
    const bid = mid.minus(adjustedHalfSpread);
    const ask = mid.plus(adjustedHalfSpread);

    return {
      quoteId: generateId(),
      baseCurrency,
      quoteCurrency,
      bid: bid.toFixed(6),
      ask: ask.toFixed(6),
      mid: mid.toFixed(6),
      spread: adjustedHalfSpread.times(2).toFixed(6),
      expiresAt: new Date(Date.now() + 30 * 1000).toISOString(), // 30s validity
      timestamp: new Date().toISOString(),
    };
  }

  async executeFxTrade(input: FxTradeInput) {
    const account = await prisma.account.findUnique({ where: { id: input.accountId } });
    if (!account || account.status !== 'ACTIVE') throw new Error('Account not found or inactive');

    const quote = await this.getQuote(input.buyCurrency, input.sellCurrency);
    const rate = new Decimal(quote.ask); // Buy at ask

    let buyAmount: Decimal;
    let sellAmount: Decimal;

    if (input.buyAmount) {
      buyAmount = new Decimal(input.buyAmount);
      sellAmount = buyAmount.times(rate);
    } else if (input.sellAmount) {
      sellAmount = new Decimal(input.sellAmount);
      buyAmount = sellAmount.dividedBy(rate);
    } else {
      throw new Error('Either buyAmount or sellAmount must be provided');
    }

    const settlementDate = input.tradeType === 'SPOT'
      ? new Date(Date.now() + 2 * 86400 * 1000) // T+2
      : new Date(input.settlementDate!);

    const tradeRef = `FX${Date.now()}`;

    return {
      tradeReference: tradeRef,
      accountId: input.accountId,
      tradeType: input.tradeType,
      buyCurrency: input.buyCurrency,
      sellCurrency: input.sellCurrency,
      buyAmount: buyAmount.toFixed(2),
      sellAmount: sellAmount.toFixed(2),
      executedRate: quote.ask,
      midRate: quote.mid,
      spread: quote.spread,
      settlementDate: settlementDate.toISOString().split('T')[0],
      status: 'CONFIRMED',
      executedAt: new Date().toISOString(),
    };
  }
}
