"use client";

import { useParams } from "next/navigation";
import { useUser } from "@/hooks/use-users";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Fingerprint,
  Building2,
  Contact,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  User as UserIcon,
  Mail,
  Copy,
  Check,
  Briefcase,
  MapPin,
  Layers,
  Award,
  Info,
  ChevronRight,
  Shield,
  Activity,
  UserCheck,
  FileSpreadsheet
} from "lucide-react";
import Link from "next/link";
import { getInitials, formatDate } from "@/lib/utils";
import { useState } from "react";

export default function UserDetailPage() {
  const params = useParams();
  const { data: user, isLoading, error } = useUser(params.id as string);
  
  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<"overview" | "identity" | "contact" | "security" | "licenses">("overview");

  // Extension Attributes display preference
  const [showConfiguredOnly, setShowConfiguredOnly] = useState(true);

  // In-page Toast / Alert state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(`Copied ${label} to clipboard!`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="flex gap-2 items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        {/* Hero Header Skeleton */}
        <div className="glass-card p-6 flex flex-col md:flex-row items-center gap-6">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="flex-1 space-y-3 w-full">
            <Skeleton className="h-7 w-48 rounded" />
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-3 w-64 rounded" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
        {/* Tab Selection Bar Skeleton */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border/30">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} className="h-10 w-28 rounded-lg flex-shrink-0" />
          ))}
        </div>
        {/* Tab Content skeleton */}
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
          <UserIcon className="w-12 h-12 text-destructive mx-auto mb-4 animate-bounce" />
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

  // Extract directory extension attributes
  const extAttrs = user.onPremisesExtensionAttributes;
  const extensionList = Array.from({ length: 15 }, (_, i) => {
    const key = `extensionAttribute${i + 1}` as keyof typeof extAttrs;
    const value = extAttrs ? extAttrs[key] : null;
    return { name: `extensionAttribute${i + 1}`, value };
  });
  const configuredExtensions = extensionList.filter(ext => ext.value !== null && ext.value !== undefined && ext.value !== "");

  // Render tab selector
  const tabs: { id: typeof activeTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <Activity className="w-4 h-4" /> },
    { id: "identity", label: "Identity & Org", icon: <UserCheck className="w-4 h-4" /> },
    { id: "contact", label: "Contact & Location", icon: <Contact className="w-4 h-4" /> },
    { id: "security", label: "Security & Sync", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "licenses", label: "Licenses & Extensions", icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className="relative z-10 space-y-6">
      {/* Floating Alert / Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-secondary text-foreground border border-border/80 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/users" className="hover:text-primary transition-colors">Identity</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/users" className="hover:text-primary transition-colors">Users</Link>
          <ChevronRight className="w-3.5 h-3.5" />
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

      {/* Hero Header Section */}
      <div className="glass-card p-6 relative overflow-hidden border border-border/40">
        <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-gradient-to-l from-primary/10 to-transparent pointer-events-none blur-3xl rounded-full" />
        
        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6">
          {/* Avatar Ring */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-primary via-purple-500 to-indigo-500 shadow-xl flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center text-3xl font-extrabold text-foreground select-none">
                {getInitials(user.displayName)}
              </div>
            </div>
            {/* Status Pulse badge */}
            <span className={`absolute bottom-1.5 right-1.5 w-4.5 h-4.5 rounded-full border-2 border-secondary flex items-center justify-center shadow-lg ${
              user.accountEnabled ? "bg-success" : "bg-muted-foreground/60"
            }`} title={user.accountEnabled ? "Account Enabled" : "Account Disabled"}>
              {user.accountEnabled && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </span>
          </div>

          {/* User Meta Information */}
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

          {/* Header Actions */}
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

      {/* Elegant sliding navigation tab bar */}
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

      {/* Tab Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === "overview" && (
          <>
            {/* Left side column: Summary metrics & info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Highlight KPI metrics row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-accent/20 border-border/30 hover:border-border transition-colors">
                  <CardContent className="p-4 space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Directory Status</span>
                    <Badge variant={user.accountEnabled ? "success" : "secondary"}>
                      {user.accountEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="bg-accent/20 border-border/30 hover:border-border transition-colors">
                  <CardContent className="p-4 space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">User Type</span>
                    <span className="text-sm font-bold text-foreground">{user.userType ?? "Member"}</span>
                  </CardContent>
                </Card>

                <Card className="bg-accent/20 border-border/30 hover:border-border transition-colors">
                  <CardContent className="p-4 space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Last Sign-In</span>
                    <span className="text-sm font-bold text-foreground truncate block">
                      {user.signInActivity?.lastSignInDateTime ? formatDate(user.signInActivity.lastSignInDateTime) : "None recorded"}
                    </span>
                  </CardContent>
                </Card>

                <Card className="bg-accent/20 border-border/30 hover:border-border transition-colors">
                  <CardContent className="p-4 space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Office Location</span>
                    <span className="text-sm font-bold text-foreground truncate block">{user.officeLocation ?? "—"}</span>
                  </CardContent>
                </Card>
              </div>

              {/* Core Details Inspector card */}
              <Card className="border-border/30 bg-card">
                <CardHeader className="pb-3 border-b border-border/30">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    Identity Core Highlights
                  </h3>
                </CardHeader>
                <CardContent className="p-4 space-y-0.5">
                  <FieldItem label="User Principal Name (UPN)" value={user.userPrincipalName} copyable />
                  <FieldItem label="Directory Object ID" value={user.id} copyable mono />
                  <FieldItem label="Mail Nickname" value={user.mailNickname} />
                  <FieldItem label="User Type / Creation" value={`${user.userType ?? "Member"} (${user.creationType ?? "Direct"})`} />
                  <FieldItem label="Preferred Language" value={user.preferredLanguage} />
                  <FieldItem label="Created Date" value={formatDate(user.createdDateTime)} />
                </CardContent>
              </Card>
            </div>

            {/* Right side column: Hierarchy context card */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Organization Hierarchy Card */}
              <Card className="border-border/30 bg-card overflow-hidden">
                <CardHeader className="pb-3 border-b border-border/30">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-500" />
                    Reporting Structure
                  </h3>
                </CardHeader>
                <CardContent className="p-5 space-y-6">
                  {user.manager ? (
                    <div className="space-y-4">
                      <span className="text-xs font-semibold text-muted-foreground block">Direct Manager</span>
                      
                      {/* Manager Profile widget */}
                      <div className="p-4 rounded-xl border border-border/40 bg-accent/10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {getInitials(user.manager.displayName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{user.manager.displayName}</p>
                          <p className="text-[11px] font-mono text-muted-foreground truncate select-all">{user.manager.userPrincipalName}</p>
                        </div>
                      </div>

                      {/* Navigation Link */}
                      <Link
                        href={`/users/${user.manager.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                      >
                        <span>View Manager Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-2">
                      <UserIcon className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                      <p className="text-sm font-bold text-muted-foreground">No manager defined</p>
                      <p className="text-xs text-muted-foreground/75">This user sits at the root or Manager attribute is not configured in Microsoft Entra.</p>
                    </div>
                  )}

                  {/* License Quick-Summary Indicator */}
                  <div className="border-t border-border/30 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-muted-foreground">Licenses & Subscriptions</span>
                      <span className="text-xs font-bold text-foreground">
                        {user.assignedLicenses ? user.assignedLicenses.length : 0} assigned
                      </span>
                    </div>
                    {user.assignedLicenses && user.assignedLicenses.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {user.assignedLicenses.slice(0, 3).map((lic, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                            {lic.skuPartNumber ?? lic.skuId.slice(0, 8)}
                          </span>
                        ))}
                        {user.assignedLicenses.length > 3 && (
                          <button
                            onClick={() => setActiveTab("licenses")}
                            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-secondary hover:bg-accent border border-border text-muted-foreground hover:text-foreground transition-colors"
                          >
                            +{user.assignedLicenses.length - 3} more
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground/70 italic">No direct license assignments detected.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* ================= TAB 2: IDENTITY & ORG ================= */}
        {activeTab === "identity" && (
          <>
            {/* Identity Profile Details card */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border/30 bg-card">
                <CardHeader className="pb-3 border-b border-border/30">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-indigo-500" />
                    Advanced Identity Profile
                  </h3>
                </CardHeader>
                <CardContent className="p-4 space-y-0.5">
                  <FieldItem label="Given (First) Name" value={user.givenName} />
                  <FieldItem label="Surname (Last Name)" value={user.surname} />
                  <FieldItem label="Mail Nickname" value={user.mailNickname} />
                  <FieldItem label="User Principal Name (UPN)" value={user.userPrincipalName} copyable />
                  <FieldItem label="Creation Type" value={user.creationType} />
                  <FieldItem label="Directory Registration" value={user.externalUserState ? `External State: ${user.externalUserState}` : "Internal Tenant Member"} />
                </CardContent>
              </Card>

              {/* Directory Identities list */}
              {user.identities && user.identities.length > 0 && (
                <Card className="border-border/30 bg-card">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-sky-500" />
                      Sign-in Identities & Providers
                    </h3>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {user.identities.map((identity, idx) => (
                      <div key={idx} className="p-3.5 bg-accent/20 border border-border/40 rounded-xl text-xs space-y-2 hover:border-border transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary uppercase text-[10px] tracking-wider">Identity Source {idx + 1}</span>
                          <Badge variant="outline" className="text-[10px] font-semibold border-primary/20 bg-primary/5 text-primary">
                            {identity.signInType ?? "EmailAddress"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground pt-1 border-t border-border/20">
                          <div>
                            <span className="font-medium text-foreground mr-1 block text-[10px] uppercase">Issuer Domain:</span>
                            <span className="font-mono text-foreground/90">{identity.issuer ?? "—"}</span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground mr-1 block text-[10px] uppercase">Assigned ID:</span>
                            <span className="font-mono text-foreground/90 select-all">{identity.issuerAssignedId ?? "—"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right column: Job details */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-border/30 bg-card">
                <CardHeader className="pb-3 border-b border-border/30">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-500" />
                    Job & Organization Details
                  </h3>
                </CardHeader>
                <CardContent className="p-4 space-y-0.5">
                  <FieldItem label="Job Title" value={user.jobTitle} />
                  <FieldItem label="Department" value={user.department} />
                  <FieldItem label="Company Name" value={user.companyName} />
                  <FieldItem label="Employee Identifier" value={user.employeeId} copyable mono />
                  <FieldItem label="Employee Type" value={user.employeeType} />
                  <FieldItem label="Hire Date" value={formatDate(user.employeeHireDate)} />
                  <FieldItem label="Manager" value={user.manager?.displayName} />
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* ================= TAB 3: CONTACT & LOCATION ================= */}
        {activeTab === "contact" && (
          <>
            {/* Contact Methods card */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border/30 bg-card">
                <CardHeader className="pb-3 border-b border-border/30">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    Contact Channels
                  </h3>
                </CardHeader>
                <CardContent className="p-4 space-y-0.5">
                  <FieldItem label="Primary Directory Mail" value={user.mail} copyable />
                  <FieldItem label="User Principal Name" value={user.userPrincipalName} copyable />
                  <FieldItem label="Mobile Number" value={user.mobilePhone} copyable />
                  <FieldItem label="Business Phone" value={user.businessPhone} copyable />
                  
                  {user.businessPhones && user.businessPhones.length > 0 && (
                    <div className="py-2.5 border-b border-border/30">
                      <span className="text-xs text-muted-foreground block mb-1">Alternative Business Phones</span>
                      <div className="flex flex-wrap gap-1.5">
                        {user.businessPhones.map((phone, idx) => (
                          <Badge key={idx} variant="outline" className="font-mono text-xs select-all bg-accent/20">
                            {phone}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.otherMails && user.otherMails.length > 0 && (
                    <div className="py-2.5 border-b border-border/30">
                      <span className="text-xs text-muted-foreground block mb-1">Other Configured Emails</span>
                      <div className="flex flex-wrap gap-1.5">
                        {user.otherMails.map((email, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs select-all bg-accent/20 text-primary">
                            {email}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.proxyAddresses && user.proxyAddresses.length > 0 && (
                    <div className="py-2.5">
                      <span className="text-xs text-muted-foreground block mb-1">Directory Proxy Addresses (Alias)</span>
                      <div className="grid grid-cols-1 gap-1 max-h-[150px] overflow-y-auto pr-1">
                        {user.proxyAddresses.map((proxy, idx) => {
                          const isPrimary = proxy.startsWith("SMTP:");
                          return (
                            <div key={idx} className="flex justify-between items-center text-xs p-1.5 rounded bg-accent/20 border border-border/20">
                              <span className={`font-mono truncate select-all ${isPrimary ? "text-success font-bold" : "text-muted-foreground"}`}>
                                {proxy}
                              </span>
                              <Badge variant={isPrimary ? "success" : "secondary"} className="text-[9px] h-4 uppercase">
                                {isPrimary ? "Primary" : "Alias"}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Geographical Office layout */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-border/30 bg-card overflow-hidden">
                <CardHeader className="pb-3 border-b border-border/30">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    Physical Office & Location
                  </h3>
                </CardHeader>
                <CardContent className="p-4 space-y-0.5">
                  <FieldItem label="Office Name" value={user.officeLocation} />
                  <FieldItem label="Street Address" value={user.streetAddress} />
                  <FieldItem label="City" value={user.city} />
                  <FieldItem label="State / Province" value={user.state} />
                  <FieldItem label="Postal / ZIP Code" value={user.postalCode} mono />
                  <FieldItem label="Country / Region" value={user.country} />
                </CardContent>
                {/* Mock Visual Map Widget */}
                <div className="bg-accent/10 border-t border-border/30 p-5 text-center space-y-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
                  <MapPin className="w-7 h-7 text-primary/40 mx-auto animate-bounce" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground">
                      {user.officeLocation ?? "Remote Work"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {user.city || user.country ? `${user.city ?? ""}, ${user.country ?? ""}` : "No physical address mapped"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* ================= TAB 4: SECURITY & HYBRID SYNC ================= */}
        {activeTab === "security" && (
          <>
            {/* Password Policy card */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border/30 bg-card">
                <CardHeader className="pb-3 border-b border-border/30">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-rose-500" />
                    Security Profile & Policies
                  </h3>
                </CardHeader>
                <CardContent className="p-4 space-y-0.5">
                  <div className="flex justify-between items-center py-2.5 border-b border-border/30">
                    <span className="text-xs text-muted-foreground">Account Status</span>
                    <Badge variant={user.accountEnabled ? "success" : "secondary"}>
                      {user.accountEnabled ? "Active Sign-In Allowed" : "Sign-In Disabled"}
                    </Badge>
                  </div>
                  <FieldItem label="Last Password Change" value={formatDate(user.lastPasswordChangeDateTime)} />
                  <FieldItem label="Active Sessions Valid From" value={formatDate(user.signInSessionsValidFromDateTime)} />
                  <FieldItem label="Password Policy Flags" value={user.passwordPolicies || "Standard User Policy (None set)"} />
                </CardContent>
              </Card>
            </div>

            {/* Hybrid Sync detail card */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-border/30 bg-card">
                <CardHeader className="pb-3 border-b border-border/30">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-cyan-500" />
                    On-Premises Hybrid Sync
                  </h3>
                </CardHeader>
                <CardContent className="p-4 space-y-0.5">
                  <div className="flex justify-between items-center py-2.5 border-b border-border/30">
                    <span className="text-xs text-muted-foreground">Directory Source</span>
                    <Badge variant={user.onPremisesSyncEnabled ? "secondary" : "outline"} className={user.onPremisesSyncEnabled ? "border-cyan-500/20 bg-cyan-500/5 text-cyan-500" : ""}>
                      {user.onPremisesSyncEnabled ? "Active AD Sync" : "Cloud-Only User"}
                    </Badge>
                  </div>
                  <FieldItem label="SAM Account Name" value={user.onPremisesSamAccountName} mono copyable />
                  <FieldItem label="Security Identifier (SID)" value={user.onPremisesSecurityIdentifier} mono copyable />
                  <FieldItem label="Sync Domain" value={user.onPremisesDomainName} />
                  <FieldItem label="On-Premises UPN" value={user.onPremisesUserPrincipalName} mono />
                  <FieldItem label="Last Active Sync" value={formatDate(user.onPremisesLastSyncDateTime)} />
                  {user.onPremisesDistinguishedName && (
                    <div className="py-2.5">
                      <span className="text-xs text-muted-foreground block mb-1">Distinguished Name (DN)</span>
                      <p className="text-[10px] font-mono bg-accent/20 p-2 border border-border/30 rounded-lg text-foreground break-all select-all leading-relaxed">
                        {user.onPremisesDistinguishedName}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* ================= TAB 5: LICENSES & EXTENSIONS ================= */}
        {activeTab === "licenses" && (
          <>
            {/* Assigned Licenses list */}
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

                  {/* Service Plans section */}
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

            {/* Active Extension Attributes card */}
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
                  
                  {/* Selected Extensions rendering */}
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
        )}

      </div>
    </div>
  );
}

// Field Row component
function FieldItem({
  label,
  value,
  copyable = false,
  mono = false,
}: {
  label: string;
  value?: string | null;
  copyable?: boolean;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-border/30 last:border-b-0">
      <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">{label}</span>
      <div className="flex items-center gap-1.5 mt-1 sm:mt-0 max-w-full sm:max-w-[70%]">
        <span className={`text-xs font-semibold text-foreground select-all truncate ${
          mono ? "font-mono text-muted-foreground/90 bg-accent/20 px-1.5 py-0.5 rounded border border-border/10" : ""
        }`}>
          {value ?? "—"}
        </span>
        {copyable && value && (
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            title={`Copy ${label}`}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-success" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// Custom Extension Attribute Widget
function ExtensionAttributeWidget({
  name,
  value,
  copyable = false,
  copyHelper
}: {
  name: string;
  value: string | null;
  copyable?: boolean;
  copyHelper?: (text: string, label: string) => void;
}) {
  const isSet = value !== null && value !== undefined && value !== "";
  
  return (
    <div className={`p-2.5 rounded-lg border text-xs flex justify-between items-center transition-all ${
      isSet 
        ? "bg-primary/5 border-primary/20 text-foreground" 
        : "bg-accent/5 border-border/15 text-muted-foreground opacity-65"
    }`}>
      <div className="min-w-0 pr-2">
        <span className={`font-mono text-[9px] block uppercase ${isSet ? "text-primary/75 font-bold" : "text-muted-foreground/60"}`}>
          {name.replace("extensionAttribute", "Attr ")}
        </span>
        <span className={`font-medium block truncate ${isSet ? "text-foreground font-semibold" : "italic text-muted-foreground/50"}`}>
          {value ?? "Not configured"}
        </span>
      </div>
      {copyable && value && copyHelper && (
        <button
          onClick={() => copyHelper(value, name)}
          className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
          title={`Copy ${name}`}
        >
          <Copy className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
