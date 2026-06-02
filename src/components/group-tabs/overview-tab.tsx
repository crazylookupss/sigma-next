"use client";

import { memo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Field } from "./field";
import { formatDate } from "@/lib/utils";
import { Monitor } from "lucide-react";
import type { GroupTabProps } from "./types";

export const OverviewTab = memo(function OverviewTab({ group, members, owners, apps, devices, auditLogs, directUsers, directGroups, directDevices, directOthers, isOwnersLoading, isAppsLoading, isDevicesLoading, isLogsLoading, setActiveTab }: GroupTabProps & {
  directUsers: number;
  directGroups: number;
  directDevices: number;
  directOthers: number;
  setActiveTab?: (tab: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <Card>
        <CardHeader><h3 className="text-sm font-semibold text-foreground">Membership Overview</h3></CardHeader>
        <CardContent className="space-y-1">
          <Field label="Total Members" value={group.totalMembers ?? members.length} />
          <Field label="Direct Users" value={group.directUsers ?? directUsers} />
          <Field label="Direct Groups" value={group.directGroups ?? directGroups} />
          <Field label="Direct Devices" value={group.directDevices ?? directDevices} />
          <Field label="Direct Others" value={group.directOthers ?? directOthers} />
          <div className="pt-4 flex items-center justify-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Users</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Groups</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Devices</div>
          </div>
        </CardContent>
      </Card>

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
                <button onClick={() => setActiveTab?.("owners")} className="text-xs text-primary font-semibold hover:underline block pt-2">
                  View all owners →
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center text-[10px] font-bold">A</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{app.displayName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">Role ID: {app.appRoleId?.slice(0, 8)}...</p>
                  </div>
                </div>
              ))}
              {apps.length > 5 && (
                <button onClick={() => setActiveTab?.("applications")} className="text-xs text-primary font-semibold hover:underline block pt-2">
                  View all applications →
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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
                <button onClick={() => setActiveTab?.("devices")} className="text-xs text-primary font-semibold hover:underline block pt-2">
                  View all devices →
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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
  );
});
