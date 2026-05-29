"use client";

import { useQuery } from "@tanstack/react-query";
import { groupService } from "@/services/groups";
import type {
  GroupMember,
  GroupOwner,
  GroupApplication,
  GroupDevice,
  GroupAuditLog,
  GroupAccessReview,
} from "@/types/group";

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: ({ signal }) => groupService.getGroups(signal),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useGroup(id: string) {
  return useQuery({
    queryKey: ["groups", id],
    queryFn: ({ signal }) => groupService.getGroupById(id, signal),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}

export function useGroupMembers(id: string) {
  return useQuery({
    queryKey: ["groups", id, "members"],
    queryFn: async ({ signal }) => {
      const res = await groupService.getGroupMembers(id, signal);
      // API returns PagedResponse<T>; extract the inner data array
      return (res?.data ?? []) as GroupMember[];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}

export function useGroupOwners(id: string) {
  return useQuery({
    queryKey: ["groups", id, "owners"],
    queryFn: async ({ signal }) => {
      const res = await groupService.getGroupOwners(id, signal);
      return (res?.data ?? []) as GroupOwner[];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}

export function useGroupApplications(id: string) {
  return useQuery({
    queryKey: ["groups", id, "applications"],
    queryFn: async ({ signal }) => {
      const res = await groupService.getGroupApplications(id, signal);
      return (res?.data ?? []) as GroupApplication[];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}

export function useGroupDevices(id: string) {
  return useQuery({
    queryKey: ["groups", id, "devices"],
    queryFn: async ({ signal }) => {
      const res = await groupService.getGroupDevices(id, signal);
      return (res?.data ?? []) as GroupDevice[];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}

export function useGroupAuditLogs(id: string, top: number = 50) {
  return useQuery({
    queryKey: ["groups", id, "audit-logs", top],
    queryFn: async ({ signal }) => {
      const res = await groupService.getGroupAuditLogs(id, top, signal);
      return (res?.data ?? []) as GroupAuditLog[];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}

export function useGroupAccessReviews(id: string) {
  return useQuery({
    queryKey: ["groups", id, "access-reviews"],
    queryFn: async ({ signal }) => {
      const res = await groupService.getGroupAccessReviews(id, signal);
      return (res?.data ?? []) as GroupAccessReview[];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}
