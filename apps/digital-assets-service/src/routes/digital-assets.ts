import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth, requireRole } from '@bankeros/shared-utils/src/auth';
import { success, failure, generateId } from '@bankeros/shared-utils';
import Decimal from 'decimal.js';

// In-memory vault (production: integrate HSM + MPC key management + DLT node)
const wallets: Map<string, any> = new Map();
const transactions: Map<string, any> = new Map();
const tokenizedAssets: Map<string, any> = new Map();

const CreateWalletSchema = z.object({
  customerId: z.string().uuid(),
  walletType: z.enum(['CUSTODY', 'CBDC', 'TOKENIZED_DEPOSIT']),
  supportedAssets: z.array(z.string()),
});

const TransferSchema = z.object({
  fromWalletId: z.string().uuid(),
  toAddress: z.string().min(10),
  assetSymbol: z.string(),
  amount: z.string(),
  memo: z.string().optional(),
  travelRuleData: z.object({          // FATF Travel Rule compliance (Module 18)
    originatorName: z.string(),
    originatorAccountId: z.string(),
    beneficiaryName: z.string(),
    beneficiaryVasp: z.string().optional(),
  }).optional(),
});

const TokenizeSchema = z.object({
  assetType: z.enum(['BOND', 'DEPOSIT', 'EQUITY', 'FUND_SHARE', 'REAL_ESTATE']),
  name: z.string(),
  symbol: z.string().max(10),
  totalSupply: z.string(),
  faceValue: z.string(),
  currency: z.string().length(3),
  maturityDate: z.string().optional(),
  couponRate: z.string().optional(),
  issuerCifId: z.string().uuid(),
});

export async function digitalAssetsRoutes(app: FastifyInstance) {
  // POST /v1/digital-assets/wallets  — Create custody wallet (Module 18)
  app.post('/wallets', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = CreateWalletSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid wallet configuration'));

    const walletId = generateId();
    // Production: call HSM/MPC key generation API to derive wallet address
    const mockAddress = `0x${Buffer.from(walletId.replace(/-/g, '')).toString('hex').slice(0, 40)}`;

    const wallet = {
      id: walletId,
      customerId: body.data.customerId,
      walletType: body.data.walletType,
      address: mockAddress,
      supportedAssets: body.data.supportedAssets,
      balances: body.data.supportedAssets.reduce((acc: any, asset: string) => ({ ...acc, [asset]: '0' }), {}),
      keyManagement: 'HSM_MPC',       // Multi-party computation key sharding
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    wallets.set(walletId, wallet);
    return reply.status(201).send(success(wallet));
  });

  // GET /v1/digital-assets/wallets/:walletId/balances  — On-chain balance (Module 18)
  app.get('/wallets/:walletId/balances', { preHandler: [requireAuth] }, async (request, reply) => {
    const { walletId } = request.params as { walletId: string };
    const wallet = wallets.get(walletId);
    if (!wallet) return reply.status(404).send(failure('NOT_FOUND', 'Wallet not found'));

    // Production: call DLT node RPC to fetch real on-chain balance
    return reply.send(success({
      walletId,
      address: wallet.address,
      walletType: wallet.walletType,
      balances: wallet.balances,
      lastUpdated: new Date().toISOString(),
      network: wallet.walletType === 'CBDC' ? 'mBridge' : 'ERC-20',
    }));
  });

  // POST /v1/digital-assets/wallets/transactions/transfer  — DLT transfer (Module 18)
  app.post('/wallets/transactions/transfer', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = TransferSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid transfer request', body.error.flatten()));

    const d = body.data;
    const wallet = wallets.get(d.fromWalletId);
    if (!wallet) return reply.status(404).send(failure('NOT_FOUND', 'Source wallet not found'));

    const currentBalance = new Decimal(wallet.balances[d.assetSymbol] || '0');
    const amount = new Decimal(d.amount);

    if (currentBalance.lt(amount)) {
      return reply.status(400).send(failure('INSUFFICIENT_BALANCE', `Insufficient ${d.assetSymbol} balance`));
    }

    // Travel Rule compliance screening before transfer
    if (d.travelRuleData) {
      // Production: call ComplyAdvantage / Notabene Travel Rule API
      const travelRuleStatus = 'COMPLIANT'; // Stub
      if (travelRuleStatus !== 'COMPLIANT') {
        return reply.status(403).send(failure('TRAVEL_RULE_BLOCKED', 'Transfer blocked by Travel Rule compliance check'));
      }
    }

    const txId = generateId();
    const txHash = `0x${Buffer.from(txId).toString('hex').slice(0, 64)}`;

    // Update in-memory balance
    wallet.balances[d.assetSymbol] = currentBalance.minus(amount).toFixed(8);

    const tx = {
      id: txId,
      txHash,
      fromWalletId: d.fromWalletId,
      fromAddress: wallet.address,
      toAddress: d.toAddress,
      assetSymbol: d.assetSymbol,
      amount: d.amount,
      status: 'CONFIRMED',           // Production: PENDING → CONFIRMED after block finalization
      blockNumber: Math.floor(Math.random() * 1000000),
      gasUsed: '21000',
      memo: d.memo,
      travelRuleData: d.travelRuleData,
      executedAt: new Date().toISOString(),
    };

    transactions.set(txId, tx);
    return reply.status(201).send(success(tx));
  });

  // POST /v1/digital-assets/tokenize  — Tokenize a real-world asset (Module 18)
  app.post('/tokenize', { preHandler: [requireAuth, requireRole('SUPER_ADMIN')] }, async (request, reply) => {
    const body = TokenizeSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid tokenization request'));

    const d = body.data;
    const tokenId = generateId();
    const contractAddress = `0x${Buffer.from(tokenId).toString('hex').slice(0, 40)}`;

    const token = {
      id: tokenId,
      contractAddress,
      ...d,
      totalSupply: d.totalSupply,
      circulatingSupply: '0',
      status: 'ISSUED',
      standard: 'ERC-1400',          // Security token standard
      issuedAt: new Date().toISOString(),
    };

    tokenizedAssets.set(tokenId, token);
    return reply.status(201).send(success(token));
  });

  // GET /v1/digital-assets/tokens  — List tokenized assets
  app.get('/tokens', { preHandler: [requireAuth] }, async (request, reply) => {
    const tokens = Array.from(tokenizedAssets.values());
    return reply.send(success(tokens));
  });

  // GET /v1/digital-assets/tokens/:tokenId
  app.get('/tokens/:tokenId', { preHandler: [requireAuth] }, async (request, reply) => {
    const { tokenId } = request.params as { tokenId: string };
    const token = tokenizedAssets.get(tokenId);
    if (!token) return reply.status(404).send(failure('NOT_FOUND', 'Token not found'));
    return reply.send(success(token));
  });

  // GET /v1/digital-assets/cbdc/mbridge/status  — mBridge multi-CBDC status
  app.get('/cbdc/mbridge/status', { preHandler: [requireAuth] }, async (_request, reply) => {
    return reply.send(success({
      network: 'mBridge',
      status: 'OPERATIONAL',
      participants: ['HKMA', 'PBoC', 'CBUAE', 'BOT'],
      supportedCurrencies: ['e-HKD', 'e-CNY', 'e-AED', 'e-THB'],
      settlementMode: 'PvP',          // Payment vs Payment atomic settlement
      lastBlockHeight: 1_234_567,
      averageSettlementTime: '3 seconds',
    }));
  });
}
