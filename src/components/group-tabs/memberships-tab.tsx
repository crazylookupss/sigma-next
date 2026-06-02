"use client";

import { memo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

export const MembershipsTab = memo(function MembershipsTab() {
  return (
    <Card>
      <CardHeader><h3 className="text-sm font-semibold text-foreground">Parent Group Memberships</h3></CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FolderOpen className="w-10 h-10 text-muted-foreground mb-3" />
          <h4 className="text-sm font-semibold text-foreground">No Parent Groups</h4>
          <p className="text-xs text-muted-foreground max-w-sm mt-0.5">
            This group is Cloud-Only and does not inherit memberships from any nested administrative units or directory roles.
          </p>
        </div>
      </CardContent>
    </Card>
  );
});
