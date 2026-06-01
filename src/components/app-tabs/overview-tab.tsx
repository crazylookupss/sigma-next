import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OverviewField } from "@/components/shared/overview-field";
import { getInitials, getAvatarColor, formatDate } from "@/lib/utils";
import {
  Info,
  Settings,
  Key,
  UserCheck,
  Users,
  Network,
  Layers,
} from "lucide-react";
import type { TabProps } from "./types";

export function OverviewTab({ sp, ssoConfig, owners, ownersLoading, assignments, proxyConfig, proxyConfigLoading }: TabProps & { ownersLoading?: boolean; proxyConfigLoading?: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 text-foreground font-semibold text-xs py-3 border-b border-border/20">
            <Info className="w-4 h-4 text-blue-500" />
            Basic Information
          </CardHeader>
          <CardContent className="space-y-1.5 py-4">
            <OverviewField label="Display Name" value={sp.displayName} />
            <OverviewField label="Application ID" value={sp.appId} mono />
            <OverviewField label="Object ID" value={sp.id} mono />
            <OverviewField label="Publisher Domain" value={sp.publisherName || "microsoft.onmicrosoft.com"} />
            <OverviewField label="Sign-In Audience" value={sp.signInAudience || "AzureADMyOrg"} />
            <OverviewField label="Created On" value={formatDate(sp.createdDateTime)} />
            <OverviewField
              label="Preferred SSO Mode"
              value={
                <Badge variant="success" className="capitalize text-[10px] bg-success/20 text-success border-success/30 font-semibold">
                  {ssoConfig?.isConfigured ? (ssoConfig.detectedPrimaryProtocol || ssoConfig.preferredSingleSignOnMode || "SSO Active") : "Not configured"}
                </Badge>
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 text-foreground font-semibold text-xs py-3 border-b border-border/20">
            <Settings className="w-4 h-4 text-amber-500" />
            Enterprise Diagnostics
          </CardHeader>
          <CardContent className="space-y-1.5 py-4">
            <OverviewField
              label="Account Status"
              value={
                <Badge variant={sp.accountEnabled !== false ? "success" : "secondary"} className="text-[10px]">
                  {sp.accountEnabled !== false ? "Enabled" : "Disabled"}
                </Badge>
              }
            />
            <OverviewField
              label="User Assignment"
              value={
                <Badge variant={sp.appRoleAssignmentRequired ? "default" : "secondary"} className="text-[10px]">
                  {sp.appRoleAssignmentRequired ? "Required" : "Optional"}
                </Badge>
              }
            />
            <OverviewField label="App Owner Tenant ID" value={sp.appOwnerOrganizationId || "—"} mono />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 text-foreground font-semibold text-xs py-3 border-b border-border/20">
            <Key className="w-4 h-4 text-emerald-500" />
            SSO & Integration Security
          </CardHeader>
          <CardContent className="space-y-1.5 py-4">
            <OverviewField label="Active Mode" value={ssoConfig?.isConfigured ? `${(ssoConfig.detectedPrimaryProtocol || ssoConfig.preferredSingleSignOnMode || "SSO").toUpperCase()} Federated` : "Not configured"} />
            <OverviewField label="Direct Assignments" value={assignments.length.toString()} />
            <OverviewField label="Active Credentials" value={((sp.keyCredentials?.length ?? 0) + (sp.passwordCredentials?.length ?? 0)).toString()} />
            <OverviewField label="SAML Metadata URL" value={(ssoConfig?.preferredSingleSignOnMode?.toLowerCase() === "saml") ? (ssoConfig?.samlMetadataUrl || "Available") : "—"} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 text-foreground font-semibold text-xs py-3 border-b border-border/20">
            <Network className="w-4 h-4 text-purple-500" />
            Application Proxy Status
          </CardHeader>
          <CardContent className="space-y-3 py-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <span className="text-muted-foreground">Tunnel Status</span>
              {proxyConfigLoading ? (
                <Skeleton className="h-4 w-16" />
              ) : proxyConfig?.isConfigured ? (
                <div className="flex items-center gap-1.5">
                  <div className="relative w-2 h-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-success animate-ping opacity-40" />
                  </div>
                  <span className="text-[10px] font-bold text-success">CONFIGURED</span>
                </div>
              ) : (
                <span className="text-[10px] font-bold text-muted-foreground">NOT CONFIGURED</span>
              )}
            </div>
            <OverviewField label="Internal Routing" value={proxyConfig?.internalUrl || "—"} mono />
            <OverviewField label="External Proxy URL" value={proxyConfig?.externalUrl || "—"} mono />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 text-foreground font-semibold text-xs py-3 border-b border-border/20">
            <UserCheck className="w-4 h-4 text-teal-500" />
            Owners & Contact Points
          </CardHeader>
          <CardContent className="py-4 text-xs">
            {ownersLoading ? (
              <div className="space-y-2"><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-full" /></div>
            ) : owners.length > 0 ? (
              <div className="space-y-3">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Assigned Owners ({owners.length})</p>
                <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                  {owners.slice(0, 3).map((owner) => (
                    <div key={owner.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-accent/40 border border-transparent hover:border-border/30 transition-all">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${getAvatarColor(owner.displayName)}`}>
                        {getInitials(owner.displayName ?? "")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground truncate">{owner.displayName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{owner.userPrincipalName ?? owner.ownerType}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground italic py-3">No directory owners assigned.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 text-foreground font-semibold text-xs py-3 border-b border-border/20">
            <Layers className="w-4 h-4 text-pink-500" />
            Directory Tags
          </CardHeader>
          <CardContent className="py-4 text-xs space-y-3">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Service Principal Tags ({sp.tags?.length ?? 0})</p>
            {sp.tags && sp.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {sp.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px] font-mono">{tag}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No directory tags attached.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
