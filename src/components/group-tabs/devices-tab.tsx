"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Monitor } from "lucide-react";
import type { GroupTabProps } from "./types";

export function DevicesTab({ devices, isDevicesLoading }: GroupTabProps) {
  return (
    <Card>
      <CardHeader><h3 className="text-sm font-semibold text-foreground">Associated Hardware Devices</h3></CardHeader>
      <CardContent>
        {isDevicesLoading ? (
          <div className="space-y-2"><Skeleton className="h-8 w-full" /></div>
        ) : devices.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8 font-medium">No associated device members.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground font-semibold">
                  <th className="py-2 pr-4">Device Name</th>
                  <th className="py-2 pr-4">OS / Version</th>
                  <th className="py-2 pr-4">Compliance</th>
                  <th className="py-2 pr-4">Management</th>
                  <th className="py-2 pr-4">Trust Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {devices.map((device) => (
                  <tr key={device.id} className="hover:bg-accent/20">
                    <td className="py-2.5 pr-4 flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-sky-500" />
                      <span className="font-semibold text-foreground">{device.displayName}</span>
                    </td>
                    <td className="py-2.5 pr-4 text-muted-foreground">
                      {device.operatingSystem} {device.osVersion}
                    </td>
                    <td className="py-2.5 pr-4">
                      <Badge variant={device.isCompliant ? "success" : "secondary"}>
                        {device.isCompliant ? "Compliant" : "Non-compliant"}
                      </Badge>
                    </td>
                    <td className="py-2.5 pr-4 text-muted-foreground">
                      {device.isManaged ? "Intune Managed" : "Unmanaged"}
                    </td>
                    <td className="py-2.5 pr-4">{device.trustType ?? "—"}</td>
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
