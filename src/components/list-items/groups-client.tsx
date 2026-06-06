"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import "@/lib/ag-grid-modules";
import { useGroups } from "@/hooks/use-groups";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/shared/search-input";
import { RefreshCw, Group as GroupsIcon } from "lucide-react";
import type { EntraGroup } from "@/types/group";

import { memo } from "react";

const GroupDisplayNameCell = memo((params: { value: string }) => (
  <div className="flex items-center gap-3 h-full">
    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center text-sm font-bold">G</div>
    <span className="font-medium">{params.value}</span>
  </div>
));
GroupDisplayNameCell.displayName = "GroupDisplayNameCell";

const GroupDescriptionCell = memo((params: { value: string | null }) => (
  <span className="text-muted-foreground">{params.value ?? "—"}</span>
));
GroupDescriptionCell.displayName = "GroupDescriptionCell";

const GroupTypeCell = memo((params: { value: string[] }) => {
  const isUnified = params.value?.includes("Unified");
  return <Badge variant={isUnified ? "default" : "secondary"}>{isUnified ? "Microsoft 365" : "Security"}</Badge>;
});
GroupTypeCell.displayName = "GroupTypeCell";

const GroupVisibilityCell = memo((params: { value: string | null }) => (
  <Badge variant="outline">{params.value ?? "Private"}</Badge>
));
GroupVisibilityCell.displayName = "GroupVisibilityCell";

export function GroupsClient() {
  const router = useRouter();
  const { data, isLoading, error, refetch, isFetching } = useGroups();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const handleRowClicked = useCallback(
    (params: { data?: EntraGroup }) => {
      if (params.data) router.push(`/groups/${params.data.id}`);
    },
    [router]
  );

  const filteredGroups = useMemo(() => {
    if (!data?.data) return [];
    if (!deferredSearch.trim()) return data.data;
    const q = deferredSearch.toLowerCase();
    return data.data.filter(
      (g) =>
        g.displayName?.toLowerCase().includes(q) ||
        g.mail?.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q)
    );
  }, [data, deferredSearch]);

  const colDefs: ColDef<EntraGroup>[] = useMemo(
    () => [
      {
        field: "displayName",
        headerName: "Display Name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 280,
        cellRenderer: GroupDisplayNameCell,
      },
      {
        field: "description",
        headerName: "Description",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 300,
        cellRenderer: GroupDescriptionCell,
      },
      { field: "mail", headerName: "Mail", sortable: true, filter: "agTextColumnFilter", width: 250 },
      {
        field: "groupTypes",
        headerName: "Type",
        sortable: true,
        width: 140,
        cellRenderer: GroupTypeCell,
      },
      { field: "memberCount", headerName: "Members", sortable: true, width: 110, type: "numericColumn" },
      { field: "ownersCount", headerName: "Owners", sortable: true, width: 110, type: "numericColumn" },
      {
        field: "visibility",
        headerName: "Visibility",
        sortable: true,
        width: 120,
        cellRenderer: GroupVisibilityCell,
      },
    ],
    []
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Groups</h1>
          <p className="text-sm text-muted-foreground">Manage and audit security groups and Microsoft 365 groups.</p>
        </div>
        <div className="flex items-center gap-3">
          {!isLoading && <span className="text-sm text-muted-foreground">{filteredGroups.length} groups</span>}
          <button onClick={() => refetch()} disabled={isFetching} className="p-2 rounded-lg glass-card hover:bg-accent transition-colors text-muted-foreground disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="glass-card p-4 mb-4">
        <div className="max-w-xs">
          <SearchInput value={search} onChange={setSearch} placeholder="Search groups..." />
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
          <GroupsIcon className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-foreground font-medium mb-1">Failed to load groups</p>
          <p className="text-sm text-muted-foreground mb-4">{(error as Error).message}</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Retry</button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="ag-theme-quartz" style={{ height: "calc(100vh - 320px)", minHeight: 400 }}>
            <AgGridReact
              rowData={filteredGroups}
              columnDefs={colDefs}
              pagination={true}
              paginationPageSize={50}
              onRowClicked={handleRowClicked}
              defaultColDef={{ resizable: true, cellStyle: { display: "flex", alignItems: "center" } }}
              rowHeight={52}
              headerHeight={44}
              suppressCellFocus={true}
              animateRows={true}
            />
          </div>
        </div>
      )}
    </>
  );
}
