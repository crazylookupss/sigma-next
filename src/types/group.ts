export interface EntraGroup {
  id: string;
  displayName: string;
  description: string | null;
  mail: string | null;
  mailEnabled: boolean;
  securityEnabled: boolean;
  groupTypes: string[];
  visibility: string | null;
  createdDateTime: string | null;
  memberCount?: number;
  ownerCount?: number;

  // Enriched properties matching backend C# record
  membershipType?: string | null;
  source?: string | null;
  type?: string | null;
  totalDirectMembers?: number | null;
  directUsers?: number | null;
  directGroups?: number | null;
  directDevices?: number | null;
  directOthers?: number | null;
  groupMembershipsCount?: number | null;
  ownersCount?: number | null;
  totalMembers?: number | null;
  mailNickname?: string | null;
}

export interface GroupMember {
  id: string;
  displayName: string;
  userPrincipalName?: string;
  type: "user" | "group" | "device";
}

export interface GroupOwner {
  id: string;
  displayName: string;
  userPrincipalName: string;
}

export interface GroupApplication {
  id: string;
  displayName: string;
  appRoleId: string;
  resourceId: string;
  createdDateTime: string | null;
}

export interface GroupDevice {
  id: string;
  displayName: string;
  deviceId: string;
  operatingSystem: string | null;
  osVersion: string | null;
  isCompliant: boolean | null;
  isManaged: boolean | null;
  trustType: string | null;
}

export interface GroupAuditLog {
  id: string;
  activityDisplayName: string;
  category: string | null;
  initiatedBy: string | null;
  targetResourceName: string | null;
  result: string | null;
  resultReason: string | null;
  activityDateTime: string | null;
  correlationId: string | null;
}

export interface GroupAccessReview {
  id: string;
  displayName: string;
  status: string | null;
  startDate: string | null;
  endDate: string | null;
  reviewersCount: number;
}
