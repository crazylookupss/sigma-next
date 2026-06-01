"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Field } from "./field";
import { formatDate } from "@/lib/utils";
import type { GroupTabProps } from "./types";

export function PropertiesTab({ group }: GroupTabProps) {
  return (
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
  );
}
