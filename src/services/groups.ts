import { fetchApi } from "./api-client";
import type { PagedResponse } from "@/types/common";
import type {
  EntraGroup,
  GroupMember,
  GroupOwner,
  GroupApplication,
  GroupDevice,
  GroupAuditLog,
  GroupAccessReview,
} from "@/types/group";

export const groupService = {
  getGroups: (signal?: AbortSignal) =>
    fetchApi<PagedResponse<EntraGroup>>("/groups", { signal }),

  getGroupById: (id: string, signal?: AbortSignal) =>
    fetchApi<EntraGroup>(`/groups/${id}`, { signal }),

  // Sub-resources all return PagedResponse<T> from the API
  getGroupMembers: (id: string, signal?: AbortSignal) =>
    fetchApi<PagedResponse<GroupMember>>(`/groups/${id}/members`, { signal }),

  getGroupOwners: (id: string, signal?: AbortSignal) =>
    fetchApi<PagedResponse<GroupOwner>>(`/groups/${id}/owners`, { signal }),

  getGroupApplications: (id: string, signal?: AbortSignal) =>
    fetchApi<PagedResponse<GroupApplication>>(`/groups/${id}/applications`, { signal }),

  getGroupDevices: (id: string, signal?: AbortSignal) =>
    fetchApi<PagedResponse<GroupDevice>>(`/groups/${id}/devices`, { signal }),

  getGroupAuditLogs: (id: string, top: number = 50, signal?: AbortSignal) =>
    fetchApi<PagedResponse<GroupAuditLog>>(`/groups/${id}/audit-logs?top=${top}`, { signal }),

  getGroupAccessReviews: (id: string, signal?: AbortSignal) =>
    fetchApi<PagedResponse<GroupAccessReview>>(`/groups/${id}/access-reviews`, { signal }),
};
