/**
 * IAM Service integration test.
 * Spins up the Fastify app with mocked Prisma and validates the auth flow.
 */

import bcrypt from 'bcryptjs';

jest.mock('@bankeros/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      create: jest.fn().mockResolvedValue({}),
      findUnique: jest.fn(),
      updateMany: jest.fn(),
    },
    auditLog: {
      create: jest.fn().mockResolvedValue({}),
    },
  },
}));

import Fastify from 'fastify';
import { prisma } from '@bankeros/database';
import { authRoutes } from '../routes/auth';

const mockedPrisma = prisma as any;

beforeAll(() => { process.env.JWT_SECRET = 'test-secret-for-jest-only'; });

function buildApp() {
  const app = Fastify({ logger: false });
  app.register(authRoutes, { prefix: '/v1/iam' });
  return app;
}

describe('POST /v1/iam/auth/tokens', () => {
  let app: ReturnType<typeof buildApp>;

  beforeEach(() => { app = buildApp(); });
  afterEach(async () => { await app.close(); jest.clearAllMocks(); });

  test('returns 422 on invalid email', async () => {
    const res = await app.inject({
      method: 'POST', url: '/v1/iam/auth/tokens',
      payload: { email: 'not-an-email', password: 'whatever123' },
    });
    expect(res.statusCode).toBe(422);
    const body = res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  test('returns 401 when user does not exist', async () => {
    mockedPrisma.user.findUnique.mockResolvedValueOnce(null);

    const res = await app.inject({
      method: 'POST', url: '/v1/iam/auth/tokens',
      payload: { email: 'ghost@bankeros.io', password: 'NotReal123' },
    });
    expect(res.statusCode).toBe(401);
    expect(res.json().error.code).toBe('INVALID_CREDENTIALS');
  });

  test('returns 401 on wrong password', async () => {
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'u1', email: 'admin@bankeros.io',
      passwordHash: await bcrypt.hash('CorrectPassword123', 4),
      role: 'SUPER_ADMIN', isActive: true, mfaEnabled: false,
    });

    const res = await app.inject({
      method: 'POST', url: '/v1/iam/auth/tokens',
      payload: { email: 'admin@bankeros.io', password: 'WrongPassword999' },
    });
    expect(res.statusCode).toBe(401);
    expect(res.json().error.code).toBe('INVALID_CREDENTIALS');
  });

  test('returns access token on valid credentials', async () => {
    const hash = await bcrypt.hash('CorrectPassword123', 4);
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'u1', email: 'admin@bankeros.io', passwordHash: hash,
      role: 'SUPER_ADMIN', isActive: true, mfaEnabled: false,
    });
    mockedPrisma.user.update.mockResolvedValueOnce({});

    const res = await app.inject({
      method: 'POST', url: '/v1/iam/auth/tokens',
      payload: { email: 'admin@bankeros.io', password: 'CorrectPassword123' },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.success).toBe(true);
    expect(body.data.accessToken).toMatch(/^eyJ/);  // JWT prefix
    expect(body.data.tokenType).toBe('Bearer');
    expect(body.data.user.role).toBe('SUPER_ADMIN');
  });

  test('returns 401 for inactive user', async () => {
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'u2', email: 'inactive@bankeros.io',
      passwordHash: await bcrypt.hash('whatever', 4),
      role: 'TELLER', isActive: false, mfaEnabled: false,
    });

    const res = await app.inject({
      method: 'POST', url: '/v1/iam/auth/tokens',
      payload: { email: 'inactive@bankeros.io', password: 'whatever' },
    });
    expect(res.statusCode).toBe(401);
  });

  test('requires TOTP when MFA enabled', async () => {
    mockedPrisma.user.findUnique.mockResolvedValueOnce({
      id: 'u3', email: 'mfa@bankeros.io',
      passwordHash: await bcrypt.hash('MfaPass123', 4),
      role: 'SUPER_ADMIN', isActive: true, mfaEnabled: true, mfaSecret: 'SECRET',
    });

    const res = await app.inject({
      method: 'POST', url: '/v1/iam/auth/tokens',
      payload: { email: 'mfa@bankeros.io', password: 'MfaPass123' },
    });
    expect(res.statusCode).toBe(401);
    expect(res.json().error.code).toBe('MFA_REQUIRED');
  });
});

describe('POST /v1/iam/auth/refresh', () => {
  let app: ReturnType<typeof buildApp>;
  beforeEach(() => { app = buildApp(); });
  afterEach(async () => { await app.close(); jest.clearAllMocks(); });

  test('rejects unknown refresh token', async () => {
    mockedPrisma.refreshToken.findUnique.mockResolvedValueOnce(null);

    const res = await app.inject({
      method: 'POST', url: '/v1/iam/auth/refresh',
      payload: { refreshToken: '00000000-0000-0000-0000-000000000000' },
    });
    expect(res.statusCode).toBe(401);
    expect(res.json().error.code).toBe('REFRESH_TOKEN_INVALID');
  });

  test('rejects expired refresh token', async () => {
    mockedPrisma.refreshToken.findUnique.mockResolvedValueOnce({
      id: 'rt1', token: 'expired-token',
      expiresAt: new Date(Date.now() - 1000),
      revokedAt: null,
      user: { id: 'u1', email: 'a@b.c', role: 'TELLER', isActive: true },
    });

    const res = await app.inject({
      method: 'POST', url: '/v1/iam/auth/refresh',
      payload: { refreshToken: '11111111-1111-1111-1111-111111111111' },
    });
    expect(res.statusCode).toBe(401);
  });
});
