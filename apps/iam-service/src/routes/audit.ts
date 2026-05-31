import { FastifyInstance } from 'fastify';
import { prisma } from '@bankeros/database';
import { requireAuth, requireRole } from '@bankeros/shared-utils/src/auth';
import { success, paginate } from '@bankeros/shared-utils';

export async function auditRoutes(app: FastifyInstance) {
  // GET /v1/audit/logs  — Immutable audit trail query (Module 10)
  app.get('/audit/logs', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'AUDITOR', 'COMPLIANCE_OFFICER')] }, async (request, reply) => {
    const {
      page = 1,
      pageSize = 50,
      actorId,
      resource,
      resourceId,
      action,
      from,
      to,
    } = request.query as {
      page?: number; pageSize?: number;
      actorId?: string; resource?: string; resourceId?: string;
      action?: string; from?: string; to?: string;
    };

    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};
    if (actorId) where.actorId = actorId;
    if (resource) where.resource = resource;
    if (resourceId) where.resourceId = resourceId;
    if (action) where.action = action;
    if (from || to) {
      where.occurredAt = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      };
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({ where, skip, take: pageSize, orderBy: { occurredAt: 'desc' } }),
      prisma.auditLog.count({ where }),
    ]);

    return reply.send(paginate(logs, total, page, pageSize));
  });
}
