"use client";

import { memo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";

export const EntitlementsTab = memo(function EntitlementsTab() {
  return (
    <Card>
      <CardHeader><h3 className="text-sm font-semibold text-foreground">Entitlement Governance</h3></CardHeader>
      <CardContent>
        <div className="p-8 text-center max-w-lg mx-auto">
          <Award className="w-12 h-12 text-primary mx-auto mb-4" />
          <h4 className="text-base font-semibold text-foreground">Identity Governance (Entitlement Management)</h4>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Access Packages, catalog policies, and automatic group lifecycle assignments require active **Microsoft Entra ID Governance** (Microsoft Entra ID P2 License). Please contact your global directory administrator to bind access packages.
          </p>
        </div>
      </CardContent>
    </Card>
  );
});
