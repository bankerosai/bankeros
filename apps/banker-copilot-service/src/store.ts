/**
 * Persistence adapter — abstracts CopilotSession / CopilotMessage / CopilotArtefact
 * storage so the service runs in three modes:
 *
 *   COPILOT_PERSISTENCE=db       Always use Prisma. Crash on connect error.
 *   COPILOT_PERSISTENCE=memory   Process-local Map; resets when service restarts.
 *   COPILOT_PERSISTENCE=auto     Try Prisma; fall back to memory if unreachable.
 *                                (default — friendly for first-time setup)
 *
 * Memory mode is fine for first-touch demo + the per-process lifetime of a
 * single user playing with the chat. It is NOT durable, audit-compliant, or
 * multi-instance safe. Switch to `db` for any real deployment.
 */
import { randomUUID } from 'node:crypto';
import { prisma } from '@bankeros/database';

export type MessageRole = 'USER' | 'ASSISTANT' | 'TOOL' | 'SYSTEM';
export type ArtefactStatus = 'DRAFT' | 'REVIEWED' | 'APPROVED' | 'DISCARDED';

export interface StoredMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  toolCalls?: unknown;
  tokens: number;
  createdAt: Date;
}

export interface StoredSession {
  id: string;
  userId: string;
  startedAt: Date;
  endedAt?: Date | null;
  totalTokens: number;
  totalCost: number;
}

export interface StoredArtefact {
  id: string;
  sessionId: string;
  skill: string;
  subject: string;
  content: string;
  status: ArtefactStatus;
  createdAt: Date;
}

export interface SessionStore {
  readonly mode: 'db' | 'memory';
  createSession(userId: string): Promise<StoredSession>;
  getSession(id: string): Promise<StoredSession | null>;
  appendMessage(input: Omit<StoredMessage, 'id' | 'createdAt'>): Promise<StoredMessage>;
  listMessages(sessionId: string, limit?: number): Promise<StoredMessage[]>;
  createArtefact(
    input: Omit<StoredArtefact, 'id' | 'createdAt' | 'status'>,
  ): Promise<StoredArtefact>;
  getArtefact(id: string): Promise<StoredArtefact | null>;
  bumpSessionUsage(id: string, addTokens: number, addCostUsd: number): Promise<void>;
  /** Returns true if connectivity check passed. */
  health(): Promise<boolean>;
}

// ---------- Prisma backend ----------
class PrismaStore implements SessionStore {
  readonly mode = 'db' as const;

  async createSession(userId: string) {
    const s = await prisma.copilotSession.create({ data: { userId } });
    return { ...s, totalCost: Number(s.totalCost) };
  }

  async getSession(id: string) {
    const s = await prisma.copilotSession.findUnique({ where: { id } });
    return s ? { ...s, totalCost: Number(s.totalCost) } : null;
  }

  async appendMessage(input: Omit<StoredMessage, 'id' | 'createdAt'>) {
    return prisma.copilotMessage.create({
      data: {
        sessionId: input.sessionId,
        role: input.role,
        content: input.content,
        toolCalls: input.toolCalls as any,
        tokens: input.tokens,
      },
    }) as Promise<StoredMessage>;
  }

  async listMessages(sessionId: string, limit = 40) {
    return prisma.copilotMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: limit,
    }) as Promise<StoredMessage[]>;
  }

  async createArtefact(input: Omit<StoredArtefact, 'id' | 'createdAt' | 'status'>) {
    const a = await prisma.copilotArtefact.create({
      data: {
        sessionId: input.sessionId,
        skill: input.skill,
        subject: input.subject,
        content: input.content,
        status: 'DRAFT',
      },
    });
    return a as StoredArtefact;
  }

  async getArtefact(id: string) {
    return prisma.copilotArtefact.findUnique({ where: { id } }) as Promise<StoredArtefact | null>;
  }

  async bumpSessionUsage(id: string, addTokens: number, addCostUsd: number) {
    await prisma.copilotSession.update({
      where: { id },
      data: {
        totalTokens: { increment: addTokens },
        totalCost: { increment: addCostUsd },
      },
    });
  }

  async health() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}

// ---------- In-memory backend ----------
class MemoryStore implements SessionStore {
  readonly mode = 'memory' as const;
  private sessions = new Map<string, StoredSession>();
  private messages = new Map<string, StoredMessage[]>();
  private artefacts = new Map<string, StoredArtefact>();

  async createSession(userId: string) {
    const s: StoredSession = {
      id: randomUUID(),
      userId,
      startedAt: new Date(),
      endedAt: null,
      totalTokens: 0,
      totalCost: 0,
    };
    this.sessions.set(s.id, s);
    this.messages.set(s.id, []);
    return s;
  }

  async getSession(id: string) {
    return this.sessions.get(id) ?? null;
  }

  async appendMessage(input: Omit<StoredMessage, 'id' | 'createdAt'>) {
    const m: StoredMessage = { id: randomUUID(), createdAt: new Date(), ...input };
    const list = this.messages.get(input.sessionId) ?? [];
    list.push(m);
    this.messages.set(input.sessionId, list);
    return m;
  }

  async listMessages(sessionId: string, limit = 40) {
    const list = this.messages.get(sessionId) ?? [];
    return list.slice(-limit);
  }

  async createArtefact(input: Omit<StoredArtefact, 'id' | 'createdAt' | 'status'>) {
    const a: StoredArtefact = {
      id: randomUUID(),
      createdAt: new Date(),
      status: 'DRAFT',
      ...input,
    };
    this.artefacts.set(a.id, a);
    return a;
  }

  async getArtefact(id: string) {
    return this.artefacts.get(id) ?? null;
  }

  async bumpSessionUsage(id: string, addTokens: number, addCostUsd: number) {
    const s = this.sessions.get(id);
    if (s) {
      s.totalTokens += addTokens;
      s.totalCost += addCostUsd;
    }
  }

  async health() {
    return true;
  }
}

// ---------- Factory ----------
let cached: SessionStore | null = null;

export async function getStore(): Promise<SessionStore> {
  if (cached) return cached;
  const mode = (process.env.COPILOT_PERSISTENCE ?? 'auto').toLowerCase();
  if (mode === 'memory') {
    cached = new MemoryStore();
    console.log('[copilot] persistence=memory (sessions reset on restart)');
    return cached;
  }
  if (mode === 'db') {
    cached = new PrismaStore();
    if (!(await cached.health())) {
      throw new Error(
        'COPILOT_PERSISTENCE=db but Postgres is unreachable. Start Postgres, run db:generate + db:migrate, or use COPILOT_PERSISTENCE=memory.',
      );
    }
    console.log('[copilot] persistence=db (Prisma)');
    return cached;
  }
  // auto
  const prismaStore = new PrismaStore();
  if (await prismaStore.health()) {
    cached = prismaStore;
    console.log('[copilot] persistence=db (Prisma, auto-detected)');
    return cached;
  }
  cached = new MemoryStore();
  console.warn(
    '[copilot] persistence=memory (auto-detected — Postgres unreachable; sessions will reset on restart)',
  );
  return cached;
}
