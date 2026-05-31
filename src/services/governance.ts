import { getSession } from "next-auth/react";
import type { GovernanceFindingsResponse, GovernanceSummary } from "@/types/governance";

const GOVERNANCE_BASE = "/api/v1";

async function fetchGovernance<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
  const url = `${GOVERNANCE_BASE}${endpoint}`;
  const session = await getSession();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  const res = await fetch(url, { headers, signal });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Governance API error ${res.status}: ${text}`);
  }

  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}

export const governanceService = {
  getFindings: (forceOrSignal?: boolean | AbortSignal, signal?: AbortSignal) => {
    const force = typeof forceOrSignal === "boolean" ? forceOrSignal : false;
    const actualSignal = forceOrSignal instanceof AbortSignal ? forceOrSignal : signal;
    return fetchGovernance<GovernanceFindingsResponse>(`/governance/findings${force ? "?force=true" : ""}`, actualSignal);
  },
 
  getSummary: (forceOrSignal?: boolean | AbortSignal, signal?: AbortSignal) => {
    const force = typeof forceOrSignal === "boolean" ? forceOrSignal : false;
    const actualSignal = forceOrSignal instanceof AbortSignal ? forceOrSignal : signal;
    return fetchGovernance<GovernanceSummary>(`/governance/findings/summary${force ? "?force=true" : ""}`, actualSignal);
  },

  getFindingsByCategory: (category: string, signal?: AbortSignal) =>
    fetchGovernance<GovernanceFindingsResponse>(`/governance/findings/category/${category}`, signal),

  getFindingsBySeverity: (severity: string, signal?: AbortSignal) =>
    fetchGovernance<GovernanceFindingsResponse>(`/governance/findings/severity/${severity}`, signal),
};
