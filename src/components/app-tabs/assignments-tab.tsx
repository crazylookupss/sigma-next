import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials, getAvatarColor, formatDate } from "@/lib/utils";
import { Users } from "lucide-react";
import type { TabProps } from "./types";

export function AssignmentsTab({ assignments, assignmentsLoading, sp }: TabProps & { assignmentsLoading?: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-border/20">
        <div>
          <span className="text-foreground font-semibold text-xs">Users & Groups Assignments</span>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-normal">Auditing accounts explicitly assigned access permissions to this enterprise application.</p>
        </div>
        {!assignmentsLoading && assignments && (
          <Badge variant="default" className="text-xs">{assignments.length} Total Assignments</Badge>
        )}
      </CardHeader>
      <CardContent className="py-6">
        {assignmentsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : !assignments || assignments.length === 0 ? (
          <div className="text-center py-10">
            <Users className="w-12 h-12 text-muted-foreground/45 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">No Explicit Assignments</p>
            <p className="text-xs text-muted-foreground mt-1">
              {sp.appRoleAssignmentRequired
                ? "User assignment is required, but none are assigned. No one can log in."
                : "User assignment is not required. Anyone in the directory can sign in."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border/85 bg-card">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Identity Principal</th>
                  <th className="py-3 px-4">Principal Type</th>
                  <th className="py-3 px-4">Assigned App Role</th>
                  <th className="py-3 px-4">Assigned Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {assignments.map((asg) => (
                  <tr key={asg.id} className="hover:bg-accent/10 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getAvatarColor(asg.principalDisplayName)}`}>
                          {getInitials(asg.principalDisplayName ?? "")}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{asg.principalDisplayName}</p>
                          <p className="text-xs text-muted-foreground truncate">{asg.principalId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={asg.principalType === "Group" ? "secondary" : "outline"} className="text-xs py-0.5">
                        {asg.principalType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">
                      <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                        {asg.appRoleValue || "Default Access"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {formatDate(asg.createdDateTime)}
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
