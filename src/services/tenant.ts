import { fetchApi } from "./api-client";
import type { EntraTenant } from "@/types/tenant";

export const tenantService = {
  getTenant: (signal?: AbortSignal) =>
    fetchApi<EntraTenant>("/tenant", { signal }),
};
