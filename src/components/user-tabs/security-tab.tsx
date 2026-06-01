"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FieldItem } from "./field-item";
import { formatDate } from "@/lib/utils";
import { Shield, RefreshCw } from "lucide-react";
import type { UserTabProps } from "./types";

export function SecurityTab({ user }: UserTabProps) {
  return (
    <>
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-border/30 bg-card">
          <CardHeader className="pb-3 border-b border-border/30">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-500" />
              Security Profile & Policies
            </h3>
          </CardHeader>
          <CardContent className="p-4 space-y-0.5">
            <div className="flex justify-between items-center py-2.5 border-b border-border/30">
              <span className="text-xs text-muted-foreground">Account Status</span>
              <Badge variant={user.accountEnabled ? "success" : "secondary"}>
                {user.accountEnabled ? "Active Sign-In Allowed" : "Sign-In Disabled"}
              </Badge>
            </div>
            <FieldItem label="Last Password Change" value={formatDate(user.lastPasswordChangeDateTime)} />
            <FieldItem label="Active Sessions Valid From" value={formatDate(user.signInSessionsValidFromDateTime)} />
            <FieldItem label="Password Policy Flags" value={user.passwordPolicies || "Standard User Policy (None set)"} />
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card className="border-border/30 bg-card">
          <CardHeader className="pb-3 border-b border-border/30">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-cyan-500" />
              On-Premises Hybrid Sync
            </h3>
          </CardHeader>
          <CardContent className="p-4 space-y-0.5">
            <div className="flex justify-between items-center py-2.5 border-b border-border/30">
              <span className="text-xs text-muted-foreground">Directory Source</span>
              <Badge variant={user.onPremisesSyncEnabled ? "secondary" : "outline"} className={user.onPremisesSyncEnabled ? "border-cyan-500/20 bg-cyan-500/5 text-cyan-500" : ""}>
                {user.onPremisesSyncEnabled ? "Active AD Sync" : "Cloud-Only User"}
              </Badge>
            </div>
            <FieldItem label="SAM Account Name" value={user.onPremisesSamAccountName} mono copyable />
            <FieldItem label="Security Identifier (SID)" value={user.onPremisesSecurityIdentifier} mono copyable />
            <FieldItem label="Sync Domain" value={user.onPremisesDomainName} />
            <FieldItem label="On-Premises UPN" value={user.onPremisesUserPrincipalName} mono />
            <FieldItem label="Last Active Sync" value={formatDate(user.onPremisesLastSyncDateTime)} />
            {user.onPremisesDistinguishedName && (
              <div className="py-2.5">
                <span className="text-xs text-muted-foreground block mb-1">Distinguished Name (DN)</span>
                <p className="text-[10px] font-mono bg-accent/20 p-2 border border-border/30 rounded-lg text-foreground break-all select-all leading-relaxed">
                  {user.onPremisesDistinguishedName}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
