"use client";

import { useParams } from "next/navigation";
import { useUser } from "@/hooks/use-users";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OverviewTab, IdentityTab, ContactTab, SecurityTab, LicensesTab } from "@/components/user-tabs";
import {
  ArrowLeft,
  Fingerprint,
  Copy,
  Mail,
  Activity,
  UserCheck,
  Briefcase,
  Award,
  Contact,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { getInitials } from "@/lib/utils";
import { useState, useCallback } from "react";
import { TabErrorBoundary } from "@/components/shared/error-boundary";

type TabId = "overview" | "identity" | "contact" | "security" | "licenses";

export default function UserDetailPage() {
  const params = useParams();
  const { data: user, isLoading, error } = useUser(params.id as string);

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(`Copied ${label} to clipboard!`);
  }, [triggerToast]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex gap-2 items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="glass-card p-6 flex flex-col md:flex-row items-center gap-6">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="flex-1 space-y-3 w-full">
            <Skeleton className="h-7 w-48 rounded" />
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-3 w-64 rounded" />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border/30">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} className="h-10 w-28 rounded-lg flex-shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] rounded-xl lg:col-span-1" />
          <Skeleton className="h-[400px] rounded-xl lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="glass-card p-8 max-w-md border-destructive/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-destructive/60" />
          <div className="w-12 h-12 text-destructive mx-auto mb-4 animate-bounce">⚠️</div>
          <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading User</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {(error as Error)?.message ?? "User directory attributes could not be resolved from Microsoft Entra ID."}
          </p>
          <Link
            href="/users"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/40 border border-border hover:bg-accent hover:text-foreground text-sm font-medium rounded-lg text-muted-foreground transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Users List
          </Link>
        </div>
      </div>
    );
  }

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <Activity className="w-4 h-4" /> },
    { id: "identity", label: "Identity & Org", icon: <UserCheck className="w-4 h-4" /> },
    { id: "contact", label: "Contact & Location", icon: <Contact className="w-4 h-4" /> },
    { id: "security", label: "Security & Sync", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "licenses", label: "Licenses & Extensions", icon: <Award className="w-4 h-4" /> },
  ];

  const tabProps = { user, copyToClipboard };

  return (
    <div className="relative z-10 space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-secondary text-foreground border border-border/80 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/users" className="hover:text-primary transition-colors">Identity</Link>
          <span className="w-3.5 h-3.5">›</span>
          <Link href="/users" className="hover:text-primary transition-colors">Users</Link>
          <span className="w-3.5 h-3.5">›</span>
          <span className="text-primary font-semibold truncate max-w-[200px]">{user.displayName}</span>
        </div>
        <Link
          href="/users"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-all duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Users List
        </Link>
      </div>

      <div className="glass-card p-6 relative overflow-hidden border border-border/40">
        <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-gradient-to-l from-primary/10 to-transparent pointer-events-none blur-3xl rounded-full" />
        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-primary via-purple-500 to-indigo-500 shadow-xl flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center text-3xl font-extrabold text-foreground select-none">
                {getInitials(user.displayName)}
              </div>
            </div>
            <span className={`absolute bottom-1.5 right-1.5 w-4.5 h-4.5 rounded-full border-2 border-secondary flex items-center justify-center shadow-lg ${
              user.accountEnabled ? "bg-success" : "bg-muted-foreground/60"
            }`} title={user.accountEnabled ? "Account Enabled" : "Account Disabled"}>
              {user.accountEnabled && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center text-center md:text-left space-y-2 min-w-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground truncate">
                {user.displayName}
              </h1>
              <Badge variant={user.accountEnabled ? "success" : "secondary"} className="h-5">
                {user.accountEnabled ? "Enabled" : "Disabled"}
              </Badge>
              {user.userType && (
                <Badge variant="outline" className="h-5 border-border bg-accent/20">
                  {user.userType}
                </Badge>
              )}
            </div>
            <p className="text-sm md:text-base font-semibold text-muted-foreground flex items-center justify-center md:justify-start gap-2">
              <Briefcase className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="truncate">{user.jobTitle ?? "No job title defined"}</span>
              {user.department && (
                <>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="truncate">{user.department}</span>
                </>
              )}
            </p>
            <p className="text-xs font-mono text-muted-foreground select-all break-all" title="User Principal Name">
              {user.userPrincipalName}
            </p>
          </div>

          <div className="flex flex-row md:flex-col justify-center gap-2 flex-shrink-0 md:border-l md:border-border/30 md:pl-6">
            <button
              onClick={() => copyToClipboard(user.userPrincipalName, "UPN")}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-accent/40 hover:bg-accent border border-border text-foreground hover:text-primary transition-all duration-150"
              title="Copy User Principal Name"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy UPN</span>
            </button>
            <button
              onClick={() => copyToClipboard(user.id, "Object ID")}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-accent/40 hover:bg-accent border border-border text-foreground hover:text-primary transition-all duration-150"
              title="Copy Object ID"
            >
              <Fingerprint className="w-3.5 h-3.5" />
              <span>Copy ID</span>
            </button>
            <a
              href={`mailto:${user.mail ?? user.userPrincipalName}`}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground transition-all duration-150"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Mail</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-border/30 pb-px">
        <nav className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex-shrink-0 border ${
                  isActive
                    ? "bg-primary/10 border-primary/20 text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/40"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TabErrorBoundary>
          {activeTab === "overview" && <OverviewTab {...tabProps} setActiveTab={(tab: string) => setActiveTab(tab as TabId)} />}
          {activeTab === "identity" && <IdentityTab {...tabProps} />}
          {activeTab === "contact" && <ContactTab {...tabProps} />}
          {activeTab === "security" && <SecurityTab {...tabProps} />}
          {activeTab === "licenses" && <LicensesTab {...tabProps} />}
        </TabErrorBoundary>
      </div>
    </div>
  );
}
