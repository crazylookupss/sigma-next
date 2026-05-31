"use client";

import { useQuery } from "@tanstack/react-query";
import { governanceService } from "@/services/governance";

export function useGovernanceFindings() {
  return useQuery({
    queryKey: ["governance", "findings"],
    queryFn: ({ signal }) => governanceService.getFindings(signal),
    staleTime: 0,           // always fetch fresh on mount
    gcTime: 0,              // don't keep empty results in cache
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useGovernanceSummary() {
  return useQuery({
    queryKey: ["governance", "summary"],
    queryFn: ({ signal }) => governanceService.getSummary(signal),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

