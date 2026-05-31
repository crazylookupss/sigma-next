export type FindingSeverity = "Critical" | "Warning" | "Info";
export type FindingCategory = "Credentials" | "Ownership" | "Protocol" | "Configuration" | "Security" | "Compliance";

export interface GovernanceFinding {
  id: string;
  category: FindingCategory;
  severity: FindingSeverity;
  title: string;
  description: string;
  entityType: string;
  entityId: string;
  entityName: string;
  actionUrl: string;
  metadata: Record<string, string>;
}

export interface GovernanceSummary {
  total: number;
  critical: number;
  warning: number;
  info: number;
  lastAnalyzed: string;
}

export interface GovernanceFindingsResponse {
  summary: GovernanceSummary;
  findings: GovernanceFinding[];
}
