import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@bankeros/database';
import { signAccessToken, verifyAccessToken, requireAuth } from '@bankeros/shared-utils/src/auth';
import { success, failure, generateId } from '@bankeros/shared-utils';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  totpCode: z.string().length(6).optional(),
});

const RefreshSchema = z.object({
  refreshToken: z.string().uuid(),
});

export async function authRoutes(app: FastifyInstance) {
  // POST /v1/iam/auth/tokens  — Login & token issuance (OAuth 2.0 Password Grant)
  app.post('/auth/tokens', async (request, reply) => {
    const body = LoginSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid request body', body.error.flatten()));
    }

    const { email, password, totpCode } = body.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return reply.status(401).send(failure('INVALID_CREDENTIALS', 'Email or password is incorrect'));
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      await prisma.auditLog.create({
        data: {
          actorType: 'USER',
          action: 'LOGIN_FAILED',
          resource: 'USER',
          resourceId: user.id,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
          correlationId: request.id as string,
        },
      });
      return reply.status(401).send(failure('INVALID_CREDENTIALS', 'Email or password is incorrect'));
    }

    if (user.mfaEnabled) {
      if (!totpCode) {
        return reply.status(401).send(failure('MFA_REQUIRED', 'TOTP code is required'));
      }
      const speakeasy = await import('speakeasy');
      const valid = speakeasy.totp.verify({
        secret: user.mfaSecret!,
        encoding: 'base32',
        token: totpCode,
        window: 1,
      });
      if (!valid) {
        return reply.status(401).send(failure('MFA_INVALID', 'TOTP code is invalid or expired'));
      }
    }

    const accessToken = await signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      cifId: user.cifId ?? undefined,
    });

    const refreshTokenValue = generateId();
    const expiresAt = new Date(Date.now() + 86400 * 1000 * 7); // 7 days

    await prisma.refreshToken.create({
      data: { userId: user.id, token: refreshTokenValue, expiresAt },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        actorType: 'USER',
        action: 'LOGIN_SUCCESS',
        resource: 'USER',
        resourceId: user.id,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
        correlationId: request.id as string,
      },
    });

    return reply.send(success({
      tokenType: 'Bearer',
      accessToken,
      expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '3600'),
      refreshToken: refreshTokenValue,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        mfaEnabled: user.mfaEnabled,
      },
    }));
  });

  // POST /v1/iam/auth/refresh  — Refresh access token
  app.post('/auth/refresh', async (request, reply) => {
    const body = RefreshSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid refresh token format'));
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { token: body.data.refreshToken },
      include: { user: true },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date() || !stored.user.isActive) {
      return reply.status(401).send(failure('REFRESH_TOKEN_INVALID', 'Refresh token is invalid or expired'));
    }

    const accessToken = await signAccessToken({
      sub: stored.user.id,
      email: stored.user.email,
      role: stored.user.role,
      cifId: stored.user.cifId ?? undefined,
    });

    return reply.send(success({ tokenType: 'Bearer', accessToken, expiresIn: 3600 }));
  });

  // POST /v1/iam/auth/logout  — Revoke refresh token
  app.post('/auth/logout', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = RefreshSchema.safeParse(request.body);
    if (body.success) {
      await prisma.refreshToken.updateMany({
        where: { token: body.data.refreshToken },
        data: { revokedAt: new Date() },
      });
    }
    return reply.send(success({ message: 'Logged out successfully' }));
  });

  // GET /v1/iam/auth/me  — Current user profile
  app.get('/auth/me', { preHandler: [requireAuth] }, async (request, reply) => {
    const payload = (request as any).jwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, mfaEnabled: true, lastLoginAt: true, createdAt: true },
    });
    if (!user) return reply.status(404).send(failure('NOT_FOUND', 'User not found'));
    return reply.send(success(user));
  });

  // POST /v1/iam/auth/mfa/setup  — Initiate MFA enrollment
  app.post('/auth/mfa/setup', { preHandler: [requireAuth] }, async (request, reply) => {
    const payload = (request as any).jwtPayload;
    const speakeasy = await import('speakeasy');
    const qrcode = await import('qrcode');

    const secret = speakeasy.generateSecret({ name: `BankerOS (${payload.email})`, issuer: 'BankerOS' });
    await prisma.user.update({
      where: { id: payload.sub },
      data: { mfaSecret: secret.base32 },
    });

    const otpauthUrl = secret.otpauth_url!;
    const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);

    return reply.send(success({ secret: secret.base32, qrCode: qrCodeDataUrl }));
  });

  // POST /v1/iam/auth/mfa/verify  — Complete MFA enrollment
  app.post('/auth/mfa/verify', { preHandler: [requireAuth] }, async (request, reply) => {
    const { code } = request.body as { code: string };
    const payload = (request as any).jwtPayload;
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user?.mfaSecret) {
      return reply.status(400).send(failure('MFA_NOT_SETUP', 'MFA setup not initiated'));
    }

    const speakeasy = await import('speakeasy');
    const valid = speakeasy.totp.verify({ secret: user.mfaSecret, encoding: 'base32', token: code, window: 1 });

    if (!valid) return reply.status(400).send(failure('MFA_INVALID', 'TOTP code is incorrect'));

    await prisma.user.update({ where: { id: payload.sub }, data: { mfaEnabled: true } });
    return reply.send(success({ message: 'MFA enabled successfully' }));
  });
}
