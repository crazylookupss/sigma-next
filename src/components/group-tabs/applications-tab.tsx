"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import type { GroupTabProps } from "./types";

export function ApplicationsTab({ apps, isAppsLoading }: GroupTabProps) {
  return (
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
                      <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center text-[10px] font-bold">A</div>
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
  );
}
