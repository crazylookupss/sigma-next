"use client";

import { memo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FieldItem } from "./field-item";
import { formatDate } from "@/lib/utils";
import { Fingerprint, UserCheck, Building2 } from "lucide-react";
import type { UserTabProps } from "./types";

export const IdentityTab = memo(function IdentityTab({ user }: UserTabProps) {
  return (
    <>
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-border/30 bg-card">
          <CardHeader className="pb-3 border-b border-border/30">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-indigo-500" />
              Advanced Identity Profile
            </h3>
          </CardHeader>
          <CardContent className="p-4 space-y-0.5">
            <FieldItem label="Given (First) Name" value={user.givenName} />
            <FieldItem label="Surname (Last Name)" value={user.surname} />
            <FieldItem label="Mail Nickname" value={user.mailNickname} />
            <FieldItem label="User Principal Name (UPN)" value={user.userPrincipalName} copyable />
            <FieldItem label="Creation Type" value={user.creationType} />
            <FieldItem label="Directory Registration" value={user.externalUserState ? `External State: ${user.externalUserState}` : "Internal Tenant Member"} />
          </CardContent>
        </Card>

        {user.identities && user.identities.length > 0 && (
          <Card className="border-border/30 bg-card">
            <CardHeader className="pb-3 border-b border-border/30">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-sky-500" />
                Sign-in Identities & Providers
              </h3>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {user.identities.map((identity, idx) => (
                <div key={idx} className="p-3.5 bg-accent/20 border border-border/40 rounded-xl text-xs space-y-2 hover:border-border transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary uppercase text-[10px] tracking-wider">Identity Source {idx + 1}</span>
                    <Badge variant="outline" className="text-[10px] font-semibold border-primary/20 bg-primary/5 text-primary">
                      {identity.signInType ?? "EmailAddress"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground pt-1 border-t border-border/20">
                    <div>
                      <span className="font-medium text-foreground mr-1 block text-[10px] uppercase">Issuer Domain:</span>
                      <span className="font-mono text-foreground/90">{identity.issuer ?? "—"}</span>
                    </div>
                    <div>
                      <span className="font-medium text-foreground mr-1 block text-[10px] uppercase">Assigned ID:</span>
                      <span className="font-mono text-foreground/90 select-all">{identity.issuerAssignedId ?? "—"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card className="border-border/30 bg-card">
          <CardHeader className="pb-3 border-b border-border/30">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-500" />
              Job & Organization Details
            </h3>
          </CardHeader>
          <CardContent className="p-4 space-y-0.5">
            <FieldItem label="Job Title" value={user.jobTitle} />
            <FieldItem label="Department" value={user.department} />
            <FieldItem label="Company Name" value={user.companyName} />
            <FieldItem label="Employee Identifier" value={user.employeeId} copyable mono />
            <FieldItem label="Employee Type" value={user.employeeType} />
            <FieldItem label="Hire Date" value={formatDate(user.employeeHireDate)} />
            <FieldItem label="Manager" value={user.manager?.displayName} />
          </CardContent>
        </Card>
      </div>
    </>
  );
});
