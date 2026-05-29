import { fetchApi } from "./api-client";
import type { PagedResponse } from "@/types/common";
import type { SigmaUserDto } from "@/types/user";

export const userService = {
  getUsers: (signal?: AbortSignal) =>
    fetchApi<PagedResponse<SigmaUserDto>>("/users", { signal }),

  getUserById: (id: string, signal?: AbortSignal) =>
    fetchApi<SigmaUserDto>(`/users/${id}`, { signal }),
};
