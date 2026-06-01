import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OverviewField } from "@/components/shared/overview-field";
import { formatDate } from "@/lib/utils";
import {
  Key,
  Globe,
  FileCode,
  Fingerprint,
  Lock,
  Network,
  Shield,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import type { TabProps } from "./types";

export function SsoTab({ sp, ssoConfig, ssoConfigLoading, protocolAnalysis, protocolAnalysisLoading, protocolError, refetchProtocol, copyToClipboard, copied }: TabProps & {
  ssoConfigLoading?: boolean;
  protocolAnalysisLoading?: boolean;
  protocolError?: unknown;
  refetchProtocol?: () => void;
}) {
  const now = useMemo(() => Date.now(), []);
  return (
    <>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 py-3 border-b border-border/20">
          <div>
            <span className="text-foreground font-semibold text-xs">Federated Single Sign-On (SSO) Status</span>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-normal">Configure and audit authentication handshake properties and SAML trust certificates.</p>
          </div>
          <Badge variant={ssoConfig?.isConfigured ? "success" : "secondary"} className="text-xs py-1 px-3 uppercase font-semibold">
            {ssoConfigLoading ? "Loading..." : ssoConfig?.isConfigured
              ? `${ssoConfig.detectedPrimaryProtocol || ssoConfig.preferredSingleSignOnMode?.toUpperCase() || "SSO"} Active`
              : "Not Configured"}
          </Badge>
        </CardHeader>
        <CardContent className="py-6 space-y-6">
          {(() => {
            const mode = ssoConfig?.preferredSingleSignOnMode?.toLowerCase();

            if (ssoConfigLoading) {
              return (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Key className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3 animate-pulse" />
                    <Skeleton className="h-4 w-40 mx-auto" />
                  </div>
                </div>
              );
            }

            if (!ssoConfig?.isConfigured) {
              return (
                <div className="flex flex-col items-center justify-center py-16">
                  <Key className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-sm font-semibold text-foreground">No SSO Configuration Found</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md text-center">
                    This enterprise application does not have SSO configuration data.
                    No certificates, metadata URLs, or protocol settings were detected.
                  </p>
                </div>
              );
            }

            const protocol = ssoConfig?.detectedPrimaryProtocol?.toLowerCase() || mode;

            if (protocol === "saml") {
              return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="rounded-xl border border-border bg-accent/10 p-5 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-border/20">
                          <h4 className="text-xs font-bold text-foreground">1. Basic SAML Configuration</h4>
                          <Badge variant="outline" className="text-[9px] font-mono">Required</Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-y-3">
                          <OverviewField label="Identifier (Entity ID)" value={ssoConfig?.entityId || "Not configured"} mono copyable={!!ssoConfig?.entityId} onCopy={ssoConfig?.entityId ? () => copyToClipboard(ssoConfig.entityId!, "Entity ID") : undefined} />
                          <OverviewField label="Reply URL (Assertion Consumer Service URL)" value={ssoConfig?.replyUrls?.[0] || "Not configured"} mono copyable={!!ssoConfig?.replyUrls?.[0]} onCopy={ssoConfig?.replyUrls?.[0] ? () => copyToClipboard(ssoConfig.replyUrls[0], "Reply URL") : undefined} />
                          <OverviewField label="Sign on URL" value={ssoConfig?.signOnUrl || "Optional"} />
                          <OverviewField label="Relay State (Optional)" value="Optional" />
                          <OverviewField label="Logout Url" value={ssoConfig?.logoutUrl || "Optional"} />
                        </div>
                      </div>

                      <div className="rounded-xl border border-border bg-accent/10 p-5 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-border/20">
                          <h4 className="text-xs font-bold text-foreground">2. Attributes & Claims</h4>
                          <Badge variant="outline" className="text-[9px] font-mono">{ssoConfig?.samlClaims?.length ?? 0} Claims</Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          These claims will be sent in the SAML token issued by Microsoft Entra ID to the application.
                        </p>
                        <div className="overflow-x-auto rounded-lg border border-border/60 bg-card">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                                <th className="py-2.5 px-3">Claim Name</th>
                                <th className="py-2.5 px-3">Value / Source Attribute</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60 font-medium">
                              {ssoConfig?.samlClaims && ssoConfig.samlClaims.length > 0 ? (
                                ssoConfig.samlClaims.map((claim: { namespace: string; name: string; value: string }, idx: number) => (
                                  <tr key={idx} className="hover:bg-accent/10">
                                    <td className="py-2.5 px-3 text-foreground font-mono">{claim.namespace || claim.name.split('/').pop()}</td>
                                    <td className="py-2.5 px-3 text-muted-foreground font-mono">{claim.value}</td>
                                  </tr>
                                ))
                              ) : (
                                <>
                                  <tr className="hover:bg-accent/10"><td className="py-2.5 px-3 text-foreground font-mono">givenname</td><td className="py-2.5 px-3 text-muted-foreground font-mono">user.givenname</td></tr>
                                  <tr className="hover:bg-accent/10"><td className="py-2.5 px-3 text-foreground font-mono">surname</td><td className="py-2.5 px-3 text-muted-foreground font-mono">user.surname</td></tr>
                                  <tr className="hover:bg-accent/10"><td className="py-2.5 px-3 text-foreground font-mono">emailaddress</td><td className="py-2.5 px-3 text-muted-foreground font-mono">user.mail</td></tr>
                                  <tr className="hover:bg-accent/10"><td className="py-2.5 px-3 text-foreground font-mono">name</td><td className="py-2.5 px-3 text-muted-foreground font-mono">user.userprincipalname</td></tr>
                                  <tr className="hover:bg-accent/10"><td className="py-2.5 px-3 text-foreground font-semibold">Unique User Identifier</td><td className="py-2.5 px-3 text-primary font-mono">user.userprincipalname</td></tr>
                                </>
                              )}
                            </tbody>
                          </table>
                        </div>
                        {ssoConfig?.groupMembershipClaims && (
                          <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                            <span className="text-[10px] font-semibold text-primary">Group Membership Claims: {ssoConfig.groupMembershipClaims}</span>
                          </div>
                        )}
                        {ssoConfig?.optionalClaims && ssoConfig.optionalClaims.length > 0 && (
                          <div className="mt-3">
                            <span className="text-[10px] font-semibold text-foreground">Optional Claims: </span>
                            <span className="text-[10px] text-muted-foreground">{ssoConfig.optionalClaims.join(', ')}</span>
                          </div>
                        )}
                      </div>

                      <div className="rounded-xl border border-border bg-accent/10 p-5 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-border/20">
                          <h4 className="text-xs font-bold text-foreground">3. Set up {sp.displayName || "Application"}</h4>
                          <Badge variant="outline" className="text-[9px] font-mono">Entra endpoints</Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          Configure the application to trust Microsoft Entra ID as the Identity Provider (IdP).
                        </p>
                        <div className="grid grid-cols-1 gap-y-3">
                          <OverviewField label="Login URL" value={ssoConfig?.loginUrl || "https://login.microsoftonline.com/{tenantId}/saml2"} mono copyable={!!ssoConfig?.loginUrl} onCopy={ssoConfig?.loginUrl ? () => copyToClipboard(ssoConfig.loginUrl!, "Login URL") : undefined} />
                          <OverviewField label="Microsoft Entra Identifier" value={ssoConfig?.microsoftEntraIdentifier || "https://sts.windows.net/{tenantId}/"} mono copyable={!!ssoConfig?.microsoftEntraIdentifier} onCopy={ssoConfig?.microsoftEntraIdentifier ? () => copyToClipboard(ssoConfig.microsoftEntraIdentifier!, "Entra Identifier") : undefined} />
                          <OverviewField label="Logout URL" value={ssoConfig?.loginUrl || "https://login.microsoftonline.com/{tenantId}/saml2"} mono copyable={!!ssoConfig?.loginUrl} onCopy={ssoConfig?.loginUrl ? () => copyToClipboard(ssoConfig.loginUrl!, "Logout URL") : undefined} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="rounded-xl border border-border bg-accent/10 p-5 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-border/20">
                          <h4 className="text-xs font-bold text-foreground">4. SAML Certificates</h4>
                          <Badge variant={ssoConfig?.certificates?.length ? "success" : "secondary"} className="text-[9px] capitalize">
                            {ssoConfig?.certificates?.length ?? 0} Active
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          {ssoConfig?.certificates && ssoConfig.certificates.length > 0 ? (
                            ssoConfig.certificates.map((cert: { keyId: string | null; displayName: string | null; thumbprint: string | null; endDateTime: string | null; startDateTime: string | null }) => {
                              const isExpired = cert.endDateTime ? new Date(cert.endDateTime).getTime() < now : false;
                              return (
                                <div key={cert.keyId || cert.thumbprint} className="p-3 rounded-lg border border-border/70 bg-card space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-foreground">{cert.displayName || "Token signing certificate"}</span>
                                    <Badge variant={isExpired ? "danger" : "success"} className="text-[9px]">{isExpired ? "Expired" : "Active"}</Badge>
                                  </div>
                                  {cert.thumbprint && (
                                    <div className="space-y-1 text-[10px]">
                                      <p className="text-muted-foreground font-semibold">Thumbprint:</p>
                                      <div className="flex items-center gap-1">
                                        <span className="font-mono text-foreground break-all select-all">{cert.thumbprint.toUpperCase()}</span>
                                        <button onClick={() => copyToClipboard(cert.thumbprint!.toUpperCase(), "Thumbprint")} className="text-muted-foreground hover:text-foreground">
                                          {copied === "Thumbprint" ? <span className="w-3 h-3 text-success">✓</span> : <span className="w-3 h-3">📋</span>}
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  <div className="text-[10px] space-y-0.5">
                                    {cert.endDateTime && <p className="text-muted-foreground"><span className="font-semibold">Expiration:</span> {formatDate(cert.endDateTime)}</p>}
                                    {cert.startDateTime && <p className="text-muted-foreground"><span className="font-semibold">Start:</span> {formatDate(cert.startDateTime)}</p>}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-6 border border-dashed border-border rounded-lg">
                              <Fingerprint className="w-8 h-8 text-muted-foreground/45 mx-auto mb-2" />
                              <p className="text-xs font-medium text-foreground">No certificates found</p>
                              <p className="text-[10px] text-muted-foreground mt-1">Upload certificates in App Registrations.</p>
                            </div>
                          )}

                          {sp.notificationEmailAddresses && sp.notificationEmailAddresses.length > 0 && (
                            <div className="text-[10px] px-1">
                              <p className="text-muted-foreground"><span className="font-semibold">Notification Email:</span> {sp.notificationEmailAddresses.join(", ")}</p>
                            </div>
                          )}

                          <div className="pt-2 space-y-2">
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Downloads & Integrations</p>
                            <OverviewField label="App Federation Metadata Url" value={ssoConfig?.federationMetadataUrl || "https://login.microsoftonline.com/{tenantId}/federationmetadata/2007-06/federationmetadata.xml?appid={appId}"} mono copyable={!!ssoConfig?.federationMetadataUrl} onCopy={ssoConfig?.federationMetadataUrl ? () => copyToClipboard(ssoConfig.federationMetadataUrl!, "Metadata URL") : undefined} />
                            <div className="grid grid-cols-1 gap-2 pt-2">
                              <button onClick={(e) => { e.preventDefault(); alert("Downloading Certificate (Base64)..."); }} className="w-full py-2 px-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all">
                                <FileCode className="w-3.5 h-3.5" /> Download Certificate (Base64)
                              </button>
                              <button onClick={(e) => { e.preventDefault(); alert("Downloading Certificate (Raw)..."); }} className="w-full py-2 px-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all">
                                <FileCode className="w-3.5 h-3.5" /> Download Certificate (Raw)
                              </button>
                              <button onClick={(e) => { e.preventDefault(); alert("Downloading Federation Metadata XML..."); }} className="w-full py-2 px-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all">
                                <FileCode className="w-3.5 h-3.5" /> Download Federation Metadata XML
                              </button>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-border/20 text-[10px] space-y-1.5">
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Verification Certificates (Optional)</p>
                            <div className="flex justify-between"><span className="text-muted-foreground">Required</span><span className="font-semibold text-foreground">No</span></div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Active Certificates</span>
                              <Badge variant="secondary" className="text-[9px] py-0 px-1.5 font-bold">{ssoConfig?.certificates?.filter((c: { endDateTime: string | null }) => c.endDateTime ? new Date(c.endDateTime).getTime() > now : true).length ?? 0}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Expired Certificates</span>
                              <Badge variant="secondary" className="text-[9px] py-0 px-1.5 font-bold">{ssoConfig?.certificates?.filter((c: { endDateTime: string | null }) => c.endDateTime ? new Date(c.endDateTime).getTime() <= now : false).length ?? 0}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            if (protocol === "oidc") {
              return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="rounded-xl border border-border bg-accent/10 p-5 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-border/20">
                          <h4 className="text-xs font-bold text-foreground">1. Application Credentials</h4>
                          <Badge variant="outline" className="text-[9px] font-mono">OIDC / OAuth 2.0</Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-y-3">
                          <OverviewField label="Client (Application) ID" value={sp.appId || "—"} mono copyable onCopy={() => copyToClipboard(sp.appId ?? "", "Client ID")} />
                          <OverviewField label="Directory (Tenant) ID" value={ssoConfig?.tenantId || sp.appOwnerOrganizationId || "—"} mono copyable onCopy={() => copyToClipboard(ssoConfig?.tenantId || sp.appOwnerOrganizationId || "", "Tenant ID")} />
                          <OverviewField label="Object ID" value={sp.id} mono copyable onCopy={() => copyToClipboard(sp.id, "Object ID")} />
                        </div>
                      </div>

                      <div className="rounded-xl border border-border bg-accent/10 p-5 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-border/20">
                          <h4 className="text-xs font-bold text-foreground">2. Authority & Token Endpoints</h4>
                          <Badge variant="outline" className="text-[9px] font-mono">v2.0</Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-y-3">
                          <OverviewField label="Authorization Endpoint" value={ssoConfig?.authorizationEndpoint || `https://login.microsoftonline.com/${sp.appOwnerOrganizationId || "{tenantId}"}/oauth2/v2.0/authorize`} mono copyable={!!ssoConfig?.authorizationEndpoint} onCopy={ssoConfig?.authorizationEndpoint ? () => copyToClipboard(ssoConfig.authorizationEndpoint!, "Auth Endpoint") : undefined} />
                          <OverviewField label="Token Endpoint" value={ssoConfig?.tokenEndpoint || `https://login.microsoftonline.com/${sp.appOwnerOrganizationId || "{tenantId}"}/oauth2/v2.0/token`} mono copyable={!!ssoConfig?.tokenEndpoint} onCopy={ssoConfig?.tokenEndpoint ? () => copyToClipboard(ssoConfig.tokenEndpoint!, "Token Endpoint") : undefined} />
                          <OverviewField label="JWKS URI" value={`https://login.microsoftonline.com/${ssoConfig?.tenantId || sp.appOwnerOrganizationId || "{tenantId}"}/discovery/v2.0/keys`} mono copyable onCopy={() => copyToClipboard(`https://login.microsoftonline.com/${ssoConfig?.tenantId || sp.appOwnerOrganizationId || "{tenantId}"}/discovery/v2.0/keys`, "JWKS URI")} />
                          <OverviewField label="OpenID Config URL" value={`https://login.microsoftonline.com/${ssoConfig?.tenantId || sp.appOwnerOrganizationId || "{tenantId}"}/v2.0/.well-known/openid-configuration`} mono copyable onCopy={() => copyToClipboard(`https://login.microsoftonline.com/${ssoConfig?.tenantId || sp.appOwnerOrganizationId || "{tenantId}"}/v2.0/.well-known/openid-configuration`, "OpenID Config")} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="rounded-xl border border-border bg-accent/10 p-5 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-border/20">
                          <h4 className="text-xs font-bold text-foreground">3. Client Secrets</h4>
                          <Badge variant={sp.passwordCredentials && sp.passwordCredentials.length > 0 ? "success" : "secondary"} className="text-[9px]">
                            {sp.passwordCredentials?.length ?? 0} Active
                          </Badge>
                        </div>
                        {sp.passwordCredentials && sp.passwordCredentials.length > 0 ? (
                          <div className="space-y-3">
                            {sp.passwordCredentials.map((pw) => {
                              const daysLeft = pw.endDateTime ? Math.round((new Date(pw.endDateTime).getTime() - now) / (1000 * 60 * 60 * 24)) : null;
                              const isExpired = daysLeft !== null && daysLeft <= 0;
                              const isWarning = daysLeft !== null && daysLeft > 0 && daysLeft <= 30;
                              return (
                                <div key={pw.keyId} className="p-3 rounded-lg border border-border/70 bg-card space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-foreground">{pw.displayName || "Client Secret"}</span>
                                    <Badge variant={isExpired ? "danger" : isWarning ? "warning" : "success"} className="text-[9px] py-0">
                                      {isExpired ? "Expired" : daysLeft !== null ? `${daysLeft}d left` : "Active"}
                                    </Badge>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground">Expires: {formatDate(pw.endDateTime)}</p>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-6 border border-dashed border-border rounded-lg">
                            <Lock className="w-8 h-8 text-muted-foreground/45 mx-auto mb-2" />
                            <p className="text-xs font-medium text-foreground">No client secrets</p>
                            <p className="text-[10px] text-muted-foreground mt-1">Generate client secrets in App Registrations.</p>
                          </div>
                        )}
                      </div>

                      <div className="rounded-xl border border-border bg-accent/10 p-5 space-y-3">
                        <h4 className="text-xs font-bold text-foreground pb-2 border-b border-border/20">Supported Grant Types</h4>
                        {[
                          { name: "Authorization Code", enabled: true },
                          { name: "PKCE (Recommended)", enabled: true },
                          { name: "Client Credentials", enabled: true },
                          { name: "Implicit Flow", enabled: ssoConfig?.enableIdTokenIssuance === true || ssoConfig?.enableAccessTokenIssuance === true },
                          { name: "Device Code", enabled: false },
                        ].map((grant) => (
                          <div key={grant.name} className="flex items-center justify-between text-[10px]">
                            <span className="text-muted-foreground">{grant.name}</span>
                            <Badge variant={grant.enabled ? "success" : "secondary"} className="text-[9px] py-0 px-1.5">
                              {grant.enabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            if (protocol === "password") {
              return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="rounded-xl border border-border bg-accent/10 p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <Lock className="w-8 h-8 text-amber-500" />
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Password-based SSO Configured</h4>
                        <p className="text-[10px] text-muted-foreground">User credentials are vaulted and injected into the application sign-in form. Configure sign-on URL and field selectors in Entra ID.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            if (protocol === "headers" || protocol === "headerbased") {
              return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="rounded-xl border border-border bg-accent/10 p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <Network className="w-8 h-8 text-purple-500" />
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Header-based SSO Configured</h4>
                        <p className="text-[10px] text-muted-foreground">HTTP headers are injected by the Application Proxy connector. Configure header mappings and pre-authentication in Entra ID.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            if (protocol === "linked") {
              return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="rounded-xl border border-border bg-accent/10 p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <Globe className="w-8 h-8 text-blue-500" />
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Linked SSO Configured</h4>
                        <p className="text-[10px] text-muted-foreground">Users are redirected to an external identity provider. Configure the sign-on URL in Entra ID to point to your existing SSO solution.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <div className="flex flex-col items-center justify-center py-16">
                <Key className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-sm font-semibold text-foreground">Unknown SSO Protocol</p>
                <p className="text-xs text-muted-foreground mt-1">Mode: {mode || "none"}</p>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Protocol Analysis Section */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 py-3 border-b border-border/20">
          <div>
            <span className="text-foreground font-semibold text-xs">Protocol Intelligence Analysis</span>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-normal">Automated detection of authentication protocols based on SSO configuration.</p>
          </div>
          <div className="flex items-center gap-2">
            {protocolAnalysis?.primaryProtocol && protocolAnalysis.primaryProtocol !== "Unknown" && (
              <Badge variant="success" className="text-xs py-1 px-3 uppercase font-semibold">
                {protocolAnalysis.primaryProtocol}
              </Badge>
            )}
            <button
              onClick={() => refetchProtocol?.()}
              disabled={protocolAnalysisLoading}
              className="p-1.5 rounded-md hover:bg-accent/50 transition-colors disabled:opacity-50"
              title="Refresh analysis"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${protocolAnalysisLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="py-6 space-y-6">
          {protocolAnalysisLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Fingerprint className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3 animate-pulse" />
                <Skeleton className="h-4 w-48 mx-auto" />
                <Skeleton className="h-3 w-32 mx-auto mt-2" />
              </div>
            </div>
          ) : protocolError ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="w-12 h-12 text-warning/50 mx-auto mb-4" />
              <p className="text-sm font-semibold text-foreground">Analysis Failed</p>
              <p className="text-xs text-muted-foreground mt-1">Unable to load protocol analysis. Check backend connectivity.</p>
              <button onClick={() => refetchProtocol?.()} className="mt-3 text-xs text-primary hover:underline">Retry</button>
            </div>
          ) : !protocolAnalysis ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Fingerprint className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-sm font-semibold text-foreground">Analysis Not Available</p>
              <p className="text-xs text-muted-foreground mt-1">Protocol analysis data is not available for this application.</p>
            </div>
          ) : (
            <>
              {protocolAnalysis.primaryProtocol && protocolAnalysis.primaryProtocol !== "Unknown" && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Primary: {protocolAnalysis.primaryProtocol}</h4>
                        <p className="text-[10px] text-muted-foreground">Detected as the main authentication protocol</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-primary">
                        {protocolAnalysis.detectedProtocols.find(d => d.protocol === protocolAnalysis.primaryProtocol)?.normalizedScore || 0}%
                      </span>
                      <p className="text-[9px] text-muted-foreground">confidence</p>
                    </div>
                  </div>
                  <div className="w-full bg-primary/10 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${protocolAnalysis.detectedProtocols.find(d => d.protocol === protocolAnalysis.primaryProtocol)?.normalizedScore || 0}%` }}
                    />
                  </div>
                </div>
              )}

              {protocolAnalysis.detectedProtocols.filter(d => d.isDetected && d.protocol !== protocolAnalysis.primaryProtocol).length > 0 && (
                <div>
                  <p className="text-[10px] text-muted-foreground mb-2">Also detected:</p>
                  <div className="flex flex-wrap gap-2">
                    {protocolAnalysis.detectedProtocols
                      .filter(d => d.isDetected && d.protocol !== protocolAnalysis.primaryProtocol)
                      .map((detection) => (
                        <div key={detection.protocol} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/30 bg-accent/30 text-xs">
                          <span className="font-medium text-foreground">{detection.protocol}</span>
                          <span className="text-muted-foreground">({detection.normalizedScore}%)</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {protocolAnalysis.detectedProtocols.find(d => d.protocol === protocolAnalysis.primaryProtocol)?.evidence && (
                <div>
                  <p className="text-[10px] text-muted-foreground mb-2">Evidence supporting {protocolAnalysis.primaryProtocol} detection:</p>
                  <div className="max-h-32 overflow-y-auto space-y-1 pr-2">
                    {protocolAnalysis.detectedProtocols
                      .find(d => d.protocol === protocolAnalysis.primaryProtocol)!
                      .evidence.slice(0, 8)
                      .map((evidence, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[10px] py-1 px-2 rounded bg-accent/20">
                          <span className="text-muted-foreground">•</span>
                          <span className="text-foreground/80">{evidence.description}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {protocolAnalysis.governanceInsights.length > 0 && (
                <div>
                  <p className="text-[10px] text-muted-foreground mb-2">Governance findings:</p>
                  <div className="space-y-2">
                    {protocolAnalysis.governanceInsights.map((insight, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs ${
                          insight.severity === "Critical"
                            ? "border-error/50 bg-error/5 text-error"
                            : insight.severity === "Warning"
                            ? "border-warning/50 bg-warning/5 text-warning"
                            : "border-info/50 bg-info/5 text-info"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={insight.severity === "Critical" ? "danger" : insight.severity === "Warning" ? "warning" : "secondary"}
                            className="text-[8px] py-0 px-1"
                          >
                            {insight.severity}
                          </Badge>
                          <span className="text-[9px] text-muted-foreground">{insight.category}</span>
                        </div>
                        <p className="text-[10px]">{insight.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[9px] text-muted-foreground pt-2 border-t border-border/20">
                <span>Analyzed: {new Date(protocolAnalysis.analysisTimestamp).toLocaleString()}</span>
                <span>{protocolAnalysis.allEvidence.length} evidence signals across {protocolAnalysis.detectedProtocols.filter(d => d.isDetected).length} protocols</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
