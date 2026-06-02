import { getSession } from "next-auth/react";

const DEFAULT_API_BASE = "/api/v1/entra";

// ---------------------------------------------------------------------------
// Session cache — avoids a fetch to /api/auth/session on every API call.
// TTL 30s balances freshness vs. round-trip cost.
// ---------------------------------------------------------------------------
let cachedSession: Awaited<ReturnType<typeof getSession>> | null = null;
let sessionExpiresAt = 0;
const SESSION_CACHE_TTL_MS = 30_000;

async function getCachedSession() {
  const now = Date.now();
  if (cachedSession && now < sessionExpiresAt) return cachedSession;
  cachedSession = await getSession();
  sessionExpiresAt = now + SESSION_CACHE_TTL_MS;
  return cachedSession;
}

export class ApiRequestError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit & { basePath?: string }
): Promise<T> {
  const base = options?.basePath ?? DEFAULT_API_BASE;
  const url = `${base}${endpoint}`;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { basePath: _, ...fetchOptions } = options ?? {};

  const session = await getCachedSession();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string> ?? {}),
  };

  // If user is authenticated, inject their Bearer token to authorize C# Graph requests
  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  const res = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new ApiRequestError(res.status, text);
  }

  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}
