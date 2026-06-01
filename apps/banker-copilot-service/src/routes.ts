import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@bankeros/database';
import { failure, success } from '@bankeros/shared-utils';
import { ALL_TOOLS, filterToolsForRole } from '@bankeros/mcp-bankeros';
import { loadSkills, loadCommands } from './skill-loader';
import { runTurn } from './copilot';

const CreateSessionSchema = z.object({
  /** Optional first message to immediately drive a turn */
  firstMessage: z.string().optional(),
  pageContext: z
    .object({
      pathname: z.string(),
      refs: z.record(z.string()).optional(),
    })
    .optional(),
});

const SendMessageSchema = z.object({
  content: z.string().min(1),
  pageContext: z
    .object({
      pathname: z.string(),
      refs: z.record(z.string()).optional(),
    })
    .optional(),
});

function getUser(req: any): { userId: string; role: string; jwt: string } | null {
  const userId = req.headers['x-user-id'];
  const role = req.headers['x-user-role'];
  const auth = req.headers['authorization'];
  if (!userId || !role || typeof userId !== 'string' || typeof role !== 'string') {
    return null;
  }
  const jwt = typeof auth === 'string' && auth.startsWith('Bearer ')
    ? auth.slice(7)
    : '';
  return { userId, role, jwt };
}

export async function copilotRoutes(app: FastifyInstance) {
  // Cache skills + commands at boot — small files, no need to re-read per request
  const skills = await loadSkills();
  const commands = await loadCommands();
  app.log.info(
    { skills: skills.length, commands: commands.length },
    'Banker Copilot skills + commands loaded',
  );

  /** List skills + commands available to the caller */
  app.get('/skills', async (req, reply) => {
    const u = getUser(req);
    if (!u) return reply.status(401).send(failure('UNAUTHORIZED', 'Missing user context'));
    const tools = filterToolsForRole(ALL_TOOLS, u.role).map((t) => ({
      name: t.name,
      description: t.description,
    }));
    return success({
      skills: skills.map((s) => ({ name: s.name, description: s.description })),
      commands: commands.map((c) => ({ name: c.name })),
      tools,
      callerRole: u.role,
    });
  });

  /** Open a new chat session */
  app.post('/sessions', async (req, reply) => {
    const u = getUser(req);
    if (!u) return reply.status(401).send(failure('UNAUTHORIZED', 'Missing user context'));
    const body = CreateSessionSchema.safeParse(req.body);
    if (!body.success) {
      return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid body', body.error.flatten()));
    }
    const session = await prisma.copilotSession.create({
      data: { userId: u.userId },
    });

    if (body.data.firstMessage) {
      const result = await runTurn({
        sessionId: session.id,
        userMessage: body.data.firstMessage,
        promptCtx: {
          userId: u.userId,
          role: u.role,
          pageContext: body.data.pageContext,
        },
        toolCtx: {
          userJwt: u.jwt,
          correlationId: req.id,
          baseUrl: process.env.BANKEROS_API_BASE || 'http://api-gateway:3000',
        },
        skills,
        commands,
      });
      return success({ session, result });
    }
    return success({ session });
  });

  /** Send a message in an existing session */
  app.post('/sessions/:id/messages', async (req, reply) => {
    const u = getUser(req);
    if (!u) return reply.status(401).send(failure('UNAUTHORIZED', 'Missing user context'));
    const { id } = req.params as { id: string };
    const session = await prisma.copilotSession.findUnique({ where: { id } });
    if (!session) return reply.status(404).send(failure('NOT_FOUND', 'Session not found'));
    if (session.userId !== u.userId) {
      return reply.status(403).send(failure('FORBIDDEN', 'Session belongs to another user'));
    }
    const body = SendMessageSchema.safeParse(req.body);
    if (!body.success) {
      return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid body', body.error.flatten()));
    }
    const result = await runTurn({
      sessionId: id,
      userMessage: body.data.content,
      promptCtx: {
        userId: u.userId,
        role: u.role,
        pageContext: body.data.pageContext,
      },
      toolCtx: {
        userJwt: u.jwt,
        correlationId: req.id,
        baseUrl: process.env.BANKEROS_API_BASE || 'http://api-gateway:3000',
      },
      skills,
      commands,
    });
    return success(result);
  });

  /** Read a session with its messages (for history view) */
  app.get('/sessions/:id', async (req, reply) => {
    const u = getUser(req);
    if (!u) return reply.status(401).send(failure('UNAUTHORIZED', 'Missing user context'));
    const { id } = req.params as { id: string };
    const session = await prisma.copilotSession.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        artefacts: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!session) return reply.status(404).send(failure('NOT_FOUND', 'Session not found'));
    if (session.userId !== u.userId) {
      return reply.status(403).send(failure('FORBIDDEN', 'Session belongs to another user'));
    }
    return success(session);
  });

  /** Read a single artefact (IC memo / KYC opinion / etc.) */
  app.get('/artefacts/:id', async (req, reply) => {
    const u = getUser(req);
    if (!u) return reply.status(401).send(failure('UNAUTHORIZED', 'Missing user context'));
    const { id } = req.params as { id: string };
    const a = await prisma.copilotArtefact.findUnique({
      where: { id },
      include: { session: true },
    });
    if (!a) return reply.status(404).send(failure('NOT_FOUND', 'Artefact not found'));
    if (a.session.userId !== u.userId) {
      // Allow EXECUTIVE/AUDITOR/CRO to read across users
      const cross = ['EXECUTIVE', 'AUDITOR', 'CRO', 'SUPER_ADMIN'];
      if (!cross.includes(u.role)) {
        return reply.status(403).send(failure('FORBIDDEN', 'Artefact belongs to another user'));
      }
    }
    return success(a);
  });
}
