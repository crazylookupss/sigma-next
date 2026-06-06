"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { ColDef } from "ag-grid-community";
import "@/lib/ag-grid-modules";
import { useGovernanceFindings } from "@/hooks/use-governance";
import { governanceService } from "@/services/governance";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShieldAlert,
  BellRing,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Users,
  KeyRound,
  FileKey,
  AlertCircle,
  CircleOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AgGridReact = dynamic<any>(
  () => import("ag-grid-react").then((m) => m.AgGridReact),
  { ssr: false }
);

interface GovernanceFinding {
  id: string;
  category: "Credentials" | "Ownership" | "Protocol" | "Configuration" | "Security" | "Compliance";
  severity: "Critical" | "Warning" | "Info";
  title: string;
  description: string;
  entityType: string;
  entityId: string;
  entityName: string;
  actionUrl: string;
}

import { useQueryClient } from "@tanstack/react-query";

export default function GovernanceFindingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useGovernanceFindings();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"ownerless-apps" | "ownerless-groups" | "expired-secrets" | "expiring-secrets" | "mfa-users" | "empty-stale-groups">("ownerless-apps");
  
  // Custom toast notification state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "info" }>({
    show: false,
    message: "",
    type: "success"
  });

  const findings = useMemo<GovernanceFinding[]>(() => {
    return (data?.findings ?? []) as GovernanceFinding[];
  }, [data]);

  // Locally filtered finding datasets for peak memory and runtime performance
  const ownerlessApps = useMemo(() => {
    return findings.filter(f => f.category === "Ownership" && f.entityType === "Application");
  }, [findings]);

  const ownerlessGroups = useMemo(() => {
    return findings.filter(f => f.category === "Ownership" && f.entityType === "Group");
  }, [findings]);

  const expiredSecrets = useMemo(() => {
    return findings.filter(f => f.category === "Credentials" && f.severity === "Critical");
  }, [findings]);

  const expiringSecrets = useMemo(() => {
    return findings.filter(f => f.category === "Credentials" && f.severity === "Warning");
  }, [findings]);

  const mfaUsers = useMemo(() => {
    // Combine MFA findings, stale users and conditional access / general warnings
    return findings.filter(f => f.category === "Security" || f.category === "Configuration");
  }, [findings]);

  const emptyStaleGroups = useMemo(() => {
    return findings.filter(f => f.category === "Compliance" && f.entityType === "Group");
  }, [findings]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Force a fresh backend scan (bypasses 2-min API cache)
      await governanceService.getFindings(true);
      // Invalidate React Query cache so refetch gets fresh data
      await queryClient.invalidateQueries({ queryKey: ["governance", "findings"] });
      showToast("Real-time governance analysis completed successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to refresh governance data.", "info");
    } finally {
      setIsRefreshing(false);
    }
  };

  const showToast = useCallback((message: string, type: "success" | "info" = "success") => {
    setToast({ show: true, message, type });
  }, []);

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.show]);

  const handleNotify = (finding: GovernanceFinding) => {
    let recipient = "Global Administrators";
    if (finding.entityType === "Group") {
      recipient = `IT Security & Owner group`;
    } else if (finding.entityType === "Application") {
      recipient = `Application Registration Owners`;
    } else if (finding.entityType === "User") {
      recipient = `User: ${finding.entityName} and their Manager`;
    } else if (finding.entityType === "System") {
      recipient = `SIGMA Security Engineering Team`;
    }

    showToast(`Notification sent successfully to ${recipient} regarding '${finding.title}'!`, "success");
  };

  // Shared column renderer configurations
  const actionColumn: ColDef<GovernanceFinding> = {
    headerName: "Audit Action",
    field: "id",
    width: 140,
    sortable: false,
    filter: false,
    cellRenderer: (params: { data: GovernanceFinding }) => {
      if (!params.data) return null;
      return (
        <div className="flex items-center justify-center h-full w-full">
          <button
            onClick={() => handleNotify(params.data)}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 text-amber-500 text-[10px] font-bold border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 transition-all active:scale-95 duration-200"
          >
            <BellRing size={12} className="animate-pulse" />
            Notify
          </button>
        </div>
      );
    }
  };

  const entityNameColumn: ColDef<GovernanceFinding> = {
    headerName: "Target Name",
    field: "entityName",
    width: 250,
    cellRenderer: (params: { data: GovernanceFinding }) => {
      if (!params.data) return null;
      // For diagnostic warnings, click does not redirect to Entra resource
      if (params.data.entityType === "System") {
        return <span className="font-semibold text-muted-foreground">{params.data.entityName}</span>;
      }
      return (
        <div 
          onClick={() => router.push(params.data.actionUrl)}
          className="flex items-center gap-2 font-semibold text-primary cursor-pointer hover:underline"
        >
          <span className="truncate">{params.data.entityName}</span>
          <ExternalLink size={10} className="opacity-50" />
        </div>
      );
    }
  };

  const severityColumn: ColDef<GovernanceFinding> = {
    headerName: "Severity",
    field: "severity",
    width: 110,
    cellRenderer: (params: { value: string }) => {
      const isCritical = params.value === "Critical";
      const isWarning = params.value === "Warning";
      return (
        <Badge variant={isCritical ? "default" : isWarning ? "secondary" : "outline"} className={
          isCritical ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" :
          isWarning ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" :
          "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
        }>
          {params.value}
        </Badge>
      );
    }
  };

  const defaultColDef = useMemo(() => ({
    resizable: true,
    cellStyle: { display: "flex", alignItems: "center" },
  }), []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle className="w-12 h-12 text-warning/50 mb-4" />
        <p className="text-sm font-semibold text-foreground">Failed to Load Governance Findings</p>
        <p className="text-xs text-muted-foreground mt-1">Unable to compile governance findings data.</p>
        <button onClick={() => refetch()} className="mt-3 text-xs text-primary hover:underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Premium Success Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-success/30 bg-background/95 shadow-lg shadow-success/5 backdrop-blur-md"
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="text-success w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="text-info w-5 h-5 shrink-0" />
            )}
            <span className="text-xs font-semibold text-foreground max-w-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Governance Findings</h1>
          <p className="text-xs text-muted-foreground">
            Aggregate and remediate critical security & ownership issues across your Entra ID tenant
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Analyze Now
        </button>
      </div>

      {/* Audit Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card 
          onClick={() => setActiveTab("ownerless-apps")}
          className={`cursor-pointer hover:border-primary/50 transition-all border ${activeTab === "ownerless-apps" ? "border-primary bg-primary/5 shadow-md shadow-primary/5" : "border-border/30"}`}
        >
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-foreground">{ownerlessApps.length}</p>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium flex items-center justify-center gap-1">
              <ShieldAlert size={10} className="text-red-500" /> Ownerless Apps
            </p>
          </CardContent>
        </Card>
        <Card 
          onClick={() => setActiveTab("ownerless-groups")}
          className={`cursor-pointer hover:border-primary/50 transition-all border ${activeTab === "ownerless-groups" ? "border-primary bg-primary/5 shadow-md shadow-primary/5" : "border-border/30"}`}
        >
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-foreground">{ownerlessGroups.length}</p>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium flex items-center justify-center gap-1">
              <Users size={10} className="text-red-500" /> Ownerless Groups
            </p>
          </CardContent>
        </Card>
        <Card 
          onClick={() => setActiveTab("expired-secrets")}
          className={`cursor-pointer hover:border-primary/50 transition-all border ${activeTab === "expired-secrets" ? "border-primary bg-primary/5 shadow-md shadow-primary/5" : "border-border/30"}`}
        >
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-error">{expiredSecrets.length}</p>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium flex items-center justify-center gap-1">
              <FileKey size={10} className="text-red-500" /> Expired Secrets
            </p>
          </CardContent>
        </Card>
        <Card 
          onClick={() => setActiveTab("expiring-secrets")}
          className={`cursor-pointer hover:border-primary/50 transition-all border ${activeTab === "expiring-secrets" ? "border-primary bg-primary/5 shadow-md shadow-primary/5" : "border-border/30"}`}
        >
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-warning">{expiringSecrets.length}</p>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium flex items-center justify-center gap-1">
              <KeyRound size={10} className="text-amber-500" /> Expiring Secrets
            </p>
          </CardContent>
        </Card>
        <Card 
          onClick={() => setActiveTab("mfa-users")}
          className={`cursor-pointer hover:border-primary/50 transition-all border ${activeTab === "mfa-users" ? "border-primary bg-primary/5 shadow-md shadow-primary/5" : "border-border/30"}`}
        >
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-info">{mfaUsers.length}</p>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium flex items-center justify-center gap-1">
              <UserCheck size={10} className="text-blue-500" /> Stale & MFA-Deficient
            </p>
          </CardContent>
        </Card>
        <Card 
          onClick={() => setActiveTab("empty-stale-groups")}
          className={`cursor-pointer hover:border-primary/50 transition-all border ${activeTab === "empty-stale-groups" ? "border-primary bg-primary/5 shadow-md shadow-primary/5" : "border-border/30"}`}
        >
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-muted-foreground">{emptyStaleGroups.length}</p>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium flex items-center justify-center gap-1">
              <CircleOff size={10} className="text-slate-400" /> Empty Stale Groups
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Ag-Grids */}
      <div className="glass-card overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-border/20 bg-background/50 px-2">
          <button
            onClick={() => setActiveTab("ownerless-apps")}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "ownerless-apps"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Ownerless Applications ({ownerlessApps.length})
          </button>
          <button
            onClick={() => setActiveTab("ownerless-groups")}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "ownerless-groups"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Ownerless Groups ({ownerlessGroups.length})
          </button>
          <button
            onClick={() => setActiveTab("expired-secrets")}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "expired-secrets"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Expired Secrets ({expiredSecrets.length})
          </button>
          <button
            onClick={() => setActiveTab("expiring-secrets")}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "expiring-secrets"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Expiring Secrets ({expiringSecrets.length})
          </button>
          <button
            onClick={() => setActiveTab("mfa-users")}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "mfa-users"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Users & General Audit ({mfaUsers.length})
          </button>
          <button
            onClick={() => setActiveTab("empty-stale-groups")}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "empty-stale-groups"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Empty Stale Groups ({emptyStaleGroups.length})
          </button>
        </div>

        {/* Ag-Grid Container */}
        <div className="p-4 bg-background/25">
          {activeTab === "ownerless-apps" && (
            <div className="ag-theme-quartz" style={{ height: 420 }}>
              <AgGridReact
                rowData={ownerlessApps}
                columnDefs={[
                  entityNameColumn,
                  { headerName: "Issue Title", field: "title", flex: 1 },
                  { headerName: "Description", field: "description", flex: 1.2 },
                  severityColumn,
                  actionColumn
                ]}
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[10, 20, 50, 100]}
                defaultColDef={defaultColDef}
                rowHeight={50}
              />
            </div>
          )}

          {activeTab === "ownerless-groups" && (
            <div className="ag-theme-quartz" style={{ height: 420 }}>
              <AgGridReact
                rowData={ownerlessGroups}
                columnDefs={[
                  entityNameColumn,
                  { headerName: "Issue Title", field: "title", flex: 1 },
                  { headerName: "Description", field: "description", flex: 1.2 },
                  severityColumn,
                  actionColumn
                ]}
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[10, 20, 50, 100]}
                defaultColDef={defaultColDef}
                rowHeight={50}
              />
            </div>
          )}

          {activeTab === "expired-secrets" && (
            <div className="ag-theme-quartz" style={{ height: 420 }}>
              <AgGridReact
                rowData={expiredSecrets}
                columnDefs={[
                  entityNameColumn,
                  { headerName: "Credential Category", field: "title", width: 220 },
                  { headerName: "Vulnerability Details", field: "description", flex: 1 },
                  severityColumn,
                  actionColumn
                ]}
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[10, 20, 50, 100]}
                defaultColDef={defaultColDef}
                rowHeight={50}
              />
            </div>
          )}

          {activeTab === "expiring-secrets" && (
            <div className="ag-theme-quartz" style={{ height: 420 }}>
              <AgGridReact
                rowData={expiringSecrets}
                columnDefs={[
                  entityNameColumn,
                  { headerName: "Credential Category", field: "title", width: 220 },
                  { headerName: "Vulnerability Details", field: "description", flex: 1 },
                  severityColumn,
                  actionColumn
                ]}
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[10, 20, 50, 100]}
                defaultColDef={defaultColDef}
                rowHeight={50}
              />
            </div>
          )}

          {activeTab === "mfa-users" && (
            <div className="ag-theme-quartz" style={{ height: 420 }}>
              <AgGridReact
                rowData={mfaUsers}
                columnDefs={[
                  entityNameColumn,
                  { headerName: "Audit Finding / Warning", field: "title", width: 250 },
                  { headerName: "Description", field: "description", flex: 1 },
                  severityColumn,
                  actionColumn
                ]}
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[10, 20, 50, 100]}
                defaultColDef={defaultColDef}
                rowHeight={50}
              />
            </div>
          )}

          {activeTab === "empty-stale-groups" && (
            <div className="ag-theme-quartz" style={{ height: 420 }}>
              <AgGridReact
                rowData={emptyStaleGroups}
                columnDefs={[
                  entityNameColumn,
                  { headerName: "Issue Title", field: "title", flex: 1 },
                  { headerName: "Description", field: "description", flex: 1.2 },
                  severityColumn,
                  actionColumn
                ]}
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[10, 20, 50, 100]}
                defaultColDef={defaultColDef}
                rowHeight={50}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
