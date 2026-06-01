import type {
  EntraGroup,
  GroupMember,
  GroupOwner,
  GroupApplication,
  GroupDevice,
  GroupAuditLog,
  GroupAccessReview,
} from "@/types/group";

export interface GroupTabProps {
  group: EntraGroup;
  members: GroupMember[];
  owners: GroupOwner[];
  apps: GroupApplication[];
  devices: GroupDevice[];
  auditLogs: GroupAuditLog[];
  accessReviews: GroupAccessReview[];
  isMembersLoading?: boolean;
  isOwnersLoading?: boolean;
  isAppsLoading?: boolean;
  isDevicesLoading?: boolean;
  isLogsLoading?: boolean;
  isReviewsLoading?: boolean;
}
