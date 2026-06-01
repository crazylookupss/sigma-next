import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials, getAvatarColor } from "@/lib/utils";
import { UserCheck, Mail } from "lucide-react";
import type { TabProps } from "./types";

export function OwnersTab({ owners, ownersLoading }: TabProps & { ownersLoading?: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-border/20">
        <div>
          <span className="text-foreground font-semibold text-xs">Assigned Application Owners</span>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-normal">Directory entities authorized to manage configuration settings for this application.</p>
        </div>
        {!ownersLoading && owners && (
          <Badge variant="default" className="text-xs">{owners.length} Assigned</Badge>
        )}
      </CardHeader>
      <CardContent className="py-6">
        {ownersLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : !owners || owners.length === 0 ? (
          <div className="text-center py-8">
            <UserCheck className="w-12 h-12 text-muted-foreground/45 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">No Owners Assigned</p>
            <p className="text-xs text-muted-foreground mt-1">This application has no configured owners. Global Admins can edit properties.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {owners.map((owner) => (
              <div key={owner.id} className="p-4 rounded-xl border border-border bg-accent/15 flex items-center justify-between hover:border-primary/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${getAvatarColor(owner.displayName)}`}>
                    {getInitials(owner.displayName ?? "")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{owner.displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{owner.userPrincipalName || owner.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  <Badge variant="outline" className="text-xs capitalize py-0.5">
                    {owner.ownerType}
                  </Badge>
                  {owner.userPrincipalName && (
                    <a
                      href={`mailto:${owner.userPrincipalName}`}
                      className="p-1.5 rounded-lg bg-accent hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
