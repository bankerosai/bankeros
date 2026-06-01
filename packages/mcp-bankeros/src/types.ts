/**
 * Shared types for BankerOS MCP-style tools.
 * Each tool wraps a BankerOS service endpoint with: a Zod parameter schema,
 * a list of permitted roles, and a handler that calls the underlying service.
 * Tools are exposed to Claude via the Anthropic SDK's tool_use feature.
 */
import { z, ZodTypeAny } from 'zod';

export interface ToolContext {
  /** Original user JWT — forwarded transparently to downstream services */
  userJwt: string;
  /** Resolved user identity (from x-user-id header) */
  userId: string;
  /** Resolved role (from x-user-role header) */
  role: string;
  /** Correlation id for distributed tracing */
  correlationId: string;
  /** Base URL of the API gateway or the specific service */
  baseUrl: string;
}

export interface BankerTool<P extends ZodTypeAny = ZodTypeAny, R = unknown> {
  /** Stable identifier used as the tool name in the Anthropic API */
  name: string;
  /** Human-readable description shown to Claude */
  description: string;
  /** Zod schema for the tool's parameters */
  parameters: P;
  /** Roles permitted to invoke this tool */
  requiredRoles: string[];
  /** Implementation — receives validated params + context, returns a JSON-serialisable result */
  handler: (params: z.infer<P>, ctx: ToolContext) => Promise<R>;
}

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  CEO: 'CEO',
  EXECUTIVE: 'EXECUTIVE',
  CRO: 'CRO',
  CREDIT_OFFICER: 'CREDIT_OFFICER',
  RELATIONSHIP_MGR: 'RELATIONSHIP_MGR',
  COMPLIANCE_OFFICER: 'COMPLIANCE_OFFICER',
  RISK_ANALYST: 'RISK_ANALYST',
  AUDITOR: 'AUDITOR',
  TREASURY_SALES: 'TREASURY_SALES',
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];
