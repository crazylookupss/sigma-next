import type { EntraGroup } from "@/types/group";

export interface GroupTabProps {
  group: EntraGroup;
  members: Array<{ id: string; displayName?: string; userPrincipalName?: string; type?: string }>;
  owners: Array<{ id: string; displayName?: string; userPrincipalName?: string }>;
  apps: Array<{ id: string; displayName?: string; appRoleId?: string; createdDateTime?: string }>;
  devices: Array<{ id: string; displayName?: string; operatingSystem?: string; osVersion?: string; isCompliant?: boolean; isManaged?: boolean; trustType?: string }>;
  auditLogs: Array<{ id: string; activityDateTime?: string; activityDisplayName?: string; initiatedBy?: string; result?: string; category?: string; targetResourceName?: string }>;
  accessReviews: Array<{ id: string; displayName?: string; status?: string; startDate?: string; endDate?: string; reviewersCount?: number }>;
  isMembersLoading?: boolean;
  isOwnersLoading?: boolean;
  isAppsLoading?: boolean;
  isDevicesLoading?: boolean;
  isLogsLoading?: boolean;
  isReviewsLoading?: boolean;
}
