import { FastifyRequest, FastifyReply } from 'fastify';
import { SignJWT, jwtVerify } from 'jose';
import { failure } from './index';

export interface JwtPayload {
  sub: string;        // userId
  email: string;
  role: string;
  cifId?: string;
  iat: number;
  exp: number;
}

const getSecret = (): Uint8Array => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return new TextEncoder().encode(secret);
};

export async function signAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
  const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || '3600');
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${expiresIn}s`)
    .sign(getSecret());
}

export async function verifyAccessToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as JwtPayload;
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const header = request.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    reply.status(401).send(failure('UNAUTHORIZED', 'Missing or invalid authorization header'));
    return;
  }

  try {
    const token = header.slice(7);
    const payload = await verifyAccessToken(token);
    (request as any).jwtPayload = payload;
  } catch {
    reply.status(401).send(failure('TOKEN_INVALID', 'Access token is invalid or expired'));
  }
}

export function requireRole(...roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const payload = (request as any).jwtPayload as JwtPayload;
    if (!payload || !roles.includes(payload.role)) {
      reply.status(403).send(failure('FORBIDDEN', `Required role: ${roles.join(' or ')}`));
    }
  };
}
