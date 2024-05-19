"use client";

import { createClient } from "@/utils/supabase/client";
import { Enums } from "@/utils/supabase/types";
import { InferAsync } from "@repo/utils";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { DeepInferUseQueryResult } from "@/utils/generic/types";

export interface UseFetchObjectsFilters {
  gameId?: number;
  type?: Enums<"game_object_type">;
}

async function fetchObjects(filters: UseFetchObjectsFilters) {
  const qb = createClient().from("game_object").select();
  if (filters.gameId) qb.eq("game_id", filters.gameId);
  if (filters.type) qb.eq("type", filters.type);
  return qb;
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

export type GameObjectData = DeepInferUseQueryResult<typeof useFetchObjects>;