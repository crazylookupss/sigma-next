"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { GroupTabProps } from "./types";

export function OwnersTab({ owners, isOwnersLoading }: GroupTabProps) {
  return (
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
  );
}
