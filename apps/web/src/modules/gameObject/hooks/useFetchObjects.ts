"use client";

import { DeepInferUseQueryResult } from "@/utils/generic/types";
import { createClient } from "@/utils/supabase/client";
import { InferAsync } from "@repo/utils";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export interface UseFetchObjectsFilters {
  gameId?: number;
  type?: "character" | "gadget";
}

export type GameObjectData = DeepInferUseQueryResult<typeof useFetchObjects>;

async function fetchObjects(filters: UseFetchObjectsFilters) {
  const qb = createClient().from("game_object").select();
  if (filters.gameId) qb.eq("game_id", filters.gameId);
  if (filters.type) qb.eq("type", filters.type);
  return (await qb).data;
}

export function useFetchObjects(
  filters: UseFetchObjectsFilters,
): UseQueryResult<InferAsync<ReturnType<typeof fetchObjects>>> {
  return useQuery({
    queryKey: ["gameObjects", JSON.stringify(filters)],
    queryFn: async () => fetchObjects(filters),
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
}
