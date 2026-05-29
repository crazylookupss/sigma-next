"use client";

import { useQuery } from "@tanstack/react-query";
import { tenantService } from "@/services/tenant";

export function useTenant() {
  return useQuery({
    queryKey: ["tenant"],
    queryFn: ({ signal }) => tenantService.getTenant(signal),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}
