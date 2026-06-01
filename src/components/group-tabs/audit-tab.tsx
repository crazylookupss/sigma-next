"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import type { GroupTabProps } from "./types";

export function AuditTab({ auditLogs, isLogsLoading }: GroupTabProps) {
  return (
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
  );
}
