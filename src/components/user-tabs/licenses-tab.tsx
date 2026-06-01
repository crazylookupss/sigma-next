"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Layers, FileSpreadsheet, PlusCircle } from "lucide-react";
import { ExtensionAttributeWidget } from "./extension-attribute-widget";
import type { UserTabProps } from "./types";

export function LicensesTab({ user, copyToClipboard }: UserTabProps) {
  const [showConfiguredOnly, setShowConfiguredOnly] = useState(true);

  const extAttrs = user.onPremisesExtensionAttributes;
  const extensionList = Array.from({ length: 15 }, (_, i) => {
    const key = `extensionAttribute${i + 1}` as keyof typeof extAttrs;
    const value = extAttrs ? extAttrs[key] : null;
    return { name: `extensionAttribute${i + 1}`, value };
  });
  const configuredExtensions = extensionList.filter(ext => ext.value !== null && ext.value !== undefined && ext.value !== "");

  return (
    <>
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-border/30 bg-card">
          <CardHeader className="pb-3 border-b border-border/30 flex flex-row items-center justify-between">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Product Subscriptions & Plans
            </h3>
            <Badge variant="outline" className="border-amber-500/20 bg-amber-500/5 text-amber-500 font-bold">
              {user.assignedLicenses ? user.assignedLicenses.length : 0} assigned
            </Badge>
          </CardHeader>
          <CardContent className="p-5">
            {user.assignedLicenses && user.assignedLicenses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.assignedLicenses.map((lic, idx) => (
                  <div key={idx} className="p-4 bg-accent/25 border border-border/40 rounded-xl hover:border-border transition-colors space-y-3 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400 w-16" />
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-500 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" /> License Subscription
                      </span>
                      <h4 className="text-sm font-black text-foreground truncate select-all">{lic.skuPartNumber ?? "Unknown SKU Name"}</h4>
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground pt-2 border-t border-border/20">
                      <span className="block mb-0.5 text-foreground font-semibold">SKU Identifier:</span>
                      <span className="select-all block break-all">{lic.skuId}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-3 border-2 border-dashed border-border/25 rounded-2xl bg-accent/5">
                <Award className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-foreground">No Subscriptions Assigned</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">This user principal has no active product licensing configured in this Entra ID tenant.</p>
                </div>
              </div>
            )}

            {user.assignedPlans && user.assignedPlans.length > 0 && (
              <div className="mt-8 border-t border-border/30 pt-6">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 block">Sub-Service Status & Plans</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.assignedPlans.map((plan, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-border/30 bg-accent/10">
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-foreground truncate">{plan.servicePlanName}</p>
                        <span className="text-[9px] font-mono text-muted-foreground select-all truncate block">{plan.servicePlanId}</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-semibold uppercase text-success border-success/20 bg-success/5 flex-shrink-0">
                        Active
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card className="border-border/30 bg-card overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/30 flex flex-row items-center justify-between gap-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-teal-500" />
              Directory Extensions
            </h3>
            <button
              onClick={() => setShowConfiguredOnly(!showConfiguredOnly)}
              className="text-[10px] font-bold text-primary hover:underline"
            >
              {showConfiguredOnly ? "Show All (15)" : "Show Configured Only"}
            </button>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {showConfiguredOnly ? (
              configuredExtensions.length > 0 ? (
                <div className="space-y-1.5">
                  {configuredExtensions.map((ext) => (
                    <ExtensionAttributeWidget key={ext.name} name={ext.name} value={ext.value ?? null} copyable copyHelper={copyToClipboard} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 space-y-2 bg-accent/5 rounded-xl border border-dashed border-border/20">
                  <PlusCircle className="w-8 h-8 text-muted-foreground/30 mx-auto" />
                  <p className="text-xs font-bold text-muted-foreground">No custom attributes set</p>
                  <p className="text-[10px] text-muted-foreground/75 px-4">All extensionAttribute1-15 values are unconfigured for this user.</p>
                </div>
              )
            ) : (
              <div className="space-y-1.5 max-h-[450px] overflow-y-auto pr-1">
                {extensionList.map((ext) => (
                  <ExtensionAttributeWidget key={ext.name} name={ext.name} value={ext.value ?? null} copyable={!!ext.value} copyHelper={copyToClipboard} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
