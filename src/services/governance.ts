import { fetchApi } from "./api-client";
import type { GovernanceFindingsResponse, GovernanceSummary } from "@/types/governance";

const GOVERNANCE_BASE = "/api/v1";

export const governanceService = {
  getFindings: (forceOrSignal?: boolean | AbortSignal, signal?: AbortSignal) => {
    const force = typeof forceOrSignal === "boolean" ? forceOrSignal : false;
    const actualSignal = forceOrSignal instanceof AbortSignal ? forceOrSignal : signal;
    return fetchApi<GovernanceFindingsResponse>(
      `/governance/findings${force ? "?force=true" : ""}`,
      { basePath: GOVERNANCE_BASE, signal: actualSignal }
    );
  },

  getSummary: (forceOrSignal?: boolean | AbortSignal, signal?: AbortSignal) => {
    const force = typeof forceOrSignal === "boolean" ? forceOrSignal : false;
    const actualSignal = forceOrSignal instanceof AbortSignal ? forceOrSignal : signal;
    return fetchApi<GovernanceSummary>(
      `/governance/findings/summary${force ? "?force=true" : ""}`,
      { basePath: GOVERNANCE_BASE, signal: actualSignal }
    );
  },

  getFindingsByCategory: (category: string, signal?: AbortSignal) =>
    fetchApi<GovernanceFindingsResponse>(`/governance/findings/category/${category}`, {
      basePath: GOVERNANCE_BASE,
      signal,
    }),

  getFindingsBySeverity: (severity: string, signal?: AbortSignal) =>
    fetchApi<GovernanceFindingsResponse>(`/governance/findings/severity/${severity}`, {
      basePath: GOVERNANCE_BASE,
      signal,
    }),
};
