"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { useUsers } from "@/hooks/use-users";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/shared/search-input";
import { ChevronRightIcon } from "@/components/shared/chevron-right";
import { RefreshCw, Users as UsersIcon } from "lucide-react";
import type { SigmaUserDto } from "@/types/user";
import type { PagedResponse } from "@/types/common";
import { getInitials } from "@/lib/utils";

ModuleRegistry.registerModules([AllCommunityModule]);

function extractUsers(data: PagedResponse<SigmaUserDto> | SigmaUserDto[] | unknown): SigmaUserDto[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as SigmaUserDto[];
    if (obj.data && typeof obj.data === "object") {
      const nested = obj.data as Record<string, unknown>;
      if (Array.isArray(nested.data)) return nested.data as SigmaUserDto[];
    }
  }
  return [];
}

export default function UsersPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch, isFetching } = useUsers();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const handleRowClicked = useCallback(
    (params: { data?: SigmaUserDto }) => {
      if (params.data) router.push(`/users/${params.data.id}`);
    },
    [router]
  );

  const filteredUsers = useMemo(() => {
    const list = extractUsers(data);
    if (!deferredSearch.trim()) return list;
    const q = deferredSearch.toLowerCase();
    return list.filter(
      (u) =>
        u.displayName?.toLowerCase().includes(q) ||
        u.userPrincipalName?.toLowerCase().includes(q) ||
        u.mail?.toLowerCase().includes(q) ||
        u.jobTitle?.toLowerCase().includes(q) ||
        u.userType?.toLowerCase().includes(q)
    );
  }, [data, deferredSearch]);

  const colDefs: ColDef<SigmaUserDto>[] = useMemo(
    () => [
      {
        field: "displayName",
        headerName: "Display Name",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 250,
        cellRenderer: (params: { value: string; data: SigmaUserDto }) => (
          <div className="flex items-center gap-3 h-full">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
              {getInitials(params.value)}
            </div>
            <span className="font-medium">{params.value}</span>
          </div>
        ),
      },
      {
        field: "userPrincipalName",
        headerName: "UPN",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 280,
      },
      {
        field: "mail",
        headerName: "Mail",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        field: "jobTitle",
        headerName: "Job Title",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        field: "accountEnabled",
        headerName: "Status",
        sortable: true,
        width: 130,
        cellRenderer: (params: { value: boolean | null }) => {
          if (params.value === true)
            return (
              <div className="flex items-center gap-2 h-full">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span className="text-sm font-medium text-success">Enabled</span>
              </div>
            );
          if (params.value === false)
            return (
              <div className="flex items-center gap-2 h-full">
                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Disabled</span>
              </div>
            );
          return (
            <div className="flex items-center gap-2 h-full">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />
              <span className="text-sm">Unknown</span>
            </div>
          );
        },
      },
      {
        field: "userType",
        headerName: "User Type",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 140,
        cellRenderer: (params: { value: string | null }) =>
          params.value ? (
            <Badge variant="secondary">{params.value}</Badge>
          ) : (
            <Badge variant="outline">Member</Badge>
          ),
      },
    ],
    []
  );

  return (
    <div className="relative z-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 mb-4 text-sm text-muted-foreground">
        <span>Identity</span>
        <ChevronRightIcon />
        <span className="text-primary font-semibold">Users</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage and audit user directory identities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isLoading && (
            <span className="text-sm text-muted-foreground">
              {filteredUsers.length} users
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

      {/* Search */}
      <div className="glass-card p-4 mb-4">
        <div className="max-w-xs">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search users..."
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="glass-card p-6 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="glass-card p-8 text-center">
          <UsersIcon className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-foreground font-medium mb-1">Failed to load users</p>
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
              rowData={filteredUsers}
              columnDefs={colDefs}
              pagination={true}
              paginationPageSize={50}
              onRowClicked={handleRowClicked}
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


