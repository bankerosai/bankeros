/**
 * Tiny HTTP helper for tool handlers — forwards the user's JWT and
 * correlation id so downstream services see the original caller.
 */
import { ToolContext } from './types';

export class BankerosToolError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'BankerosToolError';
  }
}

export async function bankerosGet<T = unknown>(
  path: string,
  ctx: ToolContext,
): Promise<T> {
  const url = `${ctx.baseUrl}${path}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${ctx.userJwt}`,
      'x-user-id': ctx.userId,
      'x-user-role': ctx.role,
      'x-correlation-id': ctx.correlationId,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    let body: unknown = undefined;
    try {
      body = await res.json();
    } catch {
      /* non-json error response */
    }
    throw new BankerosToolError(
      res.status,
      `HTTP_${res.status}`,
      `BankerOS API ${path} responded ${res.status}`,
      body,
    );
  }

  return (await res.json()) as T;
}
