import { getSession } from "next-auth/react";

const API_BASE = "/api/v1/entra";

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
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  // Extract active NextAuth session containing the Entra ID access token
  const session = await getSession();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> ?? {}),
  };

  // If user is authenticated, inject their Bearer token to authorize C# Graph requests
  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new ApiRequestError(res.status, text);
  }

  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}
