"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/users";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: ({ signal }) => userService.getUsers(signal),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: ({ signal }) => userService.getUserById(id, signal),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
}
