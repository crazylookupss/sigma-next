"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { useGroups } from "@/hooks/use-groups";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Search, Group as GroupsIcon } from "lucide-react";
import type { EntraGroup } from "@/types/group";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function GroupsPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch, isFetching } = useGroups();
  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    if (!data?.data) return [];
    if (!search.trim()) return data.data;
    const q = search.toLowerCase();
    return data.data.filter(
      (g) =>
        g.displayName?.toLowerCase().includes(q) ||
        g.mail?.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q)
    );
  }, [data, search]);

  const colDefs: ColDef<EntraGroup>[] = useMemo(
    () => [
      {
        field: "displayName",
        headerName: "Display Name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 280,
        cellRenderer: (params: { value: string }) => (
          <div className="flex items-center gap-3 h-full">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center text-sm font-bold">
              G
            </div>
            <span className="font-medium">{params.value}</span>
          </div>
        ),
      },
      {
        field: "description",
        headerName: "Description",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 300,
        cellRenderer: (params: { value: string | null }) => (
          <span className="text-muted-foreground">{params.value ?? "—"}</span>
        ),
      },
      {
        field: "mail",
        headerName: "Mail",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        field: "groupTypes",
        headerName: "Type",
        sortable: true,
        width: 140,
        cellRenderer: (params: { value: string[] }) => {
          const isUnified = params.value?.includes("Unified");
          return (
            <Badge variant={isUnified ? "default" : "secondary"}>
              {isUnified ? "Microsoft 365" : "Security"}
            </Badge>
          );
        },
      },
      {
        field: "memberCount",
        headerName: "Members",
        sortable: true,
        width: 110,
        type: "numericColumn",
      },
      {
        field: "ownersCount",
        headerName: "Owners",
        sortable: true,
        width: 110,
        type: "numericColumn",
      },
      {
        field: "visibility",
        headerName: "Visibility",
        sortable: true,
        width: 120,
        cellRenderer: (params: { value: string | null }) => (
          <Badge variant="outline">{params.value ?? "Private"}</Badge>
        ),
      },
    ],
    []
  );

  return (
    <div className="relative z-10">
      <div className="flex items-center gap-1 mb-4 text-sm text-muted-foreground">
        <span>Identity</span>
        <ChevronRightIcon />
        <span className="text-primary font-semibold">Groups</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Groups</h1>
          <p className="text-sm text-muted-foreground">
            Manage and audit security groups and Microsoft 365 groups.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isLoading && (
            <span className="text-sm text-muted-foreground">
              {filteredGroups.length} groups
            </span>
          )}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 rounded-lg glass-card hover:bg-accent transition-colors text-muted-foreground disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="glass-card p-4 mb-4">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-accent border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

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
          <GroupsIcon className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-foreground font-medium mb-1">Failed to load groups</p>
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
          <div className="ag-theme-quartz" style={{ height: "calc(100vh - 320px)", minHeight: 400 }}>
            <AgGridReact
              rowData={filteredGroups}
              columnDefs={colDefs}
              pagination={true}
              paginationPageSize={50}
              onRowClicked={(e) => { if (e.data) router.push(`/groups/${e.data.id}`); }}
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
