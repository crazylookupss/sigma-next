import { fetchApi } from "./api-client";
import type { PagedResponse } from "@/types/common";
import type {
  EntraApplication,
  EntraServicePrincipal,
  AppStatistics,
  Credential,
  AppOwnerDto,
  ServicePrincipalReferenceDto,
  AppCredentialHealth,
  RequiredResourceAccessDto,
  SignInEntryDto,
  AuditLogEntryDto,
  EntraAppAssignment,
  EntraAppOwner,
  ServicePrincipalSsoConfig,
  ProtocolAnalysisResult,
  ServicePrincipalProxyConfig,
} from "@/types/application";

interface DashboardStatusStat {
  status: string;
  count: number;
}

interface DashboardSignInHistory {
  date: string;
  count: number;
}

interface DashboardResponse {
  totalApplications: number;
  activeCount: number;
  warningCount: number;
  errorCount: number;
  statusStats: DashboardStatusStat[];
  signInsHistory: DashboardSignInHistory[];
}

export const applicationService = {
  getApplications: (signal?: AbortSignal) =>
    fetchApi<PagedResponse<EntraApplication>>("/applications", { signal }),

  getApplicationById: (id: string, signal?: AbortSignal) =>
    fetchApi<EntraApplication>(`/applications/${id}`, { signal }),

  getServicePrincipals: (signal?: AbortSignal) =>
    fetchApi<PagedResponse<EntraServicePrincipal>>("/service-principals", { signal }),

  getServicePrincipalById: (id: string, signal?: AbortSignal) =>
    fetchApi<EntraServicePrincipal>(`/service-principals/${id}`, { signal }),

  getDashboard: async (signal?: AbortSignal): Promise<AppStatistics> => {
    const res = await fetchApi<DashboardResponse>("/service-principals/dashboard", { signal });
    return {
      totalApps: res.totalApplications ?? 0,
      activeCount: res.activeCount ?? 0,
      warningCount: res.warningCount ?? 0,
      expiredCount: res.errorCount ?? 0,
      healthDistribution: (res.statusStats ?? []).map((s: DashboardStatusStat) => ({
        name: s.status,
        value: s.count,
        color: s.status === "Active" ? "#10b981" : s.status === "Warning" ? "#f59e0b" : "#ef4444",
      })),
      signInTrend: (res.signInsHistory ?? []).map((s: DashboardSignInHistory) => ({
        date: s.date,
        count: s.count,
      })),
    };
  },

  getCredentials: (id: string, signal?: AbortSignal) =>
    fetchApi<Credential[]>(`/applications/${id}/credentials`, { signal }),

  // Enriched App Registration detail API endpoints
  getOwners: (id: string, signal?: AbortSignal) =>
    fetchApi<AppOwnerDto[]>(`/applications/${id}/owners`, { signal }),

  getLinkedServicePrincipals: (id: string, signal?: AbortSignal) =>
    fetchApi<ServicePrincipalReferenceDto[]>(`/applications/${id}/service-principals`, { signal }),

  getCredentialHealth: (id: string, signal?: AbortSignal) =>
    fetchApi<AppCredentialHealth>(`/applications/${id}/credentials`, { signal }),

  getPermissions: (id: string, signal?: AbortSignal) =>
    fetchApi<RequiredResourceAccessDto[]>(`/applications/${id}/permissions`, { signal }),

  getSignIns: (id: string, signal?: AbortSignal) =>
    fetchApi<SignInEntryDto[]>(`/applications/${id}/signins`, { signal }),

  getAuditLogs: (id: string, signal?: AbortSignal) =>
    fetchApi<AuditLogEntryDto[]>(`/applications/${id}/audit-logs`, { signal }),

  getManifest: (id: string, signal?: AbortSignal) =>
    fetchApi<Record<string, unknown>>(`/applications/${id}/manifest`, { signal }),

  // Service Principal details endpoints
  getServicePrincipalOwners: (id: string, signal?: AbortSignal) =>
    fetchApi<EntraAppOwner[]>(`/service-principals/${id}/owners`, { signal }),

  getServicePrincipalAssignments: (id: string, signal?: AbortSignal) =>
    fetchApi<EntraAppAssignment[]>(`/service-principals/${id}/assignments`, { signal }),

  getServicePrincipalSsoConfig: (id: string, signal?: AbortSignal) =>
    fetchApi<ServicePrincipalSsoConfig>(`/service-principals/${id}/sso-config`, { signal }),

  // Protocol Analysis
  getProtocolAnalysis: (id: string, signal?: AbortSignal) =>
    fetchApi<ProtocolAnalysisResult>(`/service-principals/${id}/protocol-analysis`, { signal }),

  // Proxy Configuration
  getProxyConfiguration: (id: string, signal?: AbortSignal) =>
    fetchApi<ServicePrincipalProxyConfig>(`/service-principals/${id}/proxy-configuration`, { signal }),
};
