"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { useApplications } from "@/hooks/use-applications";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/shared/search-input";
import { RefreshCw, Code2 } from "lucide-react";
import type { EntraApplication } from "@/types/application";
import type { PagedResponse } from "@/types/common";
import { formatDate } from "@/lib/utils";

ModuleRegistry.registerModules([AllCommunityModule]);

function extractApplications(data: PagedResponse<EntraApplication> | EntraApplication[] | unknown): EntraApplication[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as EntraApplication[];
    if (obj.data && typeof obj.data === "object") {
      const nested = obj.data as Record<string, unknown>;
      if (Array.isArray(nested.data)) return nested.data as EntraApplication[];
    }
  }
  return [];
}

export function AppRegistrationsClient() {
  const router = useRouter();
  const { data, isLoading, error, refetch, isFetching } = useApplications();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const handleRowClicked = useCallback(
    (params: { data?: EntraApplication }) => {
      if (params.data?.id) router.push(`/app-registrations/${params.data.id}`);
    },
    [router]
  );

  const filtered = useMemo(() => {
    const list = extractApplications(data);
    if (!deferredSearch.trim()) return list;
    const q = deferredSearch.toLowerCase();
    return list.filter(
      (a) =>
        a.displayName?.toLowerCase().includes(q) ||
        a.appId?.toLowerCase().includes(q) ||
        a.publisherDomain?.toLowerCase().includes(q)
    );
  }, [data, deferredSearch]);

  const colDefs: ColDef<EntraApplication>[] = useMemo(
    () => [
      {
        field: "displayName",
        headerName: "Display Name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 300,
        cellRenderer: (params: { value: string }) => (
          <div className="flex items-center gap-3 h-full">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-500 flex items-center justify-center text-sm font-bold">
              {params.value?.[0]?.toUpperCase() ?? "A"}
            </div>
            <span className="font-medium">{params.value}</span>
          </div>
        ),
      },
      {
        field: "appId",
        headerName: "Application (Client) ID",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 280,
        cellRenderer: (params: { value: string }) => (
          <span className="font-mono text-xs text-muted-foreground">{params.value}</span>
        ),
      },
      { field: "publisherDomain", headerName: "Publisher Domain", sortable: true, filter: "agTextColumnFilter", width: 200 },
      {
        field: "signInAudience",
        headerName: "Sign-In Audience",
        sortable: true,
        width: 180,
        cellRenderer: (params: { value: string }) => <Badge variant="outline">{params.value}</Badge>,
      },
      {
        field: "createdDateTime",
        headerName: "Created",
        sortable: true,
        width: 160,
        cellRenderer: (params: { value: string | null }) => (
          <span className="text-muted-foreground">{formatDate(params.value)}</span>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">App Registrations</h1>
          <p className="text-sm text-muted-foreground">View and manage application registrations in the directory.</p>
        </div>
        <div className="flex items-center gap-3">
          {!isLoading && <span className="text-sm text-muted-foreground">{filtered.length} apps</span>}
          <button onClick={() => refetch()} disabled={isFetching} className="p-2 rounded-lg glass-card hover:bg-accent transition-colors text-muted-foreground disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="glass-card p-4 mb-4">
        <div className="max-w-xs">
          <SearchInput value={search} onChange={setSearch} placeholder="Search app registrations..." />
        </div>
      </div>

      {isLoading ? (
        <div className="glass-card p-6 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-3 w-1/4" /></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="glass-card p-8 text-center">
          <Code2 className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-foreground font-medium mb-1">Failed to load app registrations</p>
          <p className="text-sm text-muted-foreground mb-4">{(error as Error).message}</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Retry</button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="ag-theme-quartz" style={{ height: "calc(100vh - 320px)", minHeight: 400 }}>
            <AgGridReact
              rowData={filtered}
              columnDefs={colDefs}
              pagination={true}
              paginationPageSize={50}
              onRowClicked={handleRowClicked}
              defaultColDef={{ resizable: true, cellStyle: { display: "flex", alignItems: "center" } }}
              rowHeight={52}
              headerHeight={44}
              suppressCellFocus={true}
              animateRows={true}
              rowStyle={{ cursor: "pointer" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
