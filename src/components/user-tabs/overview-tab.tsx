"use client";

import { memo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FieldItem } from "./field-item";
import { getInitials, formatDate } from "@/lib/utils";
import {
  Info,
  Building2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import type { UserTabProps } from "./types";

export const OverviewTab = memo(function OverviewTab({ user, setActiveTab }: UserTabProps & { setActiveTab?: (tab: string) => void }) {
  return (
    <>
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-accent/20 border-border/30 hover:border-border transition-colors">
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Directory Status</span>
              <Badge variant={user.accountEnabled ? "success" : "secondary"}>
                {user.accountEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </CardContent>
          </Card>
          <Card className="bg-accent/20 border-border/30 hover:border-border transition-colors">
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">User Type</span>
              <span className="text-sm font-bold text-foreground">{user.userType ?? "Member"}</span>
            </CardContent>
          </Card>
          <Card className="bg-accent/20 border-border/30 hover:border-border transition-colors">
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Last Sign-In</span>
              <span className="text-sm font-bold text-foreground truncate block">
                {user.signInActivity?.lastSignInDateTime ? formatDate(user.signInActivity.lastSignInDateTime) : "None recorded"}
              </span>
            </CardContent>
          </Card>
          <Card className="bg-accent/20 border-border/30 hover:border-border transition-colors">
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Office Location</span>
              <span className="text-sm font-bold text-foreground truncate block">{user.officeLocation ?? "—"}</span>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/30 bg-card">
          <CardHeader className="pb-3 border-b border-border/30">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Identity Core Highlights
            </h3>
          </CardHeader>
          <CardContent className="p-4 space-y-0.5">
            <FieldItem label="User Principal Name (UPN)" value={user.userPrincipalName} copyable />
            <FieldItem label="Directory Object ID" value={user.id} copyable mono />
            <FieldItem label="Mail Nickname" value={user.mailNickname} />
            <FieldItem label="User Type / Creation" value={`${user.userType ?? "Member"} (${user.creationType ?? "Direct"})`} />
            <FieldItem label="Preferred Language" value={user.preferredLanguage} />
            <FieldItem label="Created Date" value={formatDate(user.createdDateTime)} />
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card className="border-border/30 bg-card overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/30">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-500" />
              Reporting Structure
            </h3>
          </CardHeader>
          <CardContent className="p-5 space-y-6">
            {user.manager ? (
              <div className="space-y-4">
                <span className="text-xs font-semibold text-muted-foreground block">Direct Manager</span>
                <div className="p-4 rounded-xl border border-border/40 bg-accent/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {getInitials(user.manager.displayName ?? "")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{user.manager.displayName}</p>
                    <p className="text-[11px] font-mono text-muted-foreground truncate select-all">{user.manager.userPrincipalName}</p>
                  </div>
                </div>
                <Link
                  href={`/users/${user.manager.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  <span>View Manager Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="text-center py-6 space-y-2">
                <div className="w-10 h-10 text-muted-foreground/30 mx-auto">👤</div>
                <p className="text-sm font-bold text-muted-foreground">No manager defined</p>
                <p className="text-xs text-muted-foreground/75">This user sits at the root or Manager attribute is not configured in Microsoft Entra.</p>
              </div>
            )}

            <div className="border-t border-border/30 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-muted-foreground">Licenses & Subscriptions</span>
                <span className="text-xs font-bold text-foreground">
                  {user.assignedLicenses ? user.assignedLicenses.length : 0} assigned
                </span>
              </div>
              {user.assignedLicenses && user.assignedLicenses.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {user.assignedLicenses.slice(0, 3).map((lic, idx) => (
                    <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                      {lic.skuPartNumber ?? lic.skuId.slice(0, 8)}
                    </span>
                  ))}
                  {user.assignedLicenses.length > 3 && (
                    <button
                      onClick={() => setActiveTab?.("licenses")}
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-secondary hover:bg-accent border border-border text-muted-foreground hover:text-foreground transition-colors"
                    >
                      +{user.assignedLicenses.length - 3} more
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground/70 italic">No direct license assignments detected.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
});
