import { memo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OverviewField } from "@/components/shared/overview-field";
import { Globe, Settings, Network } from "lucide-react";
import type { TabProps } from "./types";

export const ProxyTab = memo(function ProxyTab({ proxyConfig, proxyConfigLoading, copyToClipboard }: TabProps & { proxyConfigLoading?: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 py-3 border-b border-border/20">
        <div>
          <span className="text-foreground font-semibold text-xs">Microsoft Entra Application Proxy Manager</span>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-normal">Securely publish on-premises web applications to external clients using secure proxy tunnels.</p>
        </div>
        {proxyConfigLoading ? (
          <Badge variant="secondary" className="text-xs py-1 px-3">Loading...</Badge>
        ) : proxyConfig?.isConfigured ? (
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-2.5 h-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-success" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-success animate-ping opacity-40" />
            </div>
            <span className="text-xs font-bold text-success tracking-wider">CONFIGURED</span>
          </div>
        ) : (
          <Badge variant="secondary" className="text-xs py-1 px-3 uppercase">Not Configured</Badge>
        )}
      </CardHeader>
      <CardContent className="py-6 space-y-6">
        {proxyConfigLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Network className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3 animate-pulse" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </div>
        ) : !proxyConfig?.isConfigured ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Network className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-sm font-semibold text-foreground">Application Proxy Not Configured</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-md text-center">
              This enterprise application does not have Application Proxy configured.
              Configure proxy in the Entra admin center to publish on-premises applications.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-border bg-accent/10 space-y-4">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-primary" />
                URL Routing Endpoints
              </h4>
              <OverviewField label="Internal URL" value={proxyConfig.internalUrl || "Not configured"} mono copyable={!!proxyConfig.internalUrl} onCopy={proxyConfig.internalUrl ? () => copyToClipboard(proxyConfig.internalUrl!, "Internal URL") : undefined} />
              <OverviewField label="External URL" value={proxyConfig.externalUrl || "Not configured"} mono copyable={!!proxyConfig.externalUrl} onCopy={proxyConfig.externalUrl ? () => copyToClipboard(proxyConfig.externalUrl!, "External URL") : undefined} />
            </div>

            <div className="p-5 rounded-xl border border-border bg-accent/10 space-y-4">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-amber-500" />
                Proxy Configuration Settings
              </h4>
              <div className="flex items-center justify-between pb-2 border-b border-border/50 text-xs">
                <span className="text-muted-foreground">Pre-Authentication</span>
                <Badge variant={proxyConfig.preAuthentication === "AzureAD" ? "default" : "secondary"} className={proxyConfig.preAuthentication === "AzureAD" ? "bg-primary/20 text-primary border-primary/30 text-[10px]" : "text-[10px]"}>
                  {proxyConfig.preAuthentication || "Not set"}
                </Badge>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border/50 text-xs">
                <span className="text-muted-foreground">Translate URLs in Body</span>
                <Badge variant={proxyConfig.translateUrlsInBody ? "success" : "secondary"} className="text-[10px]">
                  {proxyConfig.translateUrlsInBody ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Verify Domain Certificates</span>
                <Badge variant={proxyConfig.verifyDomainCertificates ? "success" : "secondary"} className="text-[10px]">
                  {proxyConfig.verifyDomainCertificates ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
