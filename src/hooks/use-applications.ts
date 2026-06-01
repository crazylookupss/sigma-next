"use client";

import { useQuery } from "@tanstack/react-query";
import { applicationService } from "@/services/applications";

export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: ({ signal }) => applicationService.getApplications(signal),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ["applications", id],
    queryFn: ({ signal }) => applicationService.getApplicationById(id, signal),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}

export function useServicePrincipals() {
  return useQuery({
    queryKey: ["service-principals"],
    queryFn: ({ signal }) => applicationService.getServicePrincipals(signal),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useServicePrincipal(id: string) {
  return useQuery({
    queryKey: ["service-principals", id],
    queryFn: ({ signal }) => applicationService.getServicePrincipalById(id, signal),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: false,
    enabled: !!id,
    retry: 1,
  });
}

export function useAppDashboard() {
  return useQuery({
    queryKey: ["service-principals", "dashboard"],
    queryFn: ({ signal }) => applicationService.getDashboard(signal),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useApplicationOwners(id: string) {
  return useQuery({
    queryKey: ["applications", id, "owners"],
    queryFn: ({ signal }) => applicationService.getOwners(id, signal),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}

export function useApplicationServicePrincipals(id: string) {
  return useQuery({
    queryKey: ["applications", id, "service-principals"],
    queryFn: ({ signal }) => applicationService.getLinkedServicePrincipals(id, signal),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}

export function useApplicationCredentialHealth(id: string) {
  return useQuery({
    queryKey: ["applications", id, "credentials"],
    queryFn: ({ signal }) => applicationService.getCredentialHealth(id, signal),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}

export function useApplicationPermissions(id: string) {
  return useQuery({
    queryKey: ["applications", id, "permissions"],
    queryFn: ({ signal }) => applicationService.getPermissions(id, signal),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}

export function useApplicationSignIns(id: string) {
  return useQuery({
    queryKey: ["applications", id, "signins"],
    queryFn: ({ signal }) => applicationService.getSignIns(id, signal),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}

export function useApplicationAuditLogs(id: string) {
  return useQuery({
    queryKey: ["applications", id, "audit-logs"],
    queryFn: ({ signal }) => applicationService.getAuditLogs(id, signal),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}

export function useApplicationManifest(id: string) {
  return useQuery({
    queryKey: ["applications", id, "manifest"],
    queryFn: ({ signal }) => applicationService.getManifest(id, signal),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}

export function useServicePrincipalOwners(id: string) {
  return useQuery({
    queryKey: ["service-principals", id, "owners"],
    queryFn: ({ signal }) => applicationService.getServicePrincipalOwners(id, signal),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}

export function useServicePrincipalAssignments(id: string) {
  return useQuery({
    queryKey: ["service-principals", id, "assignments"],
    queryFn: ({ signal }) => applicationService.getServicePrincipalAssignments(id, signal),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}

export function useServicePrincipalSsoConfig(id: string) {
  return useQuery({
    queryKey: ["service-principals", id, "sso-config"],
    queryFn: ({ signal }) => applicationService.getServicePrincipalSsoConfig(id, signal),
    staleTime: 30 * 1000,
    refetchInterval: 120 * 1000,
    refetchIntervalInBackground: false,
    enabled: !!id,
    retry: 1,
  });
}

export function useProtocolAnalysis(id: string) {
  return useQuery({
    queryKey: ["service-principals", id, "protocol-analysis"],
    queryFn: ({ signal }) => applicationService.getProtocolAnalysis(id, signal),
    staleTime: 2 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}

export function useProxyConfiguration(id: string) {
  return useQuery({
    queryKey: ["service-principals", id, "proxy-configuration"],
    queryFn: ({ signal }) => applicationService.getProxyConfiguration(id, signal),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}
