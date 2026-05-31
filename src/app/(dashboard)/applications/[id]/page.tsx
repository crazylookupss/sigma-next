"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useServicePrincipal,
  useServicePrincipalOwners,
  useServicePrincipalAssignments,
  useServicePrincipalSsoConfig,
  useProtocolAnalysis,
  useProxyConfiguration,
} from "@/hooks/use-applications";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { OverviewField } from "@/components/shared/overview-field";
import {
  ArrowLeft,
  Shield,
  Copy,
  Check,
  Users,
  UserCheck,
  Key,
  Globe,
  Mail,
  FileCode,
  Settings,
  Server,
  Clock,
  Fingerprint,
  Lock,
  Unlock,
  FileSymlink,
  Network,
  Info,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Layers,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TabId = "overview" | "properties" | "owners" | "assignments" | "sso" | "proxy";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appIdOrId = params.id as string;

  // React Query Hooks
  const { data: sp, isLoading: spLoading, error: spError, refetch: refetchSp } = useServicePrincipal(appIdOrId);
  const { data: owners = [], isLoading: ownersLoading } = useServicePrincipalOwners(appIdOrId);
  const { data: assignments = [], isLoading: assignmentsLoading } = useServicePrincipalAssignments(appIdOrId);
  const { data: ssoConfig, isLoading: ssoConfigLoading } = useServicePrincipalSsoConfig(appIdOrId);
  const { data: protocolAnalysis, isLoading: protocolAnalysisLoading, error: protocolError, refetch: refetchProtocol } = useProtocolAnalysis(appIdOrId);
  const { data: proxyConfig, isLoading: proxyConfigLoading } = useProxyConfiguration(appIdOrId);

  // UI state
  const [activeTab, setActiveTab] = useState<TabId>("overview");
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

  const statusMap: Record<string, "active" | "warning" | "error"> = {
    active: "active",
    warning: "warning",
    error: "error",
  };

  const currentStatus = useMemo(() => {
    if (!sp) return "unknown";
    return sp.signInStatus?.toLowerCase() ?? "unknown";
  }, [sp]);

  // Initials generator
  const getInitials = (name?: string) => {
    if (!name) return "E";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 0) return "E";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Avatar colors
  const getAvatarColor = (name?: string) => {
    if (!name) return "bg-primary/20 text-primary";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      "bg-blue-500/20 text-blue-500",
      "bg-emerald-500/20 text-emerald-500",
      "bg-purple-500/20 text-purple-500",
      "bg-amber-500/20 text-amber-500",
      "bg-rose-500/20 text-rose-500",
      "bg-teal-500/20 text-teal-500",
      "bg-indigo-500/20 text-indigo-500",
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  if (spLoading) {
    return <ApplicationDetailSkeleton />;
  }

  if (spError || !sp) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center relative z-10">
        <div className="glass-card p-8 max-w-md">
          <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Details</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {(spError as Error)?.message ?? "Enterprise application not found"}
          </p>
          <Link
            href="/applications"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors inline-block"
          >
            ← Back to Enterprise Apps
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview" as TabId, label: "Overview", icon: Info },
    { id: "properties" as TabId, label: "Branding & Properties", icon: Settings },
    { id: "owners" as TabId, label: `Owners (${ownersLoading ? "..." : owners.length})`, icon: UserCheck },
    { id: "assignments" as TabId, label: `Users & Groups (${assignmentsLoading ? "..." : assignments.length})`, icon: Users },
    { id: "sso" as TabId, label: "Single Sign-On", icon: Key },
    { id: "proxy" as TabId, label: "Application Proxy", icon: Network },
  ];

  return (
    <div className="relative min-h-[85vh] z-10">
      {/* Background glow effects */}
      <div className="glow-sphere-1" />
      <div className="glow-sphere-2" />

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 mb-4 text-xs text-muted-foreground">
        <span>Directory</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/applications" className="hover:text-primary transition-colors">Enterprise Apps</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-primary font-semibold truncate max-w-[200px]">{sp.displayName}</span>
      </div>

      {/* Header Card */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <button
              onClick={() => router.push("/applications")}
              className="p-2 border border-border/40 rounded-lg hover:bg-accent transition-colors self-center text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-sm ${getAvatarColor(sp.displayName)}`}>
              {getInitials(sp.displayName)}
              <div className="absolute -bottom-1 -right-1">
                <StatusBadge status={statusMap[currentStatus] ?? "unknown"} />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground truncate">{sp.displayName}</h1>
                <Badge variant="default" className="text-[10px]">Enterprise App</Badge>
                <Badge variant="outline" className="text-[10px] capitalize">{sp.servicePrincipalType}</Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-1 select-all">{sp.appId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end md:self-center">
            <button
              onClick={() => {
                refetchSp();
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
              <span className="text-xs font-mono font-semibold text-foreground select-all truncate">{sp.appId}</span>
              <button onClick={() => copyToClipboard(sp.appId ?? "", "appId")} className="text-muted-foreground hover:text-foreground">
                {copied === "appId" ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Object ID</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-mono text-muted-foreground select-all truncate">{sp.id}</span>
              <button onClick={() => copyToClipboard(sp.id, "objId")} className="text-muted-foreground hover:text-foreground">
                {copied === "objId" ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Publisher Domain</p>
            <p className="text-xs font-semibold text-foreground mt-1 truncate">{sp.publisherName || "microsoft.onmicrosoft.com"}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Sign-In Audience</p>
            <Badge variant="secondary" className="text-[10px] mt-1 font-semibold">{sp.signInAudience || "AzureADMyOrg"}</Badge>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Created DateTime</p>
            <p className="text-xs font-semibold text-foreground mt-1">{formatDate(sp.createdDateTime)}</p>
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

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Column 1: Basic Information */}
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

              {/* Column 2: SSO & Integration */}
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

              {/* Column 3: Owners & Tags */}
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
                                {getInitials(owner.displayName)}
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
          )}

          {/* Properties tab */}
          {activeTab === "properties" && (
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
          )}

          {/* Owners tab */}
          {activeTab === "owners" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-border/20">
                <div>
                  <span className="text-foreground font-semibold text-xs">Assigned Application Owners</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-normal">Directory entities authorized to manage configuration settings for this application.</p>
                </div>
                {!ownersLoading && owners && (
                  <Badge variant="default" className="text-xs">{owners.length} Assigned</Badge>
                )}
              </CardHeader>
              <CardContent className="py-6">
                {ownersLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-14 w-full rounded-xl" />
                    ))}
                  </div>
                ) : !owners || owners.length === 0 ? (
                  <div className="text-center py-8">
                    <UserCheck className="w-12 h-12 text-muted-foreground/45 mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground">No Owners Assigned</p>
                    <p className="text-xs text-muted-foreground mt-1">This application has no configured owners. Global Admins can edit properties.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {owners.map((owner) => (
                      <div key={owner.id} className="p-4 rounded-xl border border-border bg-accent/15 flex items-center justify-between hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${getAvatarColor(owner.displayName)}`}>
                            {getInitials(owner.displayName)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{owner.displayName}</p>
                            <p className="text-xs text-muted-foreground truncate">{owner.userPrincipalName || owner.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                          <Badge variant="outline" className="text-xs capitalize py-0.5">
                            {owner.ownerType}
                          </Badge>
                          {owner.userPrincipalName && (
                            <a
                              href={`mailto:${owner.userPrincipalName}`}
                              className="p-1.5 rounded-lg bg-accent hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Users & Groups assignments tab */}
          {activeTab === "assignments" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-border/20">
                <div>
                  <span className="text-foreground font-semibold text-xs">Users & Groups Assignments</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-normal">Auditing accounts explicitly assigned access permissions to this enterprise application.</p>
                </div>
                {!assignmentsLoading && assignments && (
                  <Badge variant="default" className="text-xs">{assignments.length} Total Assignments</Badge>
                )}
              </CardHeader>
              <CardContent className="py-6">
                {assignmentsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                  </div>
                ) : !assignments || assignments.length === 0 ? (
                  <div className="text-center py-10">
                    <Users className="w-12 h-12 text-muted-foreground/45 mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground">No Explicit Assignments</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {sp.appRoleAssignmentRequired
                        ? "User assignment is required, but none are assigned. No one can log in."
                        : "User assignment is not required. Anyone in the directory can sign in."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border/85 bg-card">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          <th className="py-3 px-4">Identity Principal</th>
                          <th className="py-3 px-4">Principal Type</th>
                          <th className="py-3 px-4">Assigned App Role</th>
                          <th className="py-3 px-4">Assigned Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 text-sm">
                        {assignments.map((asg) => (
                          <tr key={asg.id} className="hover:bg-accent/10 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getAvatarColor(asg.principalDisplayName)}`}>
                                  {getInitials(asg.principalDisplayName)}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-foreground truncate">{asg.principalDisplayName}</p>
                                  <p className="text-xs text-muted-foreground truncate">{asg.principalId}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={asg.principalType === "Group" ? "secondary" : "outline"} className="text-xs py-0.5">
                                {asg.principalType}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 font-mono text-xs">
                              <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                                {asg.appRoleValue || "Default Access"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-xs text-muted-foreground">
                              {formatDate(asg.createdDateTime)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Single Sign-On configuration tab */}
          {activeTab === "sso" && (
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

                  // Loading state
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

                  // Not configured - only show when truly no SSO data exists
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

                  // Use detected protocol or fall back to preferredSingleSignOnMode
                  const protocol = ssoConfig?.detectedPrimaryProtocol?.toLowerCase() || mode;

                  // SAML
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
                                <OverviewField 
                                  label="Identifier (Entity ID)" 
                                  value={ssoConfig?.entityId || "Not configured"} 
                                  mono 
                                  copyable={!!ssoConfig?.entityId}
                                  onCopy={ssoConfig?.entityId ? () => copyToClipboard(ssoConfig.entityId!, "Entity ID") : undefined}
                                />
                                <OverviewField 
                                  label="Reply URL (Assertion Consumer Service URL)" 
                                  value={ssoConfig?.replyUrls?.[0] || "Not configured"} 
                                  mono 
                                  copyable={!!ssoConfig?.replyUrls?.[0]}
                                  onCopy={ssoConfig?.replyUrls?.[0] ? () => copyToClipboard(ssoConfig.replyUrls[0], "Reply URL") : undefined}
                                />
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
                                      ssoConfig.samlClaims.map((claim, idx) => (
                                        <tr key={idx} className="hover:bg-accent/10">
                                          <td className="py-2.5 px-3 text-foreground font-mono">{claim.namespace || claim.name.split('/').pop()}</td>
                                          <td className="py-2.5 px-3 text-muted-foreground font-mono">{claim.value}</td>
                                        </tr>
                                      ))
                                    ) : (
                                      <>
                                        <tr className="hover:bg-accent/10">
                                          <td className="py-2.5 px-3 text-foreground font-mono">givenname</td>
                                          <td className="py-2.5 px-3 text-muted-foreground font-mono">user.givenname</td>
                                        </tr>
                                        <tr className="hover:bg-accent/10">
                                          <td className="py-2.5 px-3 text-foreground font-mono">surname</td>
                                          <td className="py-2.5 px-3 text-muted-foreground font-mono">user.surname</td>
                                        </tr>
                                        <tr className="hover:bg-accent/10">
                                          <td className="py-2.5 px-3 text-foreground font-mono">emailaddress</td>
                                          <td className="py-2.5 px-3 text-muted-foreground font-mono">user.mail</td>
                                        </tr>
                                        <tr className="hover:bg-accent/10">
                                          <td className="py-2.5 px-3 text-foreground font-mono">name</td>
                                          <td className="py-2.5 px-3 text-muted-foreground font-mono">user.userprincipalname</td>
                                        </tr>
                                        <tr className="hover:bg-accent/10">
                                          <td className="py-2.5 px-3 text-foreground font-semibold">Unique User Identifier</td>
                                          <td className="py-2.5 px-3 text-primary font-mono">user.userprincipalname</td>
                                        </tr>
                                      </>
                                    )}
                                  </tbody>
                                </table>
                              </div>

                              {/* Group Membership Claims */}
                              {ssoConfig?.groupMembershipClaims && (
                                <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                                  <span className="text-[10px] font-semibold text-primary">Group Membership Claims: {ssoConfig.groupMembershipClaims}</span>
                                </div>
                              )}

                              {/* Optional Claims */}
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
                                  ssoConfig.certificates.map((cert) => {
                                    const isExpired = cert.endDateTime ? new Date(cert.endDateTime).getTime() < Date.now() : false;
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
                                                {copied === "Thumbprint" ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
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
                                    <Badge variant="secondary" className="text-[9px] py-0 px-1.5 font-bold">{ssoConfig?.certificates?.filter(c => c.endDateTime ? new Date(c.endDateTime).getTime() > Date.now() : true).length ?? 0}</Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Expired Certificates</span>
                                    <Badge variant="secondary" className="text-[9px] py-0 px-1.5 font-bold">{ssoConfig?.certificates?.filter(c => c.endDateTime ? new Date(c.endDateTime).getTime() <= Date.now() : false).length ?? 0}</Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  // OIDC
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
                                    const daysLeft = pw.endDateTime ? Math.round((new Date(pw.endDateTime).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
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

                  // Password
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

                  // Headers
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

                  // Linked
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

                  // Fallback
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
          )}

          {/* Protocol Analysis Section */}
          {activeTab === "sso" && (
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
                    onClick={() => refetchProtocol()}
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
                    <button onClick={() => refetchProtocol()} className="mt-3 text-xs text-primary hover:underline">Retry</button>
                  </div>
                ) : !protocolAnalysis ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Fingerprint className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-sm font-semibold text-foreground">Analysis Not Available</p>
                    <p className="text-xs text-muted-foreground mt-1">Protocol analysis data is not available for this application.</p>
                  </div>
                ) : (
                  <>
                    {/* Primary Protocol Card */}
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

                    {/* Other Detected Protocols */}
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

                    {/* Evidence Summary - Only show for primary protocol */}
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

                    {/* Governance Insights */}
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

                    {/* Analysis Metadata */}
                    <div className="flex items-center justify-between text-[9px] text-muted-foreground pt-2 border-t border-border/20">
                      <span>Analyzed: {new Date(protocolAnalysis.analysisTimestamp).toLocaleString()}</span>
                      <span>{protocolAnalysis.allEvidence.length} evidence signals across {protocolAnalysis.detectedProtocols.filter(d => d.isDetected).length} protocols</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Application Proxy Tab */}
          {activeTab === "proxy" && (
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
                    {/* Left Column URL Mappings */}
                    <div className="p-5 rounded-xl border border-border bg-accent/10 space-y-4">
                      <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-primary" />
                        URL Routing Endpoints
                      </h4>
                      <OverviewField label="Internal URL" value={proxyConfig.internalUrl || "Not configured"} mono copyable={!!proxyConfig.internalUrl} onCopy={proxyConfig.internalUrl ? () => copyToClipboard(proxyConfig.internalUrl!, "Internal URL") : undefined} />
                      <OverviewField label="External URL" value={proxyConfig.externalUrl || "Not configured"} mono copyable={!!proxyConfig.externalUrl} onCopy={proxyConfig.externalUrl ? () => copyToClipboard(proxyConfig.externalUrl!, "External URL") : undefined} />
                    </div>

                    {/* Right Column settings */}
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
          )}
        </motion.div>
      </AnimatePresence>

      {/* Floating Clipboard Copy Success absolute toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-card border border-primary/20 shadow-2xl backdrop-blur-xl flex items-center gap-3 max-w-sm"
          >
            <div className="w-8 h-8 rounded-full bg-success/20 text-success flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Clipboard Copied</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate font-mono max-w-[200px]">{copied}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ApplicationDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-24 rounded-2xl w-full" />
      <Skeleton className="h-14 rounded-xl w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  );
}
