"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRightIcon } from "@/components/shared/chevron-right";

const UsersClient = dynamic(
  () => import("@/components/list-items").then((mod) => mod.UsersClient),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6">
        <div className="flex items-center gap-1 mb-4 text-sm text-muted-foreground">
          <span>Identity</span>
          <ChevronRightIcon />
          <span className="text-primary font-semibold">Users</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <Skeleton className="h-7 w-24 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
        <div className="glass-card p-4 mb-4">
          <Skeleton className="h-10 w-64" />
        </div>
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
      </div>
    ),
  }
);

export default function UsersPage() {
  return (
    <div className="relative z-10">
      <div className="flex items-center gap-1 mb-4 text-sm text-muted-foreground">
        <span>Identity</span>
        <ChevronRightIcon />
        <span className="text-primary font-semibold">Users</span>
      </div>
      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <Skeleton className="h-7 w-24 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
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
          </div>
        }
      >
        <UsersClient />
      </Suspense>
    </div>
  );
}
