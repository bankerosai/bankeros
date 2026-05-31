import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@bankeros/database';
import { requireAuth, requireRole } from '@bankeros/shared-utils/src/auth';
import { success, failure, paginate } from '@bankeros/shared-utils';

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12),
  role: z.enum(['SUPER_ADMIN','COMPLIANCE_OFFICER','LOAN_OFFICER','TELLER','CUSTOMER_SERVICE','AUDITOR','API_SERVICE']),
  cifId: z.string().uuid().optional(),
});

export async function userRoutes(app: FastifyInstance) {
  // GET /v1/iam/users
  app.get('/users', { preHandler: [requireAuth, requireRole('SUPER_ADMIN')] }, async (request, reply) => {
    const { page = 1, pageSize = 20 } = request.query as { page?: number; pageSize?: number };
    const skip = (page - 1) * pageSize;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip, take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, role: true, isActive: true, mfaEnabled: true, lastLoginAt: true, createdAt: true },
      }),
      prisma.user.count(),
    ]);

    return reply.send(paginate(users, total, page, pageSize));
  });

  // POST /v1/iam/users
  app.post('/users', { preHandler: [requireAuth, requireRole('SUPER_ADMIN')] }, async (request, reply) => {
    const body = CreateUserSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid user data', body.error.flatten()));

    const { email, password, role, cifId } = body.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return reply.status(409).send(failure('EMAIL_IN_USE', 'A user with this email already exists'));

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, role, cifId },
      select: { id: true, email: true, role: true, isActive: true, createdAt: true },
    });

    return reply.status(201).send(success(user));
  });

  // PATCH /v1/iam/users/:userId/status
  app.patch('/users/:userId/status', { preHandler: [requireAuth, requireRole('SUPER_ADMIN')] }, async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const { isActive } = request.body as { isActive: boolean };

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: { id: true, email: true, isActive: true },
    });

    return reply.send(success(user));
  });
}
