"use client";

import { useParams, useRouter } from "next/navigation";
import { getInitials, getAvatarColor } from "@/lib/utils";
import {
  useServicePrincipal,
  useServicePrincipalOwners,
  useServicePrincipalAssignments,
  useServicePrincipalSsoConfig,
  useProtocolAnalysis,
  useProxyConfiguration,
} from "@/hooks/use-applications";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { OverviewTab, PropertiesTab, OwnersTab, AssignmentsTab, SsoTab, ProxyTab } from "@/components/app-tabs";
import {
  ArrowLeft,
  Shield,
  Copy,
  Check,
  RefreshCw,
  Info,
  Settings,
  UserCheck,
  Users,
  Key,
  Network,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TabErrorBoundary } from "@/components/shared/error-boundary";

type TabId = "overview" | "properties" | "owners" | "assignments" | "sso" | "proxy";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appIdOrId = params.id as string;

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [copied, setCopied] = useState<string | null>(null);

  const { data: sp, isLoading: spLoading, error: spError, refetch: refetchSp } = useServicePrincipal(appIdOrId);
  const { data: owners = [], isLoading: ownersLoading } = useServicePrincipalOwners(appIdOrId, activeTab === "owners" || activeTab === "overview");
  const { data: assignments = [], isLoading: assignmentsLoading } = useServicePrincipalAssignments(appIdOrId, activeTab === "assignments");
  const { data: ssoConfig, isLoading: ssoConfigLoading } = useServicePrincipalSsoConfig(appIdOrId, activeTab === "sso");
  const { data: protocolAnalysis, isLoading: protocolAnalysisLoading, error: protocolError, refetch: refetchProtocol } = useProtocolAnalysis(appIdOrId, activeTab === "sso");
  const { data: proxyConfig, isLoading: proxyConfigLoading } = useProxyConfiguration(appIdOrId, activeTab === "proxy");

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  }, []);

  const statusMap: Record<string, "active" | "warning" | "error"> = {
    active: "active",
    warning: "warning",
    error: "error",
  };

  const currentStatus = useMemo(() => {
    if (!sp) return "unknown";
    return sp.signInStatus?.toLowerCase() ?? "unknown";
  }, [sp]);

  // getInitials and getAvatarColor imported from @/lib/utils

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

  const tabProps = { sp, ssoConfig, owners, assignments, protocolAnalysis, proxyConfig, copyToClipboard, copied };

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
      <div className="glow-sphere-1" />
      <div className="glow-sphere-2" />

      <div className="flex items-center gap-1 mb-4 text-xs text-muted-foreground">
        <span>Directory</span>
        <span className="w-3.5 h-3.5">›</span>
        <Link href="/applications" className="hover:text-primary transition-colors">Enterprise Apps</Link>
        <span className="w-3.5 h-3.5">›</span>
        <span className="text-primary font-semibold truncate max-w-[200px]">{sp.displayName}</span>
      </div>

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
              onClick={() => refetchSp()}
              className="p-2 rounded-lg border border-border/40 hover:bg-accent text-muted-foreground transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

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

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <TabErrorBoundary>
            {activeTab === "overview" && <OverviewTab {...tabProps} ownersLoading={ownersLoading} proxyConfigLoading={proxyConfigLoading} />}
            {activeTab === "properties" && <PropertiesTab {...tabProps} />}
            {activeTab === "owners" && <OwnersTab {...tabProps} ownersLoading={ownersLoading} />}
            {activeTab === "assignments" && <AssignmentsTab {...tabProps} assignmentsLoading={assignmentsLoading} />}
            {activeTab === "sso" && <SsoTab {...tabProps} ssoConfigLoading={ssoConfigLoading} protocolAnalysisLoading={protocolAnalysisLoading} protocolError={protocolError} refetchProtocol={refetchProtocol} />}
            {activeTab === "proxy" && <ProxyTab {...tabProps} proxyConfigLoading={proxyConfigLoading} />}
          </TabErrorBoundary>
        </motion.div>
      </AnimatePresence>

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
