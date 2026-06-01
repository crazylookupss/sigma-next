"use client";

import { useParams } from "next/navigation";
import { 
  useGroup, 
  useGroupMembers, 
  useGroupOwners, 
  useGroupApplications, 
  useGroupDevices, 
  useGroupAuditLogs, 
  useGroupAccessReviews 
} from "@/hooks/use-groups";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  ShieldAlert, 
  FolderOpen,
  Monitor,
  Award
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { useState, useMemo } from "react";

export default function GroupDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // React Queries
  const { data: group, isLoading: isGroupLoading, error: groupError } = useGroup(id);
  const { data: members = [], isLoading: isMembersLoading } = useGroupMembers(id);
  const { data: owners = [], isLoading: isOwnersLoading } = useGroupOwners(id);
  const { data: apps = [], isLoading: isAppsLoading } = useGroupApplications(id);
  const { data: devices = [], isLoading: isDevicesLoading } = useGroupDevices(id);
  const { data: auditLogs = [], isLoading: isLogsLoading } = useGroupAuditLogs(id, 50);
  const { data: accessReviews = [], isLoading: isReviewsLoading } = useGroupAccessReviews(id);

  // Tab State
  const [activeTab, setActiveTab] = useState("overview");

  // Search & Filters for Members Tab
  const [membersSearch, setMembersSearch] = useState("");
  const [membersTypeFilter, setMembersTypeFilter] = useState("All");

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchSearch = 
        !membersSearch.trim() || 
        member.displayName?.toLowerCase().includes(membersSearch.toLowerCase()) ||
        member.userPrincipalName?.toLowerCase().includes(membersSearch.toLowerCase());
      
      const matchType = 
        membersTypeFilter === "All" || 
        (membersTypeFilter === "User" && member.type === "user") ||
        (membersTypeFilter === "Group" && member.type === "group") ||
        (membersTypeFilter === "Device" && member.type === "device");
      
      return matchSearch && matchType;
    });
  }, [members, membersSearch, membersTypeFilter]);

  // Derived relationship statistics
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

  // Tab definitions
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

  return (
    <div>
      <Link
        href="/groups"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Groups
      </Link>

      {/* Group Header Card */}
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

      {/* Privileged Warning Alert */}
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

      {/* Tab Navigation Menu */}
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

      {/* Tab Contents */}
      <div className="space-y-6">
        
        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Group Summary */}
            <Card>
              <CardHeader><h3 className="text-sm font-semibold text-foreground">Group Summary</h3></CardHeader>
              <CardContent className="space-y-1">
                <Field label="Group Type" value={group.type ?? "Security"} />
                <Field label="Membership Type" value={group.membershipType ?? "Assigned"} />
                <Field label="Source" value={group.source ?? "Cloud"} />
                <Field label="Visibility" value={group.visibility ?? "Public"} />
                <Field label="Mail Enabled" value={group.mailEnabled ? "Yes" : "No"} />
                <Field label="Mail" value={group.mail} />
                <Field label="Created" value={formatDate(group.createdDateTime)} />
              </CardContent>
            </Card>

            {/* Membership Overview */}
            <Card>
              <CardHeader><h3 className="text-sm font-semibold text-foreground">Membership Overview</h3></CardHeader>
              <CardContent className="space-y-1">
                <Field label="Total Members" value={group.totalMembers ?? members.length} />
                <Field label="Direct Users" value={group.directUsers ?? directUsers} />
                <Field label="Direct Groups" value={group.directGroups ?? directGroups} />
                <Field label="Direct Devices" value={group.directDevices ?? directDevices} />
                <Field label="Direct Others" value={group.directOthers ?? directOthers} />
                
                {/* Simplified Chart Indicator */}
                <div className="pt-4 flex items-center justify-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Users</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Groups</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Devices</div>
                </div>
              </CardContent>
            </Card>

            {/* Owners (Top 5) */}
            <Card>
              <CardHeader><h3 className="text-sm font-semibold text-foreground">Owners ({owners.length})</h3></CardHeader>
              <CardContent>
                {isOwnersLoading ? (
                  <div className="space-y-2"><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-full" /></div>
                ) : owners.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6 font-medium">No owners assigned (Ownerless Group)</p>
                ) : (
                  <div className="space-y-2">
                    {owners.slice(0, 5).map((owner) => (
                      <div key={owner.id} className="flex items-center gap-2 py-1.5 border-b border-border/30 last:border-b-0">
                        <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-[10px] font-bold">
                          {owner.displayName?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{owner.displayName}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{owner.userPrincipalName}</p>
                        </div>
                      </div>
                    ))}
                    {owners.length > 5 && (
                      <button onClick={() => setActiveTab("owners")} className="text-xs text-primary font-semibold hover:underline block pt-2">
                        View all owners →
                      </button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assigned Apps (Top 5) */}
            <Card>
              <CardHeader><h3 className="text-sm font-semibold text-foreground">Assigned Applications ({apps.length})</h3></CardHeader>
              <CardContent>
                {isAppsLoading ? (
                  <div className="space-y-2"><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-full" /></div>
                ) : apps.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6 font-medium">No application role assignments.</p>
                ) : (
                  <div className="space-y-2">
                    {apps.slice(0, 5).map((app) => (
                      <div key={app.id} className="flex items-center gap-2 py-1.5 border-b border-border/30 last:border-b-0">
                        <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center text-[10px] font-bold">
                          A
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{app.displayName}</p>
                          <p className="text-[10px] text-muted-foreground truncate">Role ID: {app.appRoleId?.slice(0, 8)}...</p>
                        </div>
                      </div>
                    ))}
                    {apps.length > 5 && (
                      <button onClick={() => setActiveTab("applications")} className="text-xs text-primary font-semibold hover:underline block pt-2">
                        View all applications →
                      </button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Associated Devices (Top 5) */}
            <Card>
              <CardHeader><h3 className="text-sm font-semibold text-foreground">Devices ({devices.length})</h3></CardHeader>
              <CardContent>
                {isDevicesLoading ? (
                  <div className="space-y-2"><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-full" /></div>
                ) : devices.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6 font-medium">No associated devices.</p>
                ) : (
                  <div className="space-y-2">
                    {devices.slice(0, 5).map((device) => (
                      <div key={device.id} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-b-0 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <Monitor className="w-4 h-4 text-sky-500 flex-shrink-0" />
                          <span className="font-semibold text-foreground truncate">{device.displayName}</span>
                        </div>
                        <Badge variant={device.isCompliant ? "success" : "secondary"} className="text-[10px] px-1.5 py-0">
                          {device.isCompliant ? "Compliant" : "Non-compliant"}
                        </Badge>
                      </div>
                    ))}
                    {devices.length > 5 && (
                      <button onClick={() => setActiveTab("devices")} className="text-xs text-primary font-semibold hover:underline block pt-2">
                        View all devices →
                      </button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activities (Top 5) */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader><h3 className="text-sm font-semibold text-foreground">Recent Audit Activity</h3></CardHeader>
              <CardContent>
                {isLogsLoading ? (
                  <div className="space-y-2"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></div>
                ) : auditLogs.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6 font-medium">No recent audit log activities found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/50 text-muted-foreground font-semibold">
                          <th className="py-2 pr-4">Timestamp</th>
                          <th className="py-2 pr-4">Activity</th>
                          <th className="py-2 pr-4">Initiated By</th>
                          <th className="py-2 pr-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {auditLogs.slice(0, 5).map((log) => (
                          <tr key={log.id} className="hover:bg-accent/20">
                            <td className="py-2.5 pr-4 text-muted-foreground">{formatDate(log.activityDateTime)}</td>
                            <td className="py-2.5 pr-4 font-semibold text-foreground">{log.activityDisplayName}</td>
                            <td className="py-2.5 pr-4">{log.initiatedBy}</td>
                            <td className="py-2.5 pr-4">
                              <Badge variant={log.result === "success" ? "success" : "danger"} className="text-[10px] px-1.5 py-0">
                                {log.result}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        )}

        {/* 2. MEMBERS TAB */}
        {activeTab === "members" && (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-sm font-semibold text-foreground">Group Members</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={membersSearch}
                    onChange={(e) => setMembersSearch(e.target.value)}
                    className="px-3 py-1.5 bg-accent border border-border rounded-lg text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <select
                    value={membersTypeFilter}
                    onChange={(e) => setMembersTypeFilter(e.target.value)}
                    className="px-2 py-1.5 bg-accent border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="All">All Types</option>
                    <option value="User">Users</option>
                    <option value="Group">Groups</option>
                    <option value="Device">Devices</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isMembersLoading ? (
                <div className="space-y-2"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></div>
              ) : filteredMembers.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8 font-medium">No matching members found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border/50 text-muted-foreground font-semibold">
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">User Principal Name / ID</th>
                        <th className="py-2 pr-4">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-accent/20">
                          <td className="py-2.5 pr-4 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                              {member.displayName?.[0]?.toUpperCase()}
                            </div>
                            <span className="font-semibold text-foreground">{member.displayName}</span>
                          </td>
                          <td className="py-2.5 pr-4 font-mono text-muted-foreground select-all">{member.userPrincipalName ?? member.id}</td>
                          <td className="py-2.5 pr-4">
                            <Badge variant={member.type === "user" ? "secondary" : member.type === "group" ? "default" : "secondary"}>
                              {member.type}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 3. OWNERS TAB */}
        {activeTab === "owners" && (
          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-foreground">Group Owners</h3></CardHeader>
            <CardContent>
              {isOwnersLoading ? (
                <div className="space-y-2"><Skeleton className="h-8 w-full" /></div>
              ) : owners.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8 font-medium">No owners assigned (Ownerless Group).</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border/50 text-muted-foreground font-semibold">
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">User Principal Name</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {owners.map((owner) => (
                        <tr key={owner.id} className="hover:bg-accent/20">
                          <td className="py-2.5 pr-4 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-[10px] font-bold">
                              {owner.displayName?.[0]?.toUpperCase()}
                            </div>
                            <span className="font-semibold text-foreground">{owner.displayName}</span>
                          </td>
                          <td className="py-2.5 pr-4 font-mono text-muted-foreground select-all">{owner.userPrincipalName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 4. GROUP MEMBERSHIPS TAB */}
        {activeTab === "memberships" && (
          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-foreground">Parent Group Memberships</h3></CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FolderOpen className="w-10 h-10 text-muted-foreground mb-3" />
                <h4 className="text-sm font-semibold text-foreground">No Parent Groups</h4>
                <p className="text-xs text-muted-foreground max-w-sm mt-0.5">
                  This group is Cloud-Only and does not inherit memberships from any nested administrative units or directory roles.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 5. ASSIGNED APPLICATIONS TAB */}
        {activeTab === "applications" && (
          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-foreground">Assigned Enterprise Application Roles</h3></CardHeader>
            <CardContent>
              {isAppsLoading ? (
                <div className="space-y-2"><Skeleton className="h-8 w-full" /></div>
              ) : apps.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8 font-medium">No application role assignments.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border/50 text-muted-foreground font-semibold">
                        <th className="py-2 pr-4">Enterprise Application</th>
                        <th className="py-2 pr-4">App Role ID</th>
                        <th className="py-2 pr-4">Assigned On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {apps.map((app) => (
                        <tr key={app.id} className="hover:bg-accent/20">
                          <td className="py-2.5 pr-4 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center text-[10px] font-bold">
                              A
                            </div>
                            <span className="font-semibold text-foreground">{app.displayName}</span>
                          </td>
                          <td className="py-2.5 pr-4 font-mono text-muted-foreground select-all">{app.appRoleId}</td>
                          <td className="py-2.5 pr-4">{formatDate(app.createdDateTime)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 6. DEVICES TAB */}
        {activeTab === "devices" && (
          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-foreground">Associated Hardware Devices</h3></CardHeader>
            <CardContent>
              {isDevicesLoading ? (
                <div className="space-y-2"><Skeleton className="h-8 w-full" /></div>
              ) : devices.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8 font-medium">No associated device members.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border/50 text-muted-foreground font-semibold">
                        <th className="py-2 pr-4">Device Name</th>
                        <th className="py-2 pr-4">OS / Version</th>
                        <th className="py-2 pr-4">Compliance</th>
                        <th className="py-2 pr-4">Management</th>
                        <th className="py-2 pr-4">Trust Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {devices.map((device) => (
                        <tr key={device.id} className="hover:bg-accent/20">
                          <td className="py-2.5 pr-4 flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-sky-500" />
                            <span className="font-semibold text-foreground">{device.displayName}</span>
                          </td>
                          <td className="py-2.5 pr-4 text-muted-foreground">
                            {device.operatingSystem} {device.osVersion}
                          </td>
                          <td className="py-2.5 pr-4">
                            <Badge variant={device.isCompliant ? "success" : "secondary"}>
                              {device.isCompliant ? "Compliant" : "Non-compliant"}
                            </Badge>
                          </td>
                          <td className="py-2.5 pr-4 text-muted-foreground">
                            {device.isManaged ? "Intune Managed" : "Unmanaged"}
                          </td>
                          <td className="py-2.5 pr-4">{device.trustType ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 7. ENTITLEMENTS TAB */}
        {activeTab === "entitlements" && (
          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-foreground">Entitlement Governance</h3></CardHeader>
            <CardContent>
              <div className="p-8 text-center max-w-lg mx-auto">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="text-base font-semibold text-foreground">Identity Governance (Entitlement Management)</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Access Packages, catalog policies, and automatic group lifecycle assignments require active **Microsoft Entra ID Governance** (Microsoft Entra ID P2 License). Please contact your global directory administrator to bind access packages.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 8. ACCESS REVIEWS TAB */}
        {activeTab === "reviews" && (
          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-foreground">Identity Access Reviews</h3></CardHeader>
            <CardContent>
              {isReviewsLoading ? (
                <div className="space-y-2"><Skeleton className="h-8 w-full" /></div>
              ) : accessReviews.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8 font-medium">No governance access reviews configured.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border/50 text-muted-foreground font-semibold">
                        <th className="py-2 pr-4">Review Definition</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2 pr-4">Start Date</th>
                        <th className="py-2 pr-4">End Date</th>
                        <th className="py-2 pr-4">Reviewers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {accessReviews.map((review) => (
                        <tr key={review.id} className="hover:bg-accent/20">
                          <td className="py-2.5 pr-4 font-semibold text-foreground">{review.displayName}</td>
                          <td className="py-2.5 pr-4">
                            <Badge variant={review.status === "InProgress" ? "secondary" : "outline"}>
                              {review.status}
                            </Badge>
                          </td>
                          <td className="py-2.5 pr-4 text-muted-foreground">{formatDate(review.startDate)}</td>
                          <td className="py-2.5 pr-4 text-muted-foreground">{formatDate(review.endDate)}</td>
                          <td className="py-2.5 pr-4">{review.reviewersCount} reviewer(s)</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 9. AUDIT LOGS TAB */}
        {activeTab === "audit" && (
          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-foreground">Directory Audit Log History</h3></CardHeader>
            <CardContent>
              {isLogsLoading ? (
                <div className="space-y-2"><Skeleton className="h-8 w-full" /></div>
              ) : auditLogs.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8 font-medium">No audit log history entries recorded.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border/50 text-muted-foreground font-semibold">
                        <th className="py-2 pr-4">Timestamp</th>
                        <th className="py-2 pr-4">Activity</th>
                        <th className="py-2 pr-4">Category</th>
                        <th className="py-2 pr-4">Initiated By</th>
                        <th className="py-2 pr-4">Target Resource</th>
                        <th className="py-2 pr-4">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-accent/20">
                          <td className="py-2.5 pr-4 text-muted-foreground">{formatDate(log.activityDateTime)}</td>
                          <td className="py-2.5 pr-4 font-semibold text-foreground">{log.activityDisplayName}</td>
                          <td className="py-2.5 pr-4 text-muted-foreground">{log.category}</td>
                          <td className="py-2.5 pr-4">{log.initiatedBy}</td>
                          <td className="py-2.5 pr-4 font-mono select-all text-muted-foreground">{log.targetResourceName}</td>
                          <td className="py-2.5 pr-4">
                            <Badge variant={log.result === "success" ? "success" : "danger"}>
                              {log.result}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 10. PROPERTIES TAB */}
        {activeTab === "properties" && (
          <Card>
            <CardHeader><h3 className="text-sm font-semibold text-foreground">Full Directory Schema Properties</h3></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <Field label="Display Name" value={group.displayName} />
              <Field label="Directory Object ID" value={group.id} mono />
              <Field label="Description" value={group.description} />
              <Field label="Group Type" value={group.type} />
              <Field label="Membership Type" value={group.membershipType} />
              <Field label="Directory Source" value={group.source} />
              <Field label="Visibility Namespace" value={group.visibility} />
              <Field label="Mail Enabled" value={group.mailEnabled ? "Yes" : "No"} />
              <Field label="Email Address" value={group.mail} />
              <Field label="Mail Nickname" value={group.mailNickname ?? "—"} />
              <Field label="Created On" value={formatDate(group.createdDateTime)} />
              <Field label="Total Calculated Members" value={group.totalMembers} />
              <Field label="Total Assigned Owners" value={group.ownersCount} />
              {group.groupTypes && group.groupTypes.length > 0 && (
                <div className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-b-0 col-span-2">
                  <span className="text-xs text-muted-foreground">Special Schema Group Types:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {group.groupTypes.map((gt) => (
                      <Badge key={gt} variant="outline" className="text-[10px] font-semibold">{gt}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}

function Field({ 
  label, 
  value, 
  mono = false 
}: { 
  label: string; 
  value?: string | number | null; 
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-b-0 text-xs">
      <span className="text-muted-foreground pr-2">{label}</span>
      <span className={`font-medium text-right select-all pl-2 max-w-[65%] truncate ${
        mono ? "font-mono text-muted-foreground text-[10px]" : "text-foreground"
      }`}>
        {value !== null && value !== undefined && value !== "" ? value : "—"}
      </span>
    </div>
  );
}
