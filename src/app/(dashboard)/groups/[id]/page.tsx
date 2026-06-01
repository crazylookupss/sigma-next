"use client";

import { useParams } from "next/navigation";
import {
  useGroup,
  useGroupMembers,
  useGroupOwners,
  useGroupApplications,
  useGroupDevices,
  useGroupAuditLogs,
  useGroupAccessReviews,
} from "@/hooks/use-groups";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  OverviewTab,
  MembersTab,
  OwnersTab,
  MembershipsTab,
  ApplicationsTab,
  DevicesTab,
  EntitlementsTab,
  ReviewsTab,
  AuditTab,
  PropertiesTab,
} from "@/components/group-tabs";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { useState, useMemo } from "react";

export default function GroupDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: group, isLoading: isGroupLoading, error: groupError } = useGroup(id);
  const { data: members = [], isLoading: isMembersLoading } = useGroupMembers(id);
  const { data: owners = [], isLoading: isOwnersLoading } = useGroupOwners(id);
  const { data: apps = [], isLoading: isAppsLoading } = useGroupApplications(id);
  const { data: devices = [], isLoading: isDevicesLoading } = useGroupDevices(id);
  const { data: auditLogs = [], isLoading: isLogsLoading } = useGroupAuditLogs(id, 50);
  const { data: accessReviews = [], isLoading: isReviewsLoading } = useGroupAccessReviews(id);

  const [activeTab, setActiveTab] = useState("overview");

  const directUsers = useMemo(() => members.filter((m) => m.type === "user").length, [members]);
  const directGroups = useMemo(() => members.filter((m) => m.type === "group").length, [members]);
  const directDevices = useMemo(() => members.filter((m) => m.type === "device").length, [members]);
  const directOthers = useMemo(() => members.length - (directUsers + directGroups + directDevices), [members, directUsers, directGroups, directDevices]);

  if (isGroupLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-xl lg:col-span-2" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (groupError || !group) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="glass-card p-8 max-w-md">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {(groupError as Error)?.message ?? "The requested directory group identifier could not be resolved."}
          </p>
          <Link href="/groups" className="text-primary text-sm font-medium hover:underline">
            ← Return to Groups List
          </Link>
        </div>
      </div>
    );
  }

  const isUnified = group.groupTypes?.includes("Unified");
  const isDynamic = group.membershipType === "Dynamic";

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "members", label: `Members (${members.length})` },
    { id: "owners", label: `Owners (${owners.length})` },
    { id: "memberships", label: `Group Memberships (${group.groupMembershipsCount ?? 0})` },
    { id: "applications", label: `Assigned Applications (${apps.length})` },
    { id: "devices", label: `Devices (${devices.length})` },
    { id: "entitlements", label: "Entitlements" },
    { id: "reviews", label: `Access Reviews (${accessReviews.length})` },
    { id: "audit", label: `Audit Logs (${auditLogs.length})` },
    { id: "properties", label: "Properties" },
  ];

  const tabProps = {
    group, members, owners, apps, devices, auditLogs, accessReviews,
    isMembersLoading, isOwnersLoading, isAppsLoading, isDevicesLoading, isLogsLoading, isReviewsLoading,
  };

  return (
    <div>
      <Link
        href="/groups"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Groups
      </Link>

      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center text-xl font-bold flex-shrink-0">
              {group.displayName?.[0]?.toUpperCase() ?? "G"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground truncate">{group.displayName}</h1>
                <Badge variant={isUnified ? "default" : "secondary"}>
                  {isUnified ? "Microsoft 365" : "Security"}
                </Badge>
                <Badge variant={isDynamic ? "secondary" : "outline"}>
                  {group.membershipType ?? "Assigned"}
                </Badge>
                <Badge variant="outline">
                  <span className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${group.source === "Cloud" ? "bg-emerald-500" : "bg-amber-500"}`} />
                    {group.source ?? "Cloud"}
                  </span>
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1 truncate max-w-xl">
                {group.description ?? "No description defined"}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-1">
              <span>Object ID:</span>
              <span className="font-mono font-semibold text-foreground select-all">{group.id}</span>
            </div>
            <div>
              <span>Created:</span>
              <span className="font-semibold text-foreground ml-1">{formatDate(group.createdDateTime)}</span>
            </div>
          </div>
        </div>
      </div>

      {group.groupTypes?.includes("RoleAssignable") && (
        <div className="p-4 border border-amber-500/30 bg-amber-500/10 rounded-xl mb-6 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-amber-500">Privileged Role-Assignable Group</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Members of this group can be assigned to privileged directory roles. Please audit membership changes periodically.
            </p>
          </div>
        </div>
      )}

      <div className="border-b border-border/50 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === "overview" && <OverviewTab {...tabProps} directUsers={directUsers} directGroups={directGroups} directDevices={directDevices} directOthers={directOthers} setActiveTab={setActiveTab} />}
        {activeTab === "members" && <MembersTab {...tabProps} />}
        {activeTab === "owners" && <OwnersTab {...tabProps} />}
        {activeTab === "memberships" && <MembershipsTab />}
        {activeTab === "applications" && <ApplicationsTab {...tabProps} />}
        {activeTab === "devices" && <DevicesTab {...tabProps} />}
        {activeTab === "entitlements" && <EntitlementsTab />}
        {activeTab === "reviews" && <ReviewsTab {...tabProps} />}
        {activeTab === "audit" && <AuditTab {...tabProps} />}
        {activeTab === "properties" && <PropertiesTab {...tabProps} />}
      </div>
    </div>
  );
}
