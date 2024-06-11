import { createClient } from "@/utils/supabase/client";
import { InferAsync } from "@repo/utils";
import { useQuery } from "@tanstack/react-query";

async function fetchLevels(arenaId: number) {
  const { data } = await createClient()
    .from("arena_level")
    .select()
    .eq("arena_id", arenaId);
  return data ?? [];
}

export type GetLevelData = InferAsync<ReturnType<typeof fetchLevels>>[number];

/** Fetches all levels from an arena (provided by `arenaId`) */
export function useGetLevels(arenaId: number) {
  return useQuery({
    queryKey: ["levels", arenaId],
    queryFn: () => fetchLevels(arenaId),
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
}
