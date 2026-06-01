import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OverviewField } from "@/components/shared/overview-field";
import { formatDate } from "@/lib/utils";
import type { TabProps } from "./types";

export function PropertiesTab({ sp, ssoConfig, copyToClipboard }: TabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="text-foreground font-semibold text-xs py-3 border-b border-border/20">Directory Properties & Configuration</CardHeader>
        <CardContent className="space-y-2 py-4">
          <OverviewField label="Display Name" value={sp.displayName} />
          <OverviewField label="Application Display Name" value={sp.appDisplayName || sp.displayName} />
          <OverviewField label="Application (Client) ID" value={sp.appId} mono copyable onCopy={() => copyToClipboard(sp.appId ?? "", "appId")} />
          <OverviewField label="Object ID" value={sp.id} mono copyable onCopy={() => copyToClipboard(sp.id, "objId")} />
          <OverviewField label="Service Principal Type" value={sp.servicePrincipalType} />
          <OverviewField label="Sign-In Audience" value={sp.signInAudience || "AzureADMyOrg"} />
          <OverviewField label="User Assignment Required" value={sp.appRoleAssignmentRequired ? "Yes (Only assigned users can sign in)" : "No (All directory users can sign in)"} />
          <OverviewField label="Default Preferred SSO Mode" value={ssoConfig?.isConfigured ? `${(ssoConfig.detectedPrimaryProtocol || ssoConfig.preferredSingleSignOnMode || "SSO").toUpperCase()} Federation` : "Not configured"} />
          <OverviewField label="App Owner Tenant ID" value={sp.appOwnerOrganizationId || "—"} mono />
          <OverviewField label="Created Timestamp" value={formatDate(sp.createdDateTime)} />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader className="text-foreground font-semibold text-xs py-3 border-b border-border/20">Application Description</CardHeader>
          <CardContent className="py-4 text-xs">
            <p className="text-muted-foreground leading-relaxed">
              {sp.appDescription || "No custom description configured in the directory for this enterprise application."}
            </p>
          </CardContent>
        </Card>

        {sp.notificationEmailAddresses && sp.notificationEmailAddresses.length > 0 && (
          <Card>
            <CardHeader className="text-foreground font-semibold text-xs py-3 border-b border-border/20">Certificate Notifications</CardHeader>
            <CardContent className="py-4">
              <OverviewField
                label="Notification Contact Emails"
                value={sp.notificationEmailAddresses.join(", ")}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="text-foreground font-semibold text-xs py-3 border-b border-border/20">Service Principal Tags ({sp.tags?.length ?? 0})</CardHeader>
          <CardContent className="py-4 text-xs">
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
