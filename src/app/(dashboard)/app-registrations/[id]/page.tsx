"use client";

import { useParams, useRouter } from "next/navigation";
import { getInitials, getAvatarColor } from "@/lib/utils";
import {
  useApplication,
  useApplicationOwners,
  useApplicationCredentialHealth,
  useApplicationPermissions,
  useApplicationManifest,
} from "@/hooks/use-applications";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OverviewField } from "@/components/shared/overview-field";
import {
  ArrowLeft,
  Shield,
  Copy,
  Check,
  RefreshCw,
  Info,
  Verified,
  Palette,
  ShieldCheck,
  Layers,
  FileCode,
  Key,
  Globe,
  Settings,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { useState, useMemo } from "react";

export default function AppRegistrationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // React Query Hooks
  const { data: app, isLoading: isAppLoading, error: appError, refetch: refetchApp } = useApplication(id);
  const { data: owners = [], isLoading: isOwnersLoading } = useApplicationOwners(id);
  const { data: credHealth, isLoading: isCredsLoading } = useApplicationCredentialHealth(id);
  const { data: permissions = [], isLoading: isPermsLoading } = useApplicationPermissions(id);
  const { data: manifest, isLoading: isManifestLoading } = useApplicationManifest(id);

  // UI state
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState<string | null>(null);

  // Copy helper
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  // Protocol Detector
  const protocol = useMemo(() => {
    if (!app) return "Unknown";
    const redirectUris = [
      ...(app.web?.redirectUris ?? []),
      ...(app.publicClient?.redirectUris ?? []),
    ];
    if (redirectUris.length > 0) {
      if (redirectUris.some((u) => u.toLowerCase().startsWith("http"))) {
        return "OpenID Connect";
      }
      return "OAuth 2.0";
    }
    if (app.samlMetadataUrl) return "SAML";
    if (app.api?.requestedAccessTokenVersion != null) return "Client Credentials";
    return "Client Secrets / Keys";
  }, [app]);

  // getInitials and getAvatarColor imported from @/lib/utils

  if (isAppLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-xl lg:col-span-2" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (appError || !app) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="glass-card p-8 max-w-md">
          <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {(appError as Error)?.message ?? "The requested application registration could not be resolved."}
          </p>
          <Link href="/app-registrations" className="text-primary text-sm font-medium hover:underline">
            ← Return to App Registrations
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "App Overview", icon: Info },
    { id: "branding", label: "Branding & Properties", icon: Palette },
    { id: "authentication", label: "Authentication", icon: Globe },
    { id: "credentials", label: `Certificates & Secrets (${(credHealth?.certificates?.length ?? 0) + (credHealth?.secrets?.length ?? 0)})`, icon: Key },
    { id: "tokens", label: "Token Configuration", icon: Settings },
    { id: "permissions", label: `API Permissions (${permissions.length})`, icon: ShieldCheck },
    { id: "exposeApi", label: `Expose an API (${app.api?.oauth2PermissionScopes?.length ?? 0})`, icon: Layers },
    { id: "manifest", label: "Manifest", icon: FileCode },
  ];

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 mb-4 text-xs text-muted-foreground">
        <span>Directory</span>
        <ChevronRightIcon />
        <Link href="/app-registrations" className="hover:text-primary transition-colors">App Registrations</Link>
        <ChevronRightIcon />
        <span className="text-primary font-semibold truncate max-w-[200px]">{app.displayName}</span>
      </div>

      {/* Header card */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <button
              onClick={() => router.push("/app-registrations")}
              className="p-2 border border-border/40 rounded-lg hover:bg-accent transition-colors self-center text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-sm ${getAvatarColor(app.displayName)}`}>
              {getInitials(app.displayName)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground truncate">{app.displayName}</h1>
                <Badge variant="default" className="text-[10px]">App Registration</Badge>
                <Badge variant="outline" className="text-[10px]">{protocol}</Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-1 select-all">{app.appId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end md:self-center">
            <button
              onClick={() => {
                refetchApp();
              }}
              className="p-2 rounded-lg border border-border/40 hover:bg-accent text-muted-foreground transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Metadata Bar */}
      <div className="glass-card p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Application (Client) ID</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-mono font-semibold text-foreground select-all truncate">{app.appId}</span>
              <button onClick={() => copyToClipboard(app.appId, "appId")} className="text-muted-foreground hover:text-foreground">
                {copied === "appId" ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Object ID</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-mono text-muted-foreground select-all truncate">{app.id}</span>
              <button onClick={() => copyToClipboard(app.id, "objId")} className="text-muted-foreground hover:text-foreground">
                {copied === "objId" ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Publisher Domain</p>
            <p className="text-xs font-semibold text-foreground mt-1 truncate">{app.publisherDomain ?? "—"}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Sign-In Audience</p>
            <Badge variant="secondary" className="text-[10px] mt-1 font-semibold">{app.signInAudience ?? "AzureADMyOrg"}</Badge>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Created DateTime</p>
            <p className="text-xs font-semibold text-foreground mt-1">{formatDate(app.createdDateTime)}</p>
          </div>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex overflow-x-auto gap-1 border-b border-border/50 pb-px mb-6 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="space-y-6">
        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 text-foreground font-semibold text-xs py-3 border-b border-border/20">
                <Info className="w-4 h-4 text-blue-500" />
                Basic Information
              </CardHeader>
              <CardContent className="space-y-1.5 py-4">
                <OverviewField label="Display Name" value={app.displayName} />
                <OverviewField label="Application (Client) ID" value={app.appId} mono />
                <OverviewField label="Object ID" value={app.id} mono />
                <OverviewField label="Publisher Domain" value={app.publisherDomain} />
                <OverviewField label="Sign-In Audience" value={app.signInAudience} />
                <OverviewField label="Created On" value={formatDate(app.createdDateTime)} />
                <OverviewField label="Application Template ID" value={app.applicationTemplateId ?? "—"} mono />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2 text-foreground font-semibold text-xs py-3 border-b border-border/20">
                <Verified className="w-4 h-4 text-emerald-500" />
                Publisher & Certification
              </CardHeader>
              <CardContent className="space-y-3 py-4 text-xs">
                {app.verifiedPublisher ? (
                  <div className="space-y-1.5">
                    <Badge variant="success">Verified Publisher</Badge>
                    <OverviewField label="Publisher Name" value={app.verifiedPublisher.displayName} />
                    <OverviewField label="Publisher ID" value={app.verifiedPublisher.verifiedPublisherId} mono />
                    <OverviewField label="Verified On" value={formatDate(app.verifiedPublisher.addedDateTime)} />
                  </div>
                ) : (
                  <p className="text-muted-foreground font-medium py-2">Publisher is not verified by Microsoft.</p>
                )}
                <div className="border-t border-border/20 pt-3">
                  {app.certification?.isCertifiedByMicrosoft ? (
                    <div className="space-y-1.5">
                      <Badge variant="success">Microsoft Certified</Badge>
                      <OverviewField label="Certification Expiry" value={formatDate(app.certification.certificationExpirationDateTime)} />
                    </div>
                  ) : (
                    <p className="text-muted-foreground font-medium">This application registration is not certified.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2 text-foreground font-semibold text-xs py-3 border-b border-border/20">
                <Globe className="w-4 h-4 text-indigo-500" />
                Identifiers & Tags
              </CardHeader>
              <CardContent className="space-y-4 py-4 text-xs">
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Application URI Identifiers</p>
                  {app.identifierUris && app.identifierUris.length > 0 ? (
                    <div className="space-y-1">
                      {app.identifierUris.map((uri) => (
                        <div key={uri} className="p-2 rounded bg-accent/40 font-mono text-[10px] select-all break-all border border-border/30">
                          {uri}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No identifier URIs defined.</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Directory Tags ({app.tags.length})</p>
                  {app.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {app.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px] font-mono">{tag}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No directory tags attached.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2 text-foreground font-semibold text-xs py-3 border-b border-border/20">
                <Key className="w-4 h-4 text-amber-500" />
                Credentials & Security Health
              </CardHeader>
              <CardContent className="py-4 space-y-4">
                {isCredsLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : credHealth ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {credHealth.hasExpiredCredentials ? (
                        <Badge variant="danger">Expired Credentials Found</Badge>
                      ) : credHealth.credentialsExpiringWithin30Days > 0 ? (
                        <Badge variant="warning">{credHealth.credentialsExpiringWithin30Days} Expiring Soon</Badge>
                      ) : (
                        <Badge variant="success">Credentials Healthy</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div className="p-3 bg-accent/30 rounded-lg text-center border border-border/30">
                        <p className="text-[10px] text-muted-foreground font-semibold">Active Certificates</p>
                        <p className="text-xl font-bold text-foreground mt-1">{credHealth.certificates.length}</p>
                      </div>
                      <div className="p-3 bg-accent/30 rounded-lg text-center border border-border/30">
                        <p className="text-[10px] text-muted-foreground font-semibold">Active Secrets</p>
                        <p className="text-xl font-bold text-foreground mt-1">{credHealth.secrets.length}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No credential information loaded.</p>
                )}
                <div className="border-t border-border/20 pt-3 text-xs">
                  <OverviewField label="Allow Public Client Flows" value={app.isFallbackPublicClient ? "Yes" : "No"} />
                  {app.api?.requestedAccessTokenVersion && (
                    <OverviewField label="Access Token Version" value={app.api.requestedAccessTokenVersion === 2 ? "v2.0" : "v1.0"} />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2 text-foreground font-semibold text-xs py-3 border-b border-border/20">
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                Owners / Contact Points
              </CardHeader>
              <CardContent className="py-4 text-xs">
                {isOwnersLoading ? (
                  <div className="space-y-2"><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-full" /></div>
                ) : owners.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Assigned Owners ({owners.length})</p>
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {owners.map((owner) => (
                        <div key={owner.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-accent/40 border border-transparent hover:border-border/30 transition-all">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${getAvatarColor(owner.displayName)}`}>
                            {getInitials(owner.displayName)}
                          </div>
                          <div className="min-w-0">
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
                Protocols & Integration
              </CardHeader>
              <CardContent className="space-y-3 py-4 text-xs">
                <OverviewField label="Detected Sign-In Protocol" value={protocol} />
                <OverviewField label="Web Redirect URIs" value={(app.web?.redirectUris?.length ?? 0).toString()} />
                <OverviewField label="SPA/Public Redirect URIs" value={(app.publicClient?.redirectUris?.length ?? 0).toString()} />
                {app.web?.homePageUrl && (
                  <OverviewField label="Home Page URL" value={<a href={app.web.homePageUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate block">{app.web.homePageUrl}</a>} />
                )}
                {app.web?.logoutUrl && (
                  <OverviewField label="Logout URL" value={app.web.logoutUrl} />
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* 2. BRANDING TAB */}
        {activeTab === "branding" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="text-foreground font-semibold text-xs py-3 border-b border-border/20">General Properties</CardHeader>
              <CardContent className="space-y-2 py-4">
                <OverviewField label="Application Registration Display Name" value={app.displayName} />
                <OverviewField label="Application ID" value={app.appId} mono />
                <OverviewField label="Object ID" value={app.id} mono />
                <OverviewField label="Primary Publisher Domain" value={app.publisherDomain} />
                <OverviewField label="SignIn Audience Configuration" value={app.signInAudience} />
                <OverviewField label="Created DateTime" value={formatDate(app.createdDateTime)} />
                <OverviewField label="Application Template Identifier" value={app.applicationTemplateId ?? "—"} mono />
                {app.web && (
                  <>
                    <OverviewField label="Branding Homepage URL" value={app.web.homePageUrl ?? "—"} />
                    <OverviewField label="Logout Redirect Endpoint" value={app.web.logoutUrl ?? "—"} />
                  </>
                )}
                <OverviewField label="Support Fallback Public Clients" value={app.isFallbackPublicClient ? "Yes" : "No"} />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader className="text-foreground font-semibold text-xs py-3 border-b border-border/20">Publisher Attestation & Details</CardHeader>
                <CardContent className="space-y-3 py-4 text-xs">
                  {app.verifiedPublisher ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2"><Badge variant="success">Verified Publisher</Badge></div>
                      <OverviewField label="Publisher Name" value={app.verifiedPublisher.displayName} />
                      <OverviewField label="Publisher Verified Identifier" value={app.verifiedPublisher.verifiedPublisherId} mono />
                      <OverviewField label="Date Attested" value={formatDate(app.verifiedPublisher.addedDateTime)} />
                    </div>
                  ) : (
                    <p className="text-muted-foreground font-medium">This application is unregistered under Microsoft Verified Publisher domains.</p>
                  )}
                  {app.certification?.isCertifiedByMicrosoft && (
                    <div className="border-t border-border/20 pt-3 space-y-2">
                      <Badge variant="success">Microsoft 365 Certified</Badge>
                      <OverviewField label="Attestation Date" value={formatDate(app.certification.lastCertificationDateTime)} />
                      <OverviewField label="Expiration Date" value={formatDate(app.certification.certificationExpirationDateTime)} />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-foreground font-semibold text-xs py-3 border-b border-border/20">Application URIs & Integrations</CardHeader>
                <CardContent className="py-4 space-y-4 text-xs">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Exposed Identifier URIs</p>
                    {app.identifierUris && app.identifierUris.length > 0 ? (
                      <div className="space-y-1">
                        {app.identifierUris.map((uri) => (
                          <div key={uri} className="p-2 rounded bg-accent/40 font-mono text-[10px] break-all border border-border/30 select-all">
                            {uri}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">No identifier URIs configured.</p>
                    )}
                  </div>
                  <div className="border-t border-border/20 pt-3">
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Metadata Summary</p>
                    <OverviewField label="Protocol Style" value={protocol} />
                    <OverviewField label="SAML Metadata URI" value={app.samlMetadataUrl ?? "—"} />
                    <OverviewField label="Token Encryption Key ID" value={app.tokenEncryptionKeyId ?? "—"} mono />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* 3. AUTHENTICATION TAB */}
        {activeTab === "authentication" && (
          <Card className="w-full">
            <CardHeader className="text-foreground font-semibold text-xs py-3 border-b border-border/20">Authentication & Web Redirects</CardHeader>
            <CardContent className="py-6 space-y-6 text-xs">
              <div className="flex gap-2">
                <Badge variant="secondary">{protocol}</Badge>
                <Badge variant="outline">{app.signInAudience}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-4">Web Redirect URIs</h3>
                  {app.web?.redirectUris && app.web.redirectUris.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-[10px] text-muted-foreground font-semibold">Configured Web Redirects ({app.web.redirectUris.length})</p>
                      <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                        {app.web.redirectUris.map((uri) => (
                          <div key={uri} className="flex items-center justify-between p-2 rounded bg-accent/40 border border-border/30">
                            <span className="font-mono text-[10px] select-all break-all mr-2">{uri}</span>
                            <button onClick={() => copyToClipboard(uri, uri)} className="text-muted-foreground hover:text-foreground">
                              {copied === uri ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No Web redirect URIs configured.</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-4">Public Client / SPA Redirect URIs</h3>
                  {app.publicClient?.redirectUris && app.publicClient.redirectUris.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-[10px] text-muted-foreground font-semibold">SPA / Mobile Clients Redirects ({app.publicClient.redirectUris.length})</p>
                      <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                        {app.publicClient.redirectUris.map((uri) => (
                          <div key={uri} className="flex items-center justify-between p-2 rounded bg-accent/40 border border-border/30">
                            <span className="font-mono text-[10px] select-all break-all mr-2">{uri}</span>
                            <button onClick={() => copyToClipboard(uri, uri)} className="text-muted-foreground hover:text-foreground">
                              {copied === uri ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No Mobile / Desktop / SPA redirect URIs configured.</p>
                  )}
                </div>
              </div>

              {app.web?.implicitGrantSettings && (
                <div className="border-t border-border/20 pt-5">
                  <h3 className="font-semibold text-sm text-foreground mb-4">Implicit Grant and Hybrid Flows</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-accent/20 rounded-lg border border-border/30 flex items-center justify-between">
                      <span className="font-medium text-foreground">Access Tokens (Implicit flow)</span>
                      <Badge variant={app.web.implicitGrantSettings.enableAccessTokenIssuance ? "success" : "outline"}>
                        {app.web.implicitGrantSettings.enableAccessTokenIssuance ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="p-3 bg-accent/20 rounded-lg border border-border/30 flex items-center justify-between">
                      <span className="font-medium text-foreground">ID Tokens (Implicit flow)</span>
                      <Badge variant={app.web.implicitGrantSettings.enableIdTokenIssuance ? "success" : "outline"}>
                        {app.web.implicitGrantSettings.enableIdTokenIssuance ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 4. CREDENTIALS TAB */}
        {activeTab === "credentials" && (
          <div className="space-y-6">
            {isCredsLoading ? (
              <Card><CardContent className="py-12 text-center"><Skeleton className="h-8 w-32 mx-auto" /></CardContent></Card>
            ) : credHealth ? (
              <>
                {/* Health Header Badges */}
                <div className="flex gap-3 flex-wrap">
                  <Badge variant={credHealth.hasExpiredCredentials ? "danger" : "success"} className="text-xs px-3 py-1">
                    {credHealth.hasExpiredCredentials ? "Has Expired Credentials" : "All Credentials Valid"}
                  </Badge>
                  {credHealth.credentialsExpiringWithin30Days > 0 && (
                    <Badge variant="warning" className="text-xs px-3 py-1">
                      {credHealth.credentialsExpiringWithin30Days} Credentials expiring within 30 days
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs px-3 py-1">
                    Total: {credHealth.certificates.length} certificates / {credHealth.secrets.length} secrets
                  </Badge>
                </div>

                {/* Certificates */}
                {credHealth.certificates.length > 0 && (
                  <Card>
                    <CardHeader className="text-foreground font-semibold text-xs py-3 border-b border-border/20">
                      Certificate Credentials ({credHealth.certificates.length})
                    </CardHeader>
                    <CardContent className="py-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border/30 text-muted-foreground font-semibold">
                              <th className="py-2 pr-4">Display Name</th>
                              <th className="py-2 pr-4">Key ID</th>
                              <th className="py-2 pr-4">Start Date</th>
                              <th className="py-2 pr-4">Expiry Date</th>
                              <th className="py-2 pr-4">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/20">
                            {credHealth.certificates.map((cert) => (
                              <tr key={cert.keyId} className="hover:bg-accent/10">
                                <td className="py-3 pr-4 font-semibold text-foreground">{cert.displayName || "Unnamed Certificate"}</td>
                                <td className="py-3 pr-4 font-mono text-muted-foreground text-[10px] truncate max-w-[150px]">{cert.keyId}</td>
                                <td className="py-3 pr-4 text-muted-foreground">{formatDate(cert.startDateTime)}</td>
                                <td className={`py-3 pr-4 ${cert.isExpired ? "text-destructive font-medium" : cert.isExpiringSoon ? "text-warning font-medium" : "text-muted-foreground"}`}>
                                  {formatDate(cert.endDateTime)}
                                </td>
                                <td className="py-3 pr-4">
                                  {cert.isExpired ? (
                                    <Badge variant="danger" className="text-[10px] px-1.5 py-0">Expired</Badge>
                                  ) : cert.isExpiringSoon ? (
                                    <Badge variant="warning" className="text-[10px] px-1.5 py-0">{cert.daysUntilExpiry}d left</Badge>
                                  ) : (
                                    <Badge variant="success" className="text-[10px] px-1.5 py-0">Valid</Badge>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Client Secrets */}
                {credHealth.secrets.length > 0 && (
                  <Card>
                    <CardHeader className="text-foreground font-semibold text-xs py-3 border-b border-border/20">
                      Client Secrets ({credHealth.secrets.length})
                    </CardHeader>
                    <CardContent className="py-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border/30 text-muted-foreground font-semibold">
                              <th className="py-2 pr-4">Display Name</th>
                              <th className="py-2 pr-4">Hint</th>
                              <th className="py-2 pr-4">Start Date</th>
                              <th className="py-2 pr-4">Expiry Date</th>
                              <th className="py-2 pr-4">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/20">
                            {credHealth.secrets.map((secret) => (
                              <tr key={secret.keyId} className="hover:bg-accent/10">
                                <td className="py-3 pr-4 font-semibold text-foreground">{secret.displayName || "Unnamed Secret"}</td>
                                <td className="py-3 pr-4 font-mono text-muted-foreground text-[10px]">{secret.hint || "—"}</td>
                                <td className="py-3 pr-4 text-muted-foreground">{formatDate(secret.startDateTime)}</td>
                                <td className={`py-3 pr-4 ${secret.isExpired ? "text-destructive font-medium" : secret.isExpiringSoon ? "text-warning font-medium" : "text-muted-foreground"}`}>
                                  {formatDate(secret.endDateTime)}
                                </td>
                                <td className="py-3 pr-4">
                                  {secret.isExpired ? (
                                    <Badge variant="danger" className="text-[10px] px-1.5 py-0">Expired</Badge>
                                  ) : secret.isExpiringSoon ? (
                                    <Badge variant="warning" className="text-[10px] px-1.5 py-0">{secret.daysUntilExpiry}d left</Badge>
                                  ) : (
                                    <Badge variant="success" className="text-[10px] px-1.5 py-0">Valid</Badge>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {credHealth.certificates.length === 0 && credHealth.secrets.length === 0 && (
                  <Card className="text-center py-12">
                    <CardContent className="space-y-3">
                      <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto" />
                      <p className="text-sm font-semibold text-foreground">No credentials configured</p>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        This application has no uploaded certificates or generated secrets. Use client assertions or secrets to authenticate.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="text-center py-12"><CardContent>Unable to query security key metrics.</CardContent></Card>
            )}
          </div>
        )}

        {/* 5. TOKENS TAB */}
        {activeTab === "tokens" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="text-foreground font-semibold text-xs py-3 border-b border-border/20">Access Token Parameters</CardHeader>
              <CardContent className="space-y-2 py-4">
                <OverviewField label="Token Version Version" value={app.api?.requestedAccessTokenVersion === 2 ? "v2.0" : "v1.0 (Legacy)"} />
                <OverviewField label="Accept Mapped Claims" value={app.api?.acceptMappedClaims ? "Enabled" : "Disabled"} />
                <OverviewField label="App Token Encryption Key" value={app.tokenEncryptionKeyId ?? "None"} mono />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-foreground font-semibold text-xs py-3 border-b border-border/20">Client Access & Audience Scope</CardHeader>
              <CardContent className="space-y-4 py-4 text-xs">
                <OverviewField label="Configuration Audience" value={app.signInAudience} />
                <OverviewField label="Support Public Clients / Resource Flows" value={app.isFallbackPublicClient ? "Yes" : "No"} />
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Known Client Apps</p>
                  {app.api?.knownClientApplications && app.api.knownClientApplications.length > 0 ? (
                    <div className="space-y-1">
                      {app.api.knownClientApplications.map((cApp) => (
                        <div key={cApp} className="p-2 rounded bg-accent/40 font-mono text-[10px] truncate border border-border/30">{cApp}</div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No explicitly configured known client applications.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 6. PERMISSIONS TAB */}
        {activeTab === "permissions" && (
          <Card>
            <CardHeader className="text-foreground font-semibold text-xs py-3 border-b border-border/20">Required Resource API Access</CardHeader>
            <CardContent className="py-4">
              {isPermsLoading ? (
                <div className="space-y-2"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></div>
              ) : permissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border/30 text-muted-foreground font-semibold">
                        <th className="py-2 pr-4">API Resource</th>
                        <th className="py-2 pr-4">Delegated Permissions (Scopes)</th>
                        <th className="py-2 pr-4">Application Permissions (Roles)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {permissions.map((perm) => (
                        <tr key={perm.resourceAppId} className="hover:bg-accent/10 align-top">
                          <td className="py-3 pr-4">
                            <p className="font-semibold text-foreground">{perm.resourceDisplayName || "API / Endpoint Resource"}</p>
                            <p className="text-[9px] text-muted-foreground font-mono select-all truncate max-w-[150px] mt-0.5">{perm.resourceAppId}</p>
                          </td>
                          <td className="py-3 pr-4">
                            {perm.delegatedPermissions.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {perm.delegatedPermissions.map((dp) => (
                                  <Badge key={dp} variant="secondary" className="text-[10px] font-mono">{dp}</Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="py-3 pr-4">
                            {perm.applicationPermissions.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {perm.applicationPermissions.map((ap) => (
                                  <Badge key={ap} variant="outline" className="text-[10px] text-warning border-warning/30 bg-warning/5 font-mono">{ap}</Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic text-center py-6">No API resource permissions configured.</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* 7. EXPOSE AN API TAB */}
        {activeTab === "exposeApi" && (
          <Card>
            <CardHeader className="text-foreground font-semibold text-xs py-3 border-b border-border/20">Exposed Scopes & API Configurations</CardHeader>
            <CardContent className="py-4">
              {app.api?.oauth2PermissionScopes && app.api.oauth2PermissionScopes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border/30 text-muted-foreground font-semibold">
                        <th className="py-2 pr-4">Scope Name</th>
                        <th className="py-2 pr-4">Consent Level</th>
                        <th className="py-2 pr-4">Consent Display Name</th>
                        <th className="py-2 pr-4">Consent Description</th>
                        <th className="py-2 pr-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {app.api.oauth2PermissionScopes.map((scope) => (
                        <tr key={scope.id} className="hover:bg-accent/10 align-top">
                          <td className="py-3 pr-4 font-mono font-semibold text-primary">{scope.value}</td>
                          <td className="py-3 pr-4">
                            <Badge variant={scope.type === "Admin" ? "secondary" : "default"} className="text-[10px]">
                              {scope.type === "Admin" ? "Admin Only" : "User & Admin"}
                            </Badge>
                          </td>
                          <td className="py-3 pr-4">
                            <p className="font-medium text-foreground">{scope.adminConsentDisplayName ?? scope.userConsentDisplayName ?? "—"}</p>
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground leading-relaxed max-w-sm">
                            {scope.adminConsentDescription ?? scope.userConsentDescription ?? "—"}
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant={scope.isEnabled ? "success" : "outline"} className="text-[10px]">
                              {scope.isEnabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-muted-foreground italic">
                  No permission scopes are exposed under this API endpoint.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 8. MANIFEST TAB */}
        {activeTab === "manifest" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between text-foreground font-semibold text-xs py-3 border-b border-border/20">
              <span>Application JSON Manifest View</span>
              {manifest && (
                <button
                  onClick={() => copyToClipboard(JSON.stringify(manifest, null, 2), "manifestCopy")}
                  className="flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
                >
                  {copied === "manifestCopy" ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === "manifestCopy" ? "Copied" : "Copy Manifest JSON"}
                </button>
              )}
            </CardHeader>
            <CardContent className="py-4">
              {isManifestLoading ? (
                <div className="space-y-2"><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-full" /></div>
              ) : manifest ? (
                <pre className="p-4 rounded-lg bg-accent/40 border border-border/30 overflow-x-auto text-[10px] font-mono text-foreground leading-relaxed select-all max-h-[600px] overflow-y-auto">
                  {JSON.stringify(manifest, null, 2)}
                </pre>
              ) : (
                <p className="text-xs text-muted-foreground italic text-center py-6">Unable to display Graph Manifest data.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="w-3.5 h-3.5 mx-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  );
}
