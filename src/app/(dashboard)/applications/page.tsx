"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { useServicePrincipals, useAppDashboard } from "@/hooks/use-applications";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  RefreshCw,
  Search,
  AppWindow,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import type { EntraServicePrincipal } from "@/types/application";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function ApplicationsPage() {
  const router = useRouter();
  const { data: spData, isLoading, error, refetch, isFetching } = useServicePrincipals();
  const { data: dashboard, isLoading: dashLoading } = useAppDashboard();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!spData) return [];

    let list: any[] = [];
    if (Array.isArray(spData)) {
      list = spData;
    } else if (spData && typeof spData === "object") {
      if (Array.isArray((spData as any).data)) {
        list = (spData as any).data;
      } else if ((spData as any).data && typeof (spData as any).data === "object" && Array.isArray((spData as any).data.data)) {
        list = (spData as any).data.data;
      }
    }

    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (s) =>
        s.displayName?.toLowerCase().includes(q) ||
        s.appDisplayName?.toLowerCase().includes(q) ||
        s.id?.toLowerCase().includes(q)
    );
  }, [spData, search]);

  const colDefs: ColDef<EntraServicePrincipal>[] = useMemo(
    () => [
      {
        field: "displayName",
        headerName: "Display Name",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 300,
        flex: 2,
        cellRenderer: (params: { value: string }) => (
          <div className="flex items-center gap-3 h-full">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center text-sm font-bold">
              {params.value?.[0]?.toUpperCase() ?? "A"}
            </div>
            <span className="font-medium">{params.value}</span>
          </div>
        ),
      },
      {
        field: "signInStatus",
        headerName: "Status",
        sortable: true,
        minWidth: 120,
        flex: 1,
        cellRenderer: (params: { value: string }) => {
          const map: Record<string, "active" | "warning" | "error"> = {
            active: "active",
            warning: "warning",
            error: "error",
          };
          const val = params.value?.toLowerCase() ?? "";
          return <StatusBadge status={map[val] ?? "unknown"} />;
        },
      },
      {
        field: "appRoleAssignmentRequired",
        headerName: "Assignment",
        sortable: true,
        minWidth: 130,
        flex: 1,
        cellRenderer: (params: { value: boolean }) => (
          <Badge variant={params.value ? "default" : "secondary"}>
            {params.value ? "Required" : "Optional"}
          </Badge>
        ),
      },
      {
        field: "preferredSingleSignOnMode",
        headerName: "SSO Mode",
        sortable: true,
        minWidth: 140,
        flex: 1,
        cellRenderer: (params: { value: string | null }) => (
          <Badge variant="outline">{params.value ?? "—"}</Badge>
        ),
      },
    ],
    []
  );

  return (
    <div className="relative z-10">
      <div className="flex items-center gap-1 mb-4 text-sm text-muted-foreground">
        <span>Applications</span>
        <ChevronRightIcon />
        <span className="text-primary font-semibold">Enterprise Applications</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Enterprise Applications</h1>
          <p className="text-sm text-muted-foreground">
            Manage and monitor service principals and enterprise app configurations.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-2 rounded-lg glass-card hover:bg-accent transition-colors text-muted-foreground disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Apps"
          value={dashboard?.totalApps}
          icon={<AppWindow className="w-5 h-5" style={{ color: "#f59e0b" }} />}
          accentColor="amber"
        />
        <MetricCard
          title="Active"
          value={dashboard?.activeCount}
          icon={<CheckCircle2 className="w-5 h-5" style={{ color: "#10b981" }} />}
          accentColor="teal"
        />
        <MetricCard
          title="Warning"
          value={dashboard?.warningCount}
          icon={<AlertTriangle className="w-5 h-5" style={{ color: "#f59e0b" }} />}
          accentColor="amber"
        />
        <MetricCard
          title="Expired/Critical"
          value={dashboard?.expiredCount}
          icon={<XCircle className="w-5 h-5" style={{ color: "#ef4444" }} />}
          accentColor="blue"
        />
      </div>

      {/* Search */}
      <div className="glass-card p-4 mb-4">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-accent border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="glass-card p-6 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="glass-card p-8 text-center">
          <AppWindow className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-foreground font-medium mb-1">Failed to load applications</p>
          <p className="text-sm text-muted-foreground mb-4">{(error as Error).message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="ag-theme-quartz" style={{ height: "calc(100vh - 430px)", minHeight: 400 }}>
            <AgGridReact
              rowData={filtered}
              columnDefs={colDefs}
              pagination={true}
              paginationPageSize={50}
              onRowClicked={(e) => { if (e.data) router.push(`/applications/${e.data.id}`); }}
              defaultColDef={{
                resizable: true,
                cellStyle: { display: "flex", alignItems: "center" },
              }}
              rowHeight={52}
              headerHeight={44}
              suppressCellFocus={true}
              animateRows={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
