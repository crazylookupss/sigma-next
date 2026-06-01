"use client";

import { useQuery } from "@tanstack/react-query";
import { governanceService } from "@/services/governance";

export function useGovernanceFindings() {
  return useQuery({
    queryKey: ["governance", "findings"],
    queryFn: ({ signal }) => governanceService.getFindings(signal),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useGovernanceSummary() {
  return useQuery({
    queryKey: ["governance", "summary"],
    queryFn: ({ signal }) => governanceService.getSummary(signal),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
